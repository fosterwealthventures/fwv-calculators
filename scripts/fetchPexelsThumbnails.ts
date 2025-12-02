// scripts/fetchPexelsThumbnails.ts
// Bulk-add Pexels thumbnails to existing blog posts.
// Usage: npx tsx scripts/fetchPexelsThumbnails.ts

import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Prefer .env.local, then fallback to .env
dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config();

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const PUBLIC_BLOG_DIR = path.join(process.cwd(), "public", "blog");
const PEXELS_ENDPOINT = "https://api.pexels.com/v1/search";

type PostFile = {
  filePath: string;
  filename: string;
  slug: string;
  title: string;
  data: Record<string, unknown>;
  content: string;
};

function assertPexelsKey(): string {
  const key = (process.env.PEXELS_API_KEY || "").trim();
  if (!key) {
    throw new Error("PEXELS_API_KEY is missing. Add it to .env.local before running this script.");
  }
  return key;
}

function listPosts(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => /\.mdx?$/.test(f));
}

function loadPost(file: string): PostFile {
  const filePath = path.join(BLOG_DIR, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data || {};
  const title = String(data.title || "").trim() || file.replace(/\.(md|mdx)$/i, "").replace(/-/g, " ");
  const slug = String(data.slug || "").trim() || file.replace(/\.(md|mdx)$/i, "");
  return { filePath, filename: file, slug, title, data, content: parsed.content || "" };
}

function buildQuery(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("mortgage")) return "mortgage calculator";
  if (lower.includes("car")) return "car loan affordability";
  if (lower.includes("side hustle") || lower.includes("take-home pay")) return "side hustle money";
  return title.trim();
}

async function fetchPexelsUrl(query: string, apiKey: string): Promise<string | null> {
  const url = `${PEXELS_ENDPOINT}?query=${encodeURIComponent(query)}&per_page=1`;
  const res = await fetch(url, { headers: { Authorization: apiKey } });
  if (!res.ok) {
    throw new Error(`Pexels search failed (${res.status} ${res.statusText})`);
  }
  const json = await res.json();
  const photo = json?.photos?.[0];
  const src = photo?.src?.large2x || photo?.src?.large;
  return typeof src === "string" && src.trim() ? src : null;
}

async function downloadImage(url: string, destPath: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image download failed (${res.status} ${res.statusText})`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
}

function writePost(post: PostFile, thumbnail: string) {
  const updatedData = { ...post.data, thumbnail };
  const output = matter.stringify(post.content, updatedData);
  fs.writeFileSync(post.filePath, output, "utf8");
}

async function main() {
  const apiKey = assertPexelsKey();
  const files = listPosts();
  if (!files.length) {
    console.log("No blog posts found in", BLOG_DIR);
    return;
  }

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    try {
      const post = loadPost(file);
      if (post.data.thumbnail) {
        skipped++;
        continue;
      }

      const query = buildQuery(post.title);
      const imageUrl = await fetchPexelsUrl(query, apiKey);
      if (!imageUrl) {
        console.warn(`[skip] No image found for "${post.title}" (${query})`);
        skipped++;
        continue;
      }

      const outRel = `/blog/${post.slug}.jpg`;
      const outAbs = path.join(PUBLIC_BLOG_DIR, `${post.slug}.jpg`);
      await downloadImage(imageUrl, outAbs);
      writePost(post, outRel);
      added++;
      console.log(`[ok] Added thumbnail for "${post.title}" -> ${outRel}`);
    } catch (err) {
      failed++;
      console.warn(`[fail] ${file}: ${(err as any)?.message || err}`);
    }
  }

  console.log(JSON.stringify({ added, skipped, failed }, null, 2));
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
