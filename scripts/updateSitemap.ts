// scripts/updateSitemap.ts
// Build sitemap.xml from /app routes + /content/blog posts
// Run: tsx scripts/updateSitemap.ts

import "dotenv/config";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";

type UrlItem = {
  loc: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
};

// ---------- Config ----------
const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "app");
const BLOG_DIR = path.join(ROOT, "content", "blog");
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_PATH = path.join(PUBLIC_DIR, "sitemap.xml");

// Base site URL (no trailing slash)
const SITE_URL =
  (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "").replace(
    /\/+$/,
    ""
  ) || "https://example.com";

// Folders to ignore when traversing /app
const EXCLUDE_DIRS = new Set(["api", "_components", "_lib", "_styles"]);
const EXCLUDE_PREFIXES = ["_", "."]; // ignore _something and .something
const IGNORE_DYNAMIC = true; // skip [slug] style routes

// ---------- Helpers ----------
async function pathExists(p: string) {
  try {
    await fsp.stat(p);
    return true;
  } catch {
    return false;
  }
}

function isDynamicSeg(seg: string) {
  return /\[.+\]/.test(seg);
}

async function walkAppRoutes(dir: string, baseSegs: string[] = []): Promise<UrlItem[]> {
  const items: UrlItem[] = [];
  let entries: fs.Dirent[];
  try {
    entries = await fsp.readdir(dir, { withFileTypes: true });
  } catch {
    return items;
  }

  // If this folder contains a page.(tsx|jsx|mdx|md), treat it as a route
  const hasPage = entries.some(
    (e) =>
      e.isFile() &&
      /^page\.(t|j)sx?$/.test(e.name)
  );
  const hasMdxPage = entries.some((e) => e.isFile() && /^page\.(mdx?|md)$/.test(e.name));

  if (hasPage || hasMdxPage) {
    const route = "/" + baseSegs.join("/");
    const fileForMtime = path.join(dir, (hasPage ? "page.tsx" : "page.mdx"));
    let stat: fs.Stats | undefined;
    try {
      stat = await fsp.stat(fileForMtime);
    } catch {
      // fall back to directory mtime
      stat = await fsp.stat(dir);
    }

    const lastmod = new Date(stat.mtime).toISOString();
    // Home gets higher priority
    items.push({
      loc: SITE_URL + (route === "/" ? "" : route),
      lastmod,
      changefreq: "monthly",
      priority: route === "/" ? 1.0 : 0.7,
    });
  }

  // Recurse into subfolders
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    // Skip excluded dirs
    if (EXCLUDE_DIRS.has(entry.name)) continue;
    if (EXCLUDE_PREFIXES.some((p) => entry.name.startsWith(p))) continue;
    if (IGNORE_DYNAMIC && isDynamicSeg(entry.name)) continue;

    const nextDir = path.join(dir, entry.name);
    const nextSegs = [...baseSegs, entry.name];
    const child = await walkAppRoutes(nextDir, nextSegs);
    items.push(...child);
  }

  return items;
}

async function collectBlogUrls(): Promise<UrlItem[]> {
  const items: UrlItem[] = [];
  if (!(await pathExists(BLOG_DIR))) return items;

  const entries = await fsp.readdir(BLOG_DIR, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isFile()) continue;
    if (!/\.(md|mdx)$/i.test(e.name)) continue;

    const stat = await fsp.stat(path.join(BLOG_DIR, e.name));
    const lastmod = new Date(stat.mtime).toISOString();

    const slug = e.name
      .replace(/\.(md|mdx)$/i, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const loc = `${SITE_URL}/blog/${slug}`;

    items.push({
      loc,
      lastmod,
      changefreq: "monthly",
      priority: 0.6,
    });
  }
  return items;
}

function buildXml(urls: UrlItem[]) {
  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

  for (const u of urls) {
    lines.push("  <url>");
    lines.push(`    <loc>${u.loc}</loc>`);
    if (u.lastmod) lines.push(`    <lastmod>${u.lastmod}</lastmod>`);
    if (u.changefreq) lines.push(`    <changefreq>${u.changefreq}</changefreq>`);
    if (typeof u.priority === "number") lines.push(`    <priority>${u.priority.toFixed(1)}</priority>`);
    lines.push("  </url>");
  }

  lines.push("</urlset>");
  return lines.join("\n") + "\n";
}

// ---------- Main ----------
(async () => {
  if (!(await pathExists(PUBLIC_DIR))) {
    await fsp.mkdir(PUBLIC_DIR, { recursive: true });
  }

  const appUrls = (await pathExists(APP_DIR)) ? await walkAppRoutes(APP_DIR, []) : [];
  const blogUrls = await collectBlogUrls();

  // De-dupe by loc
  const all = [...appUrls, ...blogUrls];
  const unique = Array.from(new Map(all.map((u) => [u.loc, u])).values())
    // Sort: home first, then alpha
    .sort((a, b) => (a.loc === SITE_URL ? -1 : b.loc === SITE_URL ? 1 : a.loc.localeCompare(b.loc)));

  const xml = buildXml(unique);
  await fsp.writeFile(OUT_PATH, xml, "utf8");

  // eslint-disable-next-line no-console
  console.log(`✅ sitemap.xml updated: ${OUT_PATH}`);
  // eslint-disable-next-line no-console
  console.log(`   Base URL: ${SITE_URL}`);
  // eslint-disable-next-line no-console
  console.log(`   URLs: ${unique.length}`);
})().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("💥 updateSitemap failed:", err);
  process.exit(1);
});
