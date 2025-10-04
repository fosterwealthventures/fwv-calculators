// scripts/generatePost.ts
// Auto-blog generator without external CLI deps (no yargs).
// Usage:
//   npx tsx scripts/generatePost.ts "Your Post Title" --serp="https://a.com,https://b.com" --tags="seo,finance" --model=gpt-4o-mini --out=content/blog
// Add --dry to preview without writing a file.

import "dotenv/config";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

// ---------- Defaults ----------
const DEFAULT_OUT_DIR = "content/blog";
const DEFAULT_MODEL = (process.env.OPENAI_MODEL || "").trim() || "gpt-4o-mini";
const MAX_RETRIES = 3;

// ---------- Helpers ----------
function assertOpenAIKey(): string {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    throw new Error("OPENAI_API_KEY is missing. Add it to your environment or .env file.");
  }
  return key;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function splitCsv(v?: string): string[] {
  if (!v) return [];
  return v.split(",").map((s) => s.trim()).filter(Boolean);
}

type FlagMap = Record<string, string | boolean | undefined>;

function parseFlags(argv: string[]): { title: string; flags: FlagMap } {
  if (!argv.length) {
    throw new Error('Missing title. Example: npx tsx scripts/generatePost.ts "My Post" --tags="seo,finance"');
  }
  const parts = [...argv];
  const titleParts: string[] = [];
  while (parts.length && !/^--/.test(parts[0])) titleParts.push(parts.shift() as string);
  const title = titleParts.join(" ").trim();
  if (!title) throw new Error("Title is required as the first argument.");

  const flags: FlagMap = {};
  while (parts.length) {
    const token = parts.shift() as string;
    if (!token.startsWith("--")) continue;
    const eq = token.indexOf("=");
    let key = token.replace(/^--/, "");
    let value: string | boolean | undefined = true;
    if (eq >= 0) {
      key = token.slice(2, eq);
      value = token.slice(eq + 1);
    } else if (parts.length && !parts[0].startsWith("--")) {
      value = parts.shift();
    }
    flags[key] = value;
  }
  return { title, flags };
}

function fm(dateISO: string, title: string, slug: string, excerpt: string, tags: string[]) {
  const fmObj = { title, date: dateISO, slug, excerpt, tags };
  const yaml = Object.entries(fmObj)
    .map(([k, v]) => (Array.isArray(v) ? `${k}: [${v.map((x) => JSON.stringify(x)).join(", ")}]` : `${k}: ${JSON.stringify(v)}`))
    .join("\n");
  return `---\n${yaml}\n---\n\n`;
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function log(level: "info" | "warn" | "error", msg: string) {
  console[level](`[${level.toUpperCase()}] ${msg}`);
}

// ---------- Main ----------
async function main() {
  const { title, flags } = parseFlags(process.argv.slice(2));
  const model = (flags.model as string) || DEFAULT_MODEL;
  const outDir = (flags.out as string) || DEFAULT_OUT_DIR;
  const dryRun = Boolean(flags.dry);

  const serpUrls = splitCsv(flags.serp as string);
  const tagList = splitCsv(flags.tags as string);

  const apiKey = assertOpenAIKey();
  const openai = new OpenAI({ apiKey });

  const today = new Date();
  const dateISO = today.toISOString();
  const fileSlug = `${today.toISOString().slice(0, 10)}-${slugify(title)}`;
  const filePath = path.join(outDir, `${fileSlug}.md`);

  const sysPrompt = [
    "You are a senior SEO/content strategist who writes authoritative, readable, well-structured blog posts in Markdown.",
    "Tone: helpful, concise, practical. Audience: entrepreneurs & small-business owners.",
    "Include an opening hook, scannable subheadings (H2/H3), short paragraphs, and a clear takeaway section.",
    "Include a brief meta excerpt (<= 160 chars) at the very top in a comment line like: <!-- EXCERPT: ... -->",
    "If useful, include a small FAQ section at the end.",
  ].join("\n");

  const serpBlock = serpUrls.length
    ? `Here are top reference URLs to consider for context (do NOT copy):\n${serpUrls.map((u) => `- ${u}`).join("\n")}`
    : "No reference URLs provided.";

  const userPrompt = `Title: ${title}
${serpBlock}
Tags: ${tagList.join(", ") || "general"}

Please produce a complete Markdown blog post. Do not include YAML frontmatter; I'll add it myself.
Return only Markdown body content (H1 included).
`;

  let content = "";
  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    attempt++;
    try {
      const resp = await openai.responses.create({
        model,
        input: [
          { role: "system", content: sysPrompt },
          { role: "user", content: userPrompt },
        ],
      } as any);
      
      content = resp.output_text?.trim() || "";
      if (content) break;
      throw new Error("Empty content from model.");
    } catch (err) {
      log("warn", `OpenAI attempt ${attempt} failed: ${(err as any)?.message || err}`);
      if (attempt >= MAX_RETRIES) throw err;
      await new Promise((r) => setTimeout(r, 800 * attempt));
    }
  }

  // Extract excerpt comment if present
  let excerpt = "";
  const m = content.match(/<!--\s*EXCERPT:\s*(.*?)\s*-->/i);
  if (m) {
    excerpt = m[1].trim();
    content = content.replace(m[0], "").trim();
  } else {
    excerpt = content.split("\n").slice(0, 3).join(" ").slice(0, 158) + "...";
  }

  // Compose final with frontmatter
  const frontmatter = fm(dateISO, title, fileSlug, excerpt, tagList);
  const final = frontmatter + content + "\n";

  if (dryRun) {
    log("info", "DRY RUN — not writing file. Preview below:\n");
    console.log(final);
    return;
  }

  ensureDir(outDir);
  fs.writeFileSync(filePath, final, "utf-8");
  log("info", `✅ Wrote ${filePath}`);
  log("info", "If you maintain a sitemap, run your sitemap update script next.");
}

main().catch((err) => {
  console.error("\n💥 Unhandled error in generatePost:", (err as any)?.response?.data || err);
  process.exit(1);
});
