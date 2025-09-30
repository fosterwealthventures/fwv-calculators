// scripts/generateBulk.ts
// Bulk content generator (CSV -> Markdown files)

import { promises as fs } from "fs";
import path from "path";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { parse as parseCsv } from "csv-parse/sync";
import OpenAI from "openai";

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

const argv = ((): Args => {
  return yargs(hideBin(process.argv))
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
})();

const openaiKey = process.env.OPENAI_API_KEY ?? "";
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;

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

  if (!openai) {
    return [
      "## Overview",
      "",
      "This is placeholder content (no OpenAI key).",
      "",
      "## Key Takeaways",
      "- Tip 1",
      "- Tip 2",
      "- Tip 3",
      "",
      "## Example",
      "Walk through a simple example here.",
    ].join("\n");
  }

  const res = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });
  return res.output_text?.trim() || "Content generation returned empty text.";
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
