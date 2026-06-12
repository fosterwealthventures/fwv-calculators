import { byPillar, PILLAR_DESCRIPTIONS, PILLAR_LABELS, type CalcPillar } from "@/lib/calculators";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Credit & Real Estate Calculators | Foster Wealth Calculators",
  description:
    "Free Foster Wealth calculators for credit utilization, debt payoff, real estate deal analysis, max offer/ARV, and tip splitting.",
};

const PILLARS: { key: CalcPillar; eyebrow: string; cta?: { label: string; href: string } }[] = [
  {
    key: "credit",
    eyebrow: "Lead-in to Credit Insight Intelligence",
    cta: { label: "Start Credit Insight Intelligence", href: "https://fosterwealthventures.com/credit-insight" },
  },
  {
    key: "real-estate",
    eyebrow: "Lead-in to HavenMIND",
    cta: { label: "Explore HavenMIND AI", href: "https://fosterwealthventures.com/havenmind" },
  },
  {
    key: "utility",
    eyebrow: "Everyday money utility",
  },
];

export default function CalculatorsIndex() {
  return (
    <main id="main" className="fwv-container py-8 space-y-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <Link href="/" className="text-brand-green hover:underline">Home</Link> <span>›</span>{" "}
        <span className="text-plum-700 dark:text-plum-200">Calculators</span>
      </nav>

      <section className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-aure-600 dark:text-aure-400">
          Foster Wealth Calculators
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-title">
          Free calculators for credit, real estate, and smarter money decisions.
        </h1>
        <p className="mx-auto max-w-3xl text-plum-900/85 dark:text-plum-100/80">
          Run the numbers first. These tools help you understand credit utilization, debt payoff order,
          rental deal strength, and max offer math before you move into a deeper FWV review tool.
        </p>
      </section>

      <div className="grid gap-6">
        {PILLARS.map((pillar) => {
          const calculators = byPillar(pillar.key);
          if (!calculators.length) return null;

          return (
            <section key={pillar.key} className="card-regal p-5 md:p-6 space-y-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-aure-600 dark:text-aure-400">
                    {pillar.eyebrow}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-purple-title">{PILLAR_LABELS[pillar.key]}</h2>
                  <p className="mt-1 max-w-3xl text-sm text-plum-900/80 dark:text-plum-100/75">
                    {PILLAR_DESCRIPTIONS[pillar.key]}
                  </p>
                </div>
                {pillar.cta ? (
                  <Link href={pillar.cta.href} target="_blank" className="btn-ghost-regal text-sm">
                    {pillar.cta.label}
                  </Link>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {calculators.map((calculator) => (
                  <article key={calculator.slug} className="rounded-2xl border border-plum-200 bg-white/90 p-4 shadow-sm dark:border-plum-800 dark:bg-plum-950/40">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold text-plum-950 dark:text-plum-50">{calculator.title}</h3>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                        Free
                      </span>
                    </div>
                    {calculator.summary ? (
                      <p className="min-h-[56px] text-sm text-plum-900/75 dark:text-plum-100/70">{calculator.summary}</p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={calculator.path} className="btn-regal text-sm">
                        Open Calculator
                      </Link>
                      {calculator.guide ? (
                        <Link href={calculator.guide} className="rounded-lg border border-plum-300 bg-white px-3 py-2 text-sm text-plum-800 hover:bg-plum-50 dark:border-plum-700 dark:bg-plum-900 dark:text-plum-100">
                          Guide
                        </Link>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
