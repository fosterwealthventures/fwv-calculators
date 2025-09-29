// scripts/generatePost.ts
// Production-ready auto-blog generator for Next.js content repos.
// Run with: npx tsx scripts/generatePost.ts "Your Post Title" --serp="https://a.com,https://b.com" --tags="seo,finance" --model=gpt-4o-mini

import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

// ---------- Config ----------
const DEFAULT_OUT_DIR = "content/blog";
const DEFAULT_MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
const MAX_RETRIES = 4;
const RETRY_BASE_MS = 800;

// ---------- Helpers ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function log(step: string, ...args: any[]) {
  const ts = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.log(`[generatePost][${ts}] ${step}`, ...args);
}

function fail(msg: string): never {
  // eslint-disable-next-line no-console
  console.error(`\n❌ ${msg}\n`);
  process.exit(1);
}

function toLF(s: string) {
  // normalize CRLF -> LF to avoid hidden \r problems on Windows
  return s.replace(/\r\n/g, "\n");
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/['"’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parseFlags(argv: string[]) {
  const flags: Record<string, string | boolean> = {};
  for (const raw of argv) {
    if (!raw.startsWith("--")) continue;
    const eq = raw.indexOf("=");
    if (eq === -1) {
      flags[raw.slice(2)] = true;
    } else {
      const k = raw.slice(2, eq);
      const v = raw.slice(eq + 1);
      flags[k] = v;
    }
  }
  return flags;
}

function splitCsv(val?: string): string[] {
  if (!val) return [];
  return val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function assertOpenAIKey(): string {
  const raw = (process.env.OPENAI_API_KEY ?? "").trim();
  if (!raw) fail("OPENAI_API_KEY is missing. Add it to your .env as a single line.");
  if (/\r|\n/.test(raw)) {
    fail(
      "OPENAI_API_KEY contains a newline. Ensure it's one line with no quotes or trailing spaces."
    );
  }
  // Basic format sanity check (project keys often start with sk-proj-)
  if (!/^sk-[A-Za-z0-9_-]+$/.test(raw)) {
    log("warn", "OPENAI_API_KEY has an unexpected format, continuing anyway…");
  }
  return raw;
}

async function withRetries<T>(fn: () => Promise<T>): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastErr = err;
      const code = err?.status ?? err?.code ?? err?.response?.status;
      const retryable =
        code === 429 || (typeof code === "number" && code >= 500 && code < 600);
      const delay = Math.round(RETRY_BASE_MS * Math.pow(1.8, i) + Math.random() * 250);
      log("error", `Attempt ${i + 1} failed${code ? ` (code ${code})` : ""}: ${err?.message || err}`);
      if (i < MAX_RETRIES - 1 && retryable) {
        log("info", `Retrying in ${delay}ms…`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      break;
    }
  }
  throw lastErr;
}

// ---------- Main ----------
(async () => {
  const [, , ...rest] = process.argv;

  // Title (positional)
  const title = rest.find((a) => !a.startsWith("--"));
  if (!title) {
    fail('Usage: npx tsx scripts/generatePost.ts "Post Title" --serp="https://a.com,https://b.com" --tags="finance,roi"');
  }

  const flags = parseFlags(rest);
  const model = (flags.model as string) || DEFAULT_MODEL;
  const outDir = (flags.out as string) || DEFAULT_OUT_DIR;
  const dryRun = Boolean(flags.dry);

  const serpUrls = splitCsv(flags.serp as string);
  const tags = splitCsv(flags.tags as string);

  // Ensure env OK
  const apiKey = assertOpenAIKey();
  const openai = new OpenAI({ apiKey });

  // Ensure output folder
  const absOutDir = path.isAbsolute(outDir) ? outDir : path.join(process.cwd(), outDir);
  fs.mkdirSync(absOutDir, { recursive: true });

  // Build prompt
  const today = new Date().toISOString().slice(0, 10);
  const slug = slugify(title);
  const fmTags = tags.length ? tags : ["finance", "analytics", "calculators"];

  const systemPrompt = toLF(`You are a precise, engaging financial/operations content writer.
Write SEO-friendly, accurate, skimmable articles for a calculators site.
Audience: small-business owners, founders, freelancers, and consumers.
Tone: helpful, credible, plain-language; no fluff; short paragraphs; useful examples.
ALWAYS include a short TL;DR, a clear step-by-step "How to use the calculator" section,
and a "Common mistakes & how to avoid them" section. Keep headings concise.
When useful, include very small code examples or formulas in fenced blocks.
Do NOT invent quotes. If URLs are provided, cite them in a "Sources" list at the end.`);

  const userPrompt = toLF(`TITLE: ${title}

CONTEXT:
- Site focus: Professional Business & Financial Calculator Suites.
- Topic: ${title}
- Tags: ${fmTags.join(", ")}
- Date: ${today}
- Provided reference URLs (optional): ${serpUrls.length ? serpUrls.join(", ") : "none"}

REQUIREMENTS:
- Return valid Markdown only.
- Start with an H1 of the exact title.
- Then a 2–3 sentence intro.
- Provide a short TL;DR list.
- Include: Key concepts, Step-by-step usage, Worked example, Formula(s) (with variables explained),
  Common mistakes & fixes, FAQ (3–5 Qs), and a short Conclusion.
- Add "Sources" as a bullet list using the provided URLs (if any).
- Keep it 900–1400 words.
`);

  log("info", `Generating post with model "${model}"…`);

  const completion = await withRetries(() =>
    openai.chat.completions.create({
      model,
      temperature: 0.6,
      max_tokens: 1600,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    })
  );

  const md = completion.choices?.[0]?.message?.content?.trim();
  if (!md) fail("OpenAI returned no content.");

  // Compose front matter + content
  const frontmatter = [
    "---",
    `title: "${title.replace(/"/g, '\\"')}"`,
    `date: "${today}"`,
    `tags: [${fmTags.map((t) => `"${t}"`).join(", ")}]`,
    `slug: "${slug}"`,
    serpUrls.length ? `sources:\n${serpUrls.map((u) => `  - "${u}"`).join("\n")}` : undefined,
    "---",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  const finalContent = toLF(`${frontmatter}${md}\n`);

  // Write file
  const outPath = path.join(absOutDir, `${slug}.md`);
  if (dryRun) {
    log("info", "(dry run) Would write:", outPath);
    // eslint-disable-next-line no-console
    console.log("\n----- PREVIEW -----\n");
    // eslint-disable-next-line no-console
    console.log(finalContent.slice(0, 2000));
  } else {
    fs.writeFileSync(outPath, finalContent, { encoding: "utf8" });
    log("success", `Wrote ${outPath}`);
  }

  log("info", "If you maintain a sitemap, run: npx tsx scripts/updateSitemap.ts");
})().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("\n💥 Unhandled error in generatePost:", err?.response?.data || err);
  process.exit(1);
});
