// app/blog/page.tsx
import BlogCard from "@/components/BlogCard";
import { getAllPosts } from "@/lib/blog";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Blog | Foster Wealth Calculators",
  description: "Latest posts, guides, and updates.",
  alternates: { canonical: "/blog" },
};

type Post = {
  slug: string;
  title: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
  category?: string;
  image?: string;
};
export const revalidate = 3600;

const PAGE_SIZE = 12;

export default async function BlogIndex({
  searchParams,
}: {
  // In Next 15+, searchParams is a Promise and must be awaited
  searchParams?: Promise<{ page?: string }>;
}) {
  const sp = (await searchParams) ?? {};

  // Normalize query-style pagination to the canonical path style
  const requested = Number(sp.page ?? 1) || 1;
  if (requested > 1) {
    redirect(`/blog/page/${requested}`);
  }
  let allPosts: Post[] = [];
  try {
    allPosts = (getAllPosts?.() ?? []) as Post[];
  } catch (e) {
    console.error('[blog] index load failed:', e);
    allPosts = [];
  }
  const total = allPosts.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(
    totalPages,
    Math.max(1, requested)
  );
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const posts = allPosts.slice(start, end);

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
              <BlogCard
                slug={p.slug}
                title={p.title}
                date={p.date}
                excerpt={p.excerpt}
                tags={p.tags}
                category={p.category}
                image={(p as any).image}
              />
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Pagination">
          <a
            href={page > 1 ? (page - 1 === 1 ? `/blog` : `/blog/page/${page - 1}`) : undefined}
            aria-disabled={page === 1}
            className={`px-3 py-1.5 rounded border ${
              page === 1
                ? "pointer-events-none opacity-50"
                : "hover:bg-plum-50 dark:hover:bg-plum-900/30"
            }`}
          >
            Previous
          </a>
          <span className="text-sm text-neutral-600 dark:text-neutral-300">
            Page {page} of {totalPages}
          </span>
          <a
            href={page < totalPages ? `/blog/page/${page + 1}` : undefined}
            aria-disabled={page === totalPages}
            className={`px-3 py-1.5 rounded border ${
              page === totalPages
                ? "pointer-events-none opacity-50"
                : "hover:bg-plum-50 dark:hover:bg-plum-900/30"
            }`}
          >
            Next
          </a>
        </nav>
      )}
    </main>
  );
}
