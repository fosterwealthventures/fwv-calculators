// scripts/generateBulk.ts
import fs from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { parse as parseCsv } from "csv-parse/sync";
import OpenAI from "openai";
import matter from "gray-matter";
import { slugify, CONTENT_DIR } from "../lib/blog.ts";
import "dotenv/config";

type Row = {
  topic: string;
  serp?: string;
  tags?: string;
  prependDate?: boolean | string;
  ext?: "md" | "mdx" | string;
  longform?: boolean | string;
};

type Out = {
  title: string;
  description: string;
  slug: string;
  excerpt: string;
  tags: string[];
  body: string;
};

function parseArgs() {
  return yargs(hideBin(process.argv))
    .option("file", { type: "string", describe: "Path to CSV, JSON array, or NDJSON of topics" })
    .option("topics", { type: "string", describe: "Comma-separated topic list" })
    .option("serp", { type: "string", describe: "Default SERP URLs (comma-separated)" })
    .option("tags", { type: "string", describe: "Default tags (comma-separated)" })
    .option("prepend-date", { type: "boolean", default: false })
    .option("ext", { type: "string", default: "mdx", choices: ["md", "mdx"] })
    .option("longform", { type: "boolean", default: false })
    .option("delay-ms", { type: "number", default: 1200 })
    .parseSync();
}

function coerceBool(v: unknown, fallback = false) {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return ["1", "true", "yes", "y"].includes(v.toLowerCase());
  return fallback;
}

function rowsFromTopicsString(s?: string): Row[] {
  return s ? String(s).split(",").map((t) => ({ topic: t.trim() })) : [];
}

function readRows(file?: string, topicsArg?: string): Row[] {
  if (!file) return rowsFromTopicsString(topicsArg);
  const raw = fs.readFileSync(path.resolve(file), "utf8").trim();
  if (raw.startsWith("[")) return JSON.parse(raw) as Row[]; // JSON array
  if (raw.split("\n").some((l) => l.trim().startsWith("{"))) {
    return raw.split("\n").filter(Boolean).map((l) => JSON.parse(l) as Row); // NDJSON
  }
  const recs = parseCsv(raw, { columns: true, skip_empty_lines: true }) as Row[];
  return recs.map((r) => {
    if (!("topic" in r)) {
      const keys = Object.keys(r);
      return { topic: (r as any)[keys[0]] } as Row;
    }
    return r;
  });
}

async function generateOne(
  openai: OpenAI,
  row: Row,
  defaults: { serp?: string; tags?: string; prependDate: boolean; ext: "md" | "mdx"; longform: boolean }
) {
  const topic = row.topic?.trim();
  if (!topic) return { skipped: true, reason: "Missing topic" };

  const serp = (row.serp ?? defaults.serp ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const tags = (row.tags ?? defaults.tags ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const prependDate = coerceBool(row.prependDate ?? defaults.prependDate, false);
  const ext = ((row.ext ?? defaults.ext) as "md" | "mdx");
  const longform = coerceBool(row.longform ?? defaults.longform, false);

  const prompt = `You are a senior SEO editor.
Goal: Produce a blog post that ANSWERS THE QUESTION IN THE FIRST PARAGRAPH and matches current search intent and page format.
Topic/Keyword: "${topic}"
Top ranking references (do NOT copy; mirror headings/order/coverage): ${serp.length ? serp.join(", ") : "N/A"}

Return strict JSON with keys: title, description, slug, excerpt, tags, body.

Rules:
- Title: clear, keyword-focused, <= 60 chars where possible.
- H1 must match Title (we will inject H1 from your title; do NOT include H1 in body).
- First paragraph MUST directly answer the query (one crisp paragraph).
- Use logical H2s that reflect what’s ranking (definitions, steps, examples, calculator CTA, FAQs).
- Scannable structure: short paragraphs, bullet lists, numbered workflows.
- Include a short FAQ (2–3 Q/A) at the end with H2 "FAQs".
- Tone: professional, approachable, precise. American English.
${longform ? "- Target length: about 1200–1600 words if intent is informational.\n" : ""}`;

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "You return strict JSON for a blog CMS." },
      { role: "user", content: prompt },
    ],
  });

  const raw = resp.choices?.[0]?.message?.content;
  if (!raw) return { skipped: true, reason: "Empty model response" };

  let out: Out;
  try {
    out = JSON.parse(raw) as Out;
  } catch {
    return { skipped: true, reason: "Bad JSON from model" };
  }

  const dt = new Date();
  const isoDate = dt.toISOString().slice(0, 10);

  let finalSlug = slugify(out.slug || out.title);
  if (prependDate) finalSlug = `${isoDate}-${finalSlug}`;

  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  const filePath = path.join(CONTENT_DIR, `${finalSlug}.${ext}`);

  if (fs.existsSync(filePath)) return { skipped: true, reason: "Exists", filePath };

  const front = matter.stringify("", {
    title: out.title,
    description: out.description,
    slug: finalSlug,
    date: new Date().toISOString(),
    tags: out.tags?.length ? out.tags : tags,
    excerpt: out.excerpt,
  })
    .trim()
    .replace(/^---\n|\n---$/g, "");

  const doc = `---
${front}
---

# ${out.title}

${out.body.trim()}
`;

  fs.writeFileSync(filePath, doc, "utf8");
  return { ok: true, filePath };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const argv = parseArgs();
  const rows = readRows(argv.file as string | undefined, argv.topics as string | undefined);
  if (!rows.length) {
    console.error("No topics found. Use --file=... or --topics=...");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const results: { ok?: true; skipped?: true; filePath?: string; reason?: string }[] = [];
  for (const row of rows) {
    const res = await generateOne(openai, row, {
      serp: argv.serp as string | undefined,
      tags: argv.tags as string | undefined,
      prependDate: Boolean(argv.prependDate),
      ext: (argv.ext as "md" | "mdx") ?? "mdx",
      longform: Boolean(argv.longform),
    });
    if (res.ok) console.log("✅ Created:", res.filePath);
    else console.log(`⏭️  Skipped: ${row.topic} — ${res.reason}${res.filePath ? " (" + res.filePath + ")" : ""}`);
    results.push(res);
    await sleep(Number(argv.delayMs));
  }

  const created = results.filter((r) => r.ok).length;
  const skipped = results.filter((r) => r.skipped).length;
  console.log(`\nDone. Created ${created}, Skipped ${skipped}.`);
}

main().catch((err) => {
  console.error("Bulk generation failed:", err);
  process.exit(1);
});
