// app/blog/page.tsx
import BlogCard from "@/components/BlogCard";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog | Foster Wealth Calculators",
  description: "Latest posts, guides, and updates.",
};

type Post = { slug: string; title: string; date?: string; excerpt?: string };
export const revalidate = 3600;

export default function BlogIndex() {
  const posts = (getAllPosts?.() ?? []) as Post[];

  return (
    <main className="mx-auto w-full max-w-6xl lg:max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-purple-title">Blog</h1>
      {!posts.length ? (
        <p className="mt-6 text-sm text-neutral-600">
          No posts yet. Add <code>.md</code>/<code>.mdx</code> files to <code>content/blog</code>.
        </p>
      ) : (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <BlogCard slug={p.slug} title={p.title} date={p.date} excerpt={p.excerpt} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
