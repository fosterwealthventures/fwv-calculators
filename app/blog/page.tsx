// app/blog/page.tsx
import Link from "next/link";
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
    <main className="mx-auto max-w-7xl px-6 md:px-10 py-10">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Blog</h1>
      {!posts.length ? (
        <p className="mt-6 text-sm text-neutral-600">
          No posts yet. Add <code>.md</code>/<code>.mdx</code> files to <code>content/blog</code>.
        </p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug} className="rounded-xl border p-4 hover:shadow">
              <Link href={`/blog/${p.slug}`} className="underline hover:no-underline font-medium">
                {p.title}
              </Link>
              {p.date ? <p className="mt-1 text-xs text-neutral-500">{p.date}</p> : null}
              {p.excerpt ? <p className="mt-2 text-sm text-neutral-700">{p.excerpt}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
