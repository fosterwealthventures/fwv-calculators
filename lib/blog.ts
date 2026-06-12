import fs from "fs";
import path from "path";

// Try to use gray-matter if available; fall back to lightweight regex parser
let matter: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  matter = require("gray-matter");
} catch {
  matter = null;
}

export type PostMeta = {
  title: string;
  slug: string;
  date: string; // ISO string
  excerpt?: string;
  draft?: boolean;
  tags?: string[];
  category?: string;
  meta_description?: string;
  thumbnail?: string;
  image?: string;
  og_image?: string;
  image_alt?: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export function listPostFiles() {
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
}

/**
 * Very small front-matter parser for the simple YAML you use today.
 * Safe to replace with gray-matter later without changing callers.
 */
export function parseFrontmatter(raw: string): { meta: Partial<PostMeta>; body: string } {
  if (matter) {
    try {
      const parsed = matter(raw);
      const data = parsed?.data ?? {};
      const body = parsed?.content ?? raw;
      const meta: Partial<PostMeta> = {
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        draft: !!data.draft,
        tags: Array.isArray(data.tags)
          ? data.tags.map((t: unknown) => String(t)).filter(Boolean)
          : undefined,
        category: data.category,
        meta_description: data.meta_description,
        thumbnail: data.thumbnail,
        image: data.image,
        og_image: data.og_image,
        image_alt: data.image_alt,
      };
      return { meta, body };
    } catch {
      // fall through to regex parser below
    }
  }

  const fmMatch = raw.match(/^---([\s\S]*?)---\s*/m);
  const fm = fmMatch?.[1] ?? "";
  const body = raw.replace(/^---[\s\S]*?---\s*/m, "");

  const pick = (re: RegExp) => fm.match(re)?.[1]?.trim();
  const pickLoose = (key: string) => {
    const m = fm.match(new RegExp(`^\\s*${key}\\s*:\\s*(.+)$`, 'm'));
    if (!m) return undefined;
    let v = m[1].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    v = v.replace(/\uFFFD|�/g, '');
    return v.trim();
  };

  const title = pick(/title:\s*"([\s\S]+?)"/m) || pick(/title:\s*'([\s\S]+?)'/m) || pickLoose('title');
  const date = pick(/date:\s*"([\s\S]+?)"/m) || pick(/date:\s*'([\s\S]+?)'/m) || pickLoose('date');
  const excerpt = pick(/excerpt:\s*"([\s\S]+?)"/m) || pick(/excerpt:\s*'([\s\S]+?)'/m) || pickLoose('excerpt');
  const meta_description = pick(/meta_description:\s*"([\s\S]+?)"/m) || pick(/meta_description:\s*'([\s\S]+?)'/m) || pickLoose('meta_description');
  const category = pick(/category:\s*"([\s\S]+?)"/m) || pick(/category:\s*'([\s\S]+?)'/m) || pickLoose('category');
  const thumbnail = pick(/thumbnail:\s*"([\s\S]+?)"/m) || pick(/thumbnail:\s*'([\s\S]+?)'/m) || pickLoose('thumbnail');
  const image = pick(/image:\s*"([\s\S]+?)"/m) || pick(/image:\s*'([\s\S]+?)'/m) || pickLoose('image');
  const og_image = pick(/og_image:\s*"([\s\S]+?)"/m) || pick(/og_image:\s*'([\s\S]+?)'/m) || pickLoose('og_image');
  const image_alt = pick(/image_alt:\s*"([\s\S]+?)"/m) || pick(/image_alt:\s*'([\s\S]+?)'/m) || pickLoose('image_alt');
  const draftStr = pick(/draft:\s*(true|false)\s*/im);
  const draft = draftStr ? /^true$/i.test(draftStr) : false;

  // tags: ["a", "b"] on a single line
  const tagsRaw = pick(/(^|\n)\s*tags:\s*\[(.*?)\]\s*$/m) || pickLoose('tags');
  const tags = tagsRaw
    ? tagsRaw
      .split(',')
      .map((s) => s.replace(/^[\s"']+|[\s"']+$/g, ""))
      .filter(Boolean)
    : undefined;

  return {
    meta: { title, date, excerpt, draft, tags, category, meta_description, thumbnail, image, og_image, image_alt },
    body,
  };
}

function deriveExcerpt(markdownBody: string, maxLen = 180): string {
  // Strip any stray front-matter block if it wasn't parsed out
  const body = markdownBody.replace(/^---[\s\S]*?---\s*/m, "");

  // Take first non-empty paragraph; strip headings/links/basic markdown, collapse spaces
  const text = body
    .replace(/^#.+$/gm, "")
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, "")
    .replace(/\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_|__([^_]+)__|~~([^~]+)~~/g, "$1$2$3$4$5")
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, "")
    .replace(/\[[^\]]*\]\([^\)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .find((s) => s.length > 0) || "";

  return text.length > maxLen ? text.slice(0, maxLen - 1).trimEnd() + "…" : text;
}

export function getAllPosts(): PostMeta[] {
  const isDev = process.env.NODE_ENV === "development";
  const posts = listPostFiles()
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { meta, body } = parseFrontmatter(raw);

      const title = (meta.title ?? slug).trim();
      const dateIso = (meta.date ?? new Date().toISOString()).trim();
      const excerpt = (meta.excerpt && meta.excerpt.trim()) || deriveExcerpt(body);

      const pm: PostMeta = {
        title,
        slug,
        date: dateIso,
        excerpt,
        draft: !!meta.draft,
        tags: meta.tags,
        category: meta.category,
        meta_description: meta.meta_description,
        thumbnail: meta.thumbnail || meta.image,
        image: meta.image || meta.thumbnail,
        og_image: meta.og_image,
        image_alt: meta.image_alt,
      };
      return pm;
    })
    .filter((p) => (isDev ? true : !p.draft))
    .sort((a, b) => {
      const at = new Date(a.date).getTime();
      const bt = new Date(b.date).getTime();
      return bt - at;
    });

  return posts;
}

export function getPost(slug: string) {
  const file = listPostFiles().find((f) => f.startsWith(slug + "."));
  if (!file) return null;
  return fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
}

export function getPostBySlug(slug: string): { meta: PostMeta; body: string } | null {
  const file = listPostFiles().find((f) => f.startsWith(slug + "."));
  if (!file) return null;
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { meta, body } = parseFrontmatter(raw);
  const title = (meta.title ?? slug).trim();
  const dateIso = (meta.date ?? new Date().toISOString()).trim();
  const excerpt = (meta.excerpt && meta.excerpt.trim()) || deriveExcerpt(body);
  const fullMeta: PostMeta = {
    title,
    slug,
    date: dateIso,
    excerpt,
    draft: !!meta.draft,
    tags: meta.tags,
    category: meta.category,
    meta_description: meta.meta_description,
    thumbnail: meta.thumbnail || meta.image,
    image: meta.image || meta.thumbnail,
    og_image: meta.og_image,
    image_alt: meta.image_alt,
  };
  return { meta: fullMeta, body };
}

export function savePost(slug: string, content: string) {
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  fs.writeFileSync(file, content, "utf8");
  return file;
}
