import fs from "fs";
import path from "path";

export type PostMeta = {
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export function listPostFiles() {
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
}

export function getAllPosts(): PostMeta[] {
  return listPostFiles()
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const title = (
        raw.match(/title:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? slug
      ).trim();
      const date = (
        raw.match(/date:\s*["']?(.+?)["']?\s*$/m)?.[1] ??
        new Date().toISOString()
      ).trim();
      const excerpt = (
        raw.match(/excerpt:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? ""
      ).trim();
      return { title, slug, date, excerpt };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string) {
  const file = listPostFiles().find((f) => f.startsWith(slug + "."));
  if (!file) return null;
  return fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
}

export function savePost(slug: string, content: string) {
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  fs.writeFileSync(file, content, "utf8");
  return file;
}
