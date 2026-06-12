#!/usr/bin/env node
// Inject a small CC0 stock image (Openverse) into blog posts.
// - Looks up by title/tags
// - Downloads to public/blog/<slug>/inline1.jpg
// - Inserts a Markdown image after the first paragraph

import fs from 'fs';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'blog');

function listPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter(f => /\.(md|mdx)$/.test(f));
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---([\s\s]*?)---\s*/m);
  const fm = m ? m[1] : '';
  const body = raw.replace(/^---[\s\S]*?---\s*/m, '');
  const pick = (key) => {
    const re = new RegExp(`^\\s*${key}\\s*:\\s*(.+)$`, 'm');
    const mm = fm.match(re);
    if (!mm) return undefined;
    let v = mm[1].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1,-1);
    return v.trim();
  };
  const title = pick('title');
  const tagsRaw = pick('tags');
  const tags = tagsRaw ? tagsRaw.replace(/^\[/,'').replace(/\]$/,'').split(',').map(s=>s.replace(/^[\s"']+|[\s"']+$/g,'')).filter(Boolean) : [];
  return { title, tags, body, front: m ? raw.slice(0, m[0].length) : '' };
}

async function fetchOpenverse(query) {
  // Try strict CC0 first
  const base = 'https://api.openverse.engineering/v1/images/';
  const attempt = async (params) => {
    const url = new URL(base);
    Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v));
    const res = await fetch(url, { headers: { 'User-Agent': 'fwv-inject/1.0' } });
    if (!res.ok) return null;
    const json = await res.json();
    const r = json && json.results && json.results[0];
    if (!r) return null;
    return {
      url: r.url || r.thumbnail || r.foreign_landing_url,
      credit: r.creator || (r.source || 'Openverse'),
      license: r.license || r.license_version || 'cc0'
    };
  };

  const ov = await attempt({ q: query, license_type: 'cc0', page_size: '1' }) ||
             await attempt({ q: query, license: 'cc0,publicdomain,by,by-sa', license_type: 'commercial', page_size: '1' });
  if (ov) return ov;
  // Fallback: Unsplash Source (no key). This returns a redirect to an image URL.
  try {
    const src = `https://source.unsplash.com/featured/1200x600?${encodeURIComponent(query)}`;
    const res = await fetch(src, { redirect: 'follow' });
    if (res && res.url && res.ok) {
      return { url: res.url, credit: 'Unsplash', license: 'Unsplash' };
    }
  } catch {}
  return null;
}

async function downloadTo(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed ${res.status}`);
  const ab = await res.arrayBuffer();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, Buffer.from(ab));
}

function alreadyHasInlineImage(body) {
  return /!\[[^\]]*\]\([^\)]+\)/.test(body);
}

function insertAfterFirstParagraph(body, insertBlock) {
  const parts = body.split(/\n\n+/);
  if (parts.length < 2) return `${insertBlock}\n\n${body}`;
  // Insert after first non-empty paragraph
  for (let i=0;i<parts.length;i++) {
    if (parts[i].trim().length > 0) {
      parts.splice(i+1, 0, insertBlock);
      break;
    }
  }
  return parts.join('\n\n');
}

async function run() {
  const posts = listPosts();
  let changed = 0, skipped = 0, failed = 0;
  for (const file of posts) {
    try {
      const slug = file.replace(/\.(md|mdx)$/,'');
      const full = path.join(BLOG_DIR, file);
      const raw = fs.readFileSync(full, 'utf8');
      const { title, tags, body, front } = parseFrontmatter(raw);
      if (alreadyHasInlineImage(body)) { skipped++; continue; }
      const slugTerms = slug.replace(/[-_]/g,' ').slice(0,80);
      const q = [title, slugTerms, ...(tags||[])].filter(Boolean).slice(0,4).join(' ');
      if (!q) { skipped++; continue; }
      const hit = await fetchOpenverse(q);
      if (!hit || !hit.url) { skipped++; continue; }
      const ext = path.extname(new URL(hit.url).pathname) || '.jpg';
      const outRel = path.join('blog', slug, `inline1${ext}`);
      const outAbs = path.join(PUBLIC_DIR, slug, `inline1${ext}`);
      await downloadTo(hit.url, outAbs);
      const alt = (title || slug).replace(/\s+/g,' ').trim();
      const credit = `Image via Openverse (${hit.license}${hit.credit?`, ${hit.credit}`:''})`;
      const imgBlock = `![${alt}](/${outRel})\n\n*${credit}*`;
      const updated = (front || '') + insertAfterFirstParagraph(body, imgBlock) + '\n';
      fs.writeFileSync(full, updated, 'utf8');
      changed++;
    } catch (e) {
      console.error('inject failed for', file, e.message);
      failed++;
    }
  }
  console.log(JSON.stringify({ changed, skipped, failed }));
}

run().catch(e => { console.error(e); process.exit(1); });
