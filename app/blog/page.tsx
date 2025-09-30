// app/blog/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog"; // your existing helper

export const metadata: Metadata = {
  title: "Blog — Foster Wealth Calculators",
  description: "Short, practical reads that pair with our calculators.",
};

// Revalidate list periodically if you're reading from the filesystem
export const revalidate = 60;

type PostListItem = {
  slug: string;
  title?: string;
  description?: string;
  excerpt?: string;
  date?: string;
};

export default async function BlogIndex() {
  // Load posts via your helper. Cast to a light shape so we don’t fight types.
  let posts: PostListItem[] = [];
  try {
    posts =
      (getAllPosts() as any[])?.map((p: any) => ({
        slug: p.slug,
        title: p.title ?? p.data?.title,
        description: p.description ?? p.data?.description,
        excerpt: p.excerpt ?? p.data?.excerpt,
        date: p.date ?? p.data?.date,
      })) ?? [];
  } catch {
    posts = [];
  }

  // Optional curated fallbacks if none are found
  const fallbackPosts: PostListItem[] = [
    {
      slug: "roi-vs-annualized-roi",
      title:
        "ROI vs Annualized ROI — How to Read Them & Boost Your Investment Strategy",
      description:
        "Understand the difference and when each matters for real decisions.",
    },
    {
      slug: "break-even-made-simple",
      title:
        "Break-Even Made Simple — Use Our Calculator to Master Costs & Profit Margins",
      description: "Turn costs into clarity with a step-by-step walkthrough.",
    },
    {
      slug: "mortgage-payment-breakdown",
      title: "Mortgage Payment Breakdown — See What Impacts Your Monthly Cost",
      description:
        "Principal, interest, taxes, insurance—explained with examples.",
    },
    {
      slug: "simple-vs-compound-interest",
      title: "Simple vs Compound Interest — Which One Grows Your Money Faster?",
      description: "Side-by-side comparisons with real-world scenarios.",
    },
    {
      slug: "set-your-freelancer-rate-right",
      title: "Set Your Freelancer Rate Right — Avoid Undervaluing Your Time",
      description: "Price confidently with a structured approach.",
    },
  ];

  const list = posts.length ? posts : fallbackPosts;

  return (
    <div className="container-page page">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
        <a href="/" className="hover:underline">
          Home
        </a>
        <span className="mx-2">›</span>
        <span className="text-gray-500">Blog</span>
      </nav>

      <h1 className="heading-hero">Blog</h1>
      <p className="lead mt-2">
        Short, practical reads that pair with our calculators.
      </p>

      <ul className="mt-6 divide-y rounded-2xl border bg-white">
        {list.map((p) => (
          <li key={p.slug} className="p-4 hover:bg-gray-50">
            <Link
              href={`/blog/${p.slug}`}
              className="font-semibold text-brand-green hover:underline"
            >
              {p.title ?? p.slug.replace(/-/g, " ")}
            </Link>

            {(p.description || p.excerpt) && (
              <p className="mt-1 text-sm text-gray-600">
                {p.description ?? p.excerpt}
              </p>
            )}

            {p.date && (
              <p className="mt-1 text-xs text-gray-500">
                {new Date(p.date).toLocaleDateString()}
              </p>
            )}
          </li>
        ))}
      </ul>

      {posts.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">
          Showing featured articles until blog posts are published.
        </p>
      )}
    </div>
  );
}
