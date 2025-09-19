 
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

/**
 * Get all available slugs from markdown files
 * e.g. "hello-world.md" -> "hello-world"
 */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

/**
 * Load a post by slug and parse frontmatter + content
 */
export function getPostBySlug(slug?: string) {
  if (!slug) return null;

  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: (data as any)?.title as string | undefined,
    date: (data as any)?.date as string | undefined,
    excerpt: (data as any)?.excerpt as string | undefined,
    content,
  };
}

/**
 * Return all posts with metadata (without crashing if empty)
 */
export function getAllPosts() {
  return getAllSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter(Boolean) as {
    slug: string;
    title?: string;
    date?: string;
    excerpt?: string;
    content: string;
  }[];
}
