// app/guide/[slug]/page.tsx
import { findGuide } from "@/lib/guides";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

/** Aliases so old links continue working. */
const SLUG_ALIASES: Record<string, string> = {
  "split-by-order": "restaurant-split-by-order",
  "split-order": "restaurant-split-by-order",
  shopping: "shopping-budget",
};

/** Map guide slug -> calculators registry key (?calc=...). */
const GUIDE_META: Record<
  string,
  {
    title?: string;
    plan?: "free" | "plus" | "pro";
    calc?: string; // calculators key used by /calculators?calc=...
  }
> = {
  "roi-vs-annualized-roi": { calc: "roi" },
  "break-even-made-simple": { calc: "break-even" },
  mortgage: { calc: "mortgage" },
  "mortgage-payment-breakdown": { calc: "mortgage" },
  "simple-vs-compound-interest": { calc: "interest" },
  "set-your-freelance-rate-right": { calc: "freelance-rate" },
  "restaurant-tips-tabs-split": { calc: "tips-and-tabs" },
  "savings-growth": { calc: "savings-growth", plan: "plus" },
  "debt-payoff": { calc: "debt-payoff", plan: "plus" },
  "debt-planner": { calc: "debt-planner", plan: "plus" },
  "employee-cost": { calc: "employee-cost", plan: "pro" },
  "expense-split-deluxe": { calc: "expense-split-deluxe", plan: "pro" },

  // NEW
  "shopping-budget": {
    title: "Shopping Budget — Guide",
    plan: "free",
    calc: "shopping-budget",
  },
  "restaurant-split-by-order": {
    title: "Split by Order (+ Shared Appetizers) — Guide",
    plan: "plus",
    calc: "split-by-order",
  },
};

type PageProps = {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export function generateMetadata({ params }: PageProps): Metadata {
  const raw = params.slug;
  const slug = SLUG_ALIASES[raw] || raw;
  const guide = findGuide(slug);

  const meta = GUIDE_META[slug] || {};
  const title = meta.title || guide?.title || "Guide";
  const plan = meta.plan || guide?.plan;

  return {
    title,
    description:
      guide?.description ||
      "Step-by-step guide paired with an interactive calculator.",
    openGraph: {
      title,
      description:
        guide?.description ||
        "Step-by-step guide paired with an interactive calculator.",
      type: "article",
    },
    robots: { index: true, follow: true },
    other: plan ? { "data-plan": plan } : undefined,
  };
}

export default function GuidePage({ params }: PageProps) {
  const raw = params.slug;
  const slug = SLUG_ALIASES[raw] || raw;

  const guide = findGuide(slug);
  if (!guide) return notFound();

  const meta = GUIDE_META[slug] || {};
  const title = meta.title || guide.title;
  const plan = (meta.plan || guide.plan || "free") as "free" | "plus" | "pro";
  const calcKey = meta.calc || slug;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-purple-title">
          {title}
        </h1>

        <div className="mt-3 flex items-center gap-3">
          <PlanBadge plan={plan} />
          <Link
            href={`/calculators?calc=${encodeURIComponent(calcKey)}`}
            className="rounded-lg bg-brand-green px-3 py-1.5 text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
          >
            Open calculator
          </Link>
        </div>
      </header>

      {/* Render your guide body/content here (MDX or components). */}
      <article className="prose prose-slate max-w-none">
        {/* e.g., <GuideContent slug={slug} /> */}
      </article>
    </main>
  );
}

/* ---------- UI bits ---------- */

function PlanBadge({ plan }: { plan: "free" | "plus" | "pro" }) {
  if (plan === "free") {
    return (
      <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ring-white/25 bg-white/10 text-white">
        Free
      </span>
    );
  }
  if (plan === "plus") {
    return (
      <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ring-amber-300/40 bg-amber-400/20 text-amber-900">
        Plus
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ring-emerald-300/40 bg-emerald-400/20 text-emerald-900">
      Pro
    </span>
  );
}
