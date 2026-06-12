// scripts/generateBulk.ts
// Bulk content generator (CSV -> Markdown files)

import "dotenv/config";                   // <-- loads .env/.env.local for Node
import { promises as fs } from "fs";
import path from "path";
import OpenAI from "openai";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { parse as parseCsv } from "csv-parse/sync";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing. Add it to .env.local");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type Row = {
  title?: string;
  slug?: string;
  tags?: string;    // comma-separated in CSV
  prompt?: string;
  summary?: string;
};

type Args = {
  input: string;
  out: string;
  limit: number;
  dryRun: boolean;
  force: boolean;
  section: "blog" | "guide" | "auto";
};

const argv = yargs(hideBin(process.argv))
  .option("input", {
    type: "string",
    alias: "i",
    default: "scripts/bulk.csv",
    describe: "Path to the CSV file (with headers).",
  })
  .option("out", {
    type: "string",
    alias: "o",
    default: "content/auto",
    describe: "Output folder for generated Markdown files.",
  })
  .option("limit", {
    type: "number",
    alias: "n",
    default: 50,
    describe: "Maximum number of rows to process.",
  })
  .option("dryRun", {
    type: "boolean",
    default: false,
    describe: "Preview output without writing files.",
  })
  .option("force", {
    type: "boolean",
    default: false,
    describe: "Overwrite existing files if present.",
  })
  .option("section", {
    type: "string",
    choices: ["blog", "guide", "auto"] as const,
    default: "auto",
    describe: "Frontmatter section.",
  })
  .strict()
  .parseSync() as Args;

function toSlug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function frontmatter(obj: Record<string, unknown>): string {
  const yaml = Object.entries(obj)
    .map(([k, v]) => {
      if (Array.isArray(v)) return `${k}: [${v.map(x => JSON.stringify(x)).join(", ")}]`;
      if (typeof v === "string") return `${k}: ${JSON.stringify(v)}`;
      return `${k}: ${String(v)}`;
    })
    .join("\n");
  return `---\n${yaml}\n---\n`;
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function readCsv(filePath: string): Promise<Row[]> {
  const raw = await fs.readFile(filePath, "utf8");
  return parseCsv(raw, { columns: true, skip_empty_lines: true, trim: true }) as Row[];
}

async function generateBody(row: Row): Promise<string> {
  const prompt =
    row.prompt ||
    `Write a concise article titled "${row.title ?? "Untitled"}" for a financial calculators site.
Include practical tips and one simple example. Friendly, plain language.`;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user", 
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });
    return res.choices[0]?.message?.content?.trim() || "Content generation returned empty text.";
  } catch (error) {
    console.warn(`Failed to generate content for "${row.title}":`, error);
    return [
      "## Overview",
      "",
      "Content generation failed. Please try again.",
      "",
      "## Key Takeaways",
      "- Add your content here",
      "- Update this section",
      "- Customize as needed",
    ].join("\n");
  }
}

async function main() {
  const inputPath = path.resolve(argv.input);
  const outDir = path.resolve(argv.out);

  const rows = await readCsv(inputPath);
  const list = rows.slice(0, Math.max(0, argv.limit));

  if (!argv.dryRun) await ensureDir(outDir);

  let written = 0;

  for (let i = 0; i < list.length; i++) {
    const row = list[i];
    const title = (row.title ?? "").trim() || `Untitled ${i + 1}`;
    const slug = (row.slug ?? toSlug(title)) || `item-${i + 1}`;
    const tags = (row.tags ?? "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    const summary = (row.summary ?? "").trim();

    const fm = frontmatter({
      title,
      date: new Date().toISOString(),
      draft: false,
      section: argv.section,
      tags,
      summary,
    });

    const body = await generateBody(row);
    const md = `${fm}\n# ${title}\n\n${body}\n`;
    const outFile = path.join(outDir, `${slug}.md`);

    if (argv.dryRun) {
      console.log(`[preview] ${outFile}`);
      console.log(md.slice(0, 200) + (md.length > 200 ? " …" : ""));
      continue;
    }

    try {
      if (!argv.force) {
        await fs.access(outFile);
        console.log(`[skip] exists: ${outFile}`);
        continue;
      }
    } catch {
      // file doesn't exist: proceed
    }

    await fs.writeFile(outFile, md, "utf8");
    written++;
    console.log(`[write] ${outFile}`);
  }

  console.log(`\nDone. Wrote ${written} file(s) to ${outDir}${argv.dryRun ? " (dry-run)" : ""}.\n`);
}

main().catch(err => {
  console.error("[bulk] error:", err);
  process.exit(1);
});
