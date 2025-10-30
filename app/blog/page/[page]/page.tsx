// app/blog/page/[page]/page.tsx
import BlogCard from "@/components/BlogCard";
import { getAllPosts } from "@/lib/blog";

export const revalidate = 3600;

const PAGE_SIZE = 12;

type Post = {
  slug: string;
  title: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
  category?: string;
};

export async function generateMetadata({ params }: { params: { page: string } }) {
  const pageNum = Number(params.page || 1) || 1;
  return {
    title: `Blog — Page ${pageNum} | Foster Wealth Calculators`,
    description: `Latest posts, page ${pageNum}.`,
  };
}

export default function BlogIndexPage({ params }: { params: { page: string } }) {
  const allPosts = (getAllPosts?.() ?? []) as Post[];
  const total = allPosts.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(totalPages, Math.max(1, Number(params.page || 1) || 1));

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const posts = allPosts.slice(start, end);

  return (
    <main className="mx-auto w-full max-w-6xl lg:max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-purple-title">Blog</h1>
      {!posts.length ? (
        <p className="mt-6 text-sm text-neutral-600">No posts on this page.</p>
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

