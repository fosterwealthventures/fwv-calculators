import { getAllGuides, type GuideCategory } from "@/lib/guides";
import Link from "next/link";

export const metadata = {
  title: "Guides | Foster Wealth Ventures",
  description: "Calculator walkthroughs for FWV credit, real estate, and utility tools.",
  alternates: { canonical: "/guides" },
};

const badgeClass: Record<GuideCategory, string> = {
  Credit: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Real Estate": "border-aure-200 bg-aure-50 text-aure-800",
  Utility: "border-plum-200 bg-plum-50 text-plum-700",
};

export default function GuideIndex() {
  const guides = getAllGuides();

  return (
    <main className="fwv-container py-8 md:py-10 space-y-8">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link href="/" className="link-regal">
          Home
        </Link>
        <span className="mx-2 text-plum-500">/</span>
        <span className="font-medium text-plum-800">Guides</span>
      </nav>

      <section className="rounded-2xl border border-plum-200/70 bg-white/85 p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-aure-700">
          Foster Wealth Ventures
        </p>
        <h1 className="mt-2 max-w-4xl text-3xl font-extrabold tracking-tight text-purple-title md:text-5xl">
          Practical guides for the focused FWV calculator suite.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-plum-900/80 md:text-lg">
          Learn how to read the numbers behind credit utilization, debt payoff,
          rental deal analysis, max offer math, and everyday bill splitting.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {guides.map((guide) => (
          <article key={guide.slug} className="card-regal p-5 transition hover:-translate-y-0.5 hover:shadow-regalGlow">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${badgeClass[guide.category]}`}>
                {guide.category}
              </span>
            </div>
            <h2 className="text-xl font-bold leading-snug text-purple-title">
              {guide.title}
            </h2>
            <p className="mt-3 min-h-20 text-sm leading-6 text-plum-900/75">
              {guide.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href={`/guide/${guide.slug}`} className="btn-regal">
                Read Guide
              </Link>
              <Link href={guide.calculatorHref} className="btn-ghost-regal">
                Calculator
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
