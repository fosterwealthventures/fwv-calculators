import { byPillar } from "@/lib/calculators";
import Link from "next/link";

function CalculatorCard({ title, summary, href }: { title: string; summary?: string; href: string }) {
  return (
    <article className="rounded-2xl border border-plum-200 bg-white/90 p-4 shadow-sm dark:border-plum-800 dark:bg-plum-950/40">
      <h3 className="font-semibold text-plum-950 dark:text-plum-50">{title}</h3>
      {summary ? <p className="mt-2 text-sm text-plum-900/75 dark:text-plum-100/70">{summary}</p> : null}
      <Link href={href} className="mt-4 inline-flex rounded-lg bg-plum-700 px-3 py-2 text-sm font-semibold text-white hover:bg-plum-800">
        Open Calculator
      </Link>
    </article>
  );
}

export default function Home() {
  const credit = byPillar("credit");
  const realEstate = byPillar("real-estate");
  const utility = byPillar("utility");

  return (
    <main className="fwv-container py-6 space-y-10">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-aure-600 dark:text-aure-400">
          Foster Wealth Calculators
        </p>
        <h1 className="max-w-4xl text-4xl md:text-5xl font-extrabold text-purple-title">
          Free calculators for credit, real estate, and smarter money decisions.
        </h1>
        <p className="max-w-3xl text-plum-900 dark:text-plum-100/80">
          Use focused calculators to run the numbers before your next move. Credit tools lead into Credit Insight Intelligence;
          real estate tools lead into HavenMIND for deeper decision support.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/calculators" className="btn-regal">See all calculators</Link>
          <Link href="/blog" className="btn-ghost-regal">Read the blog</Link>
        </div>
      </section>

      <section>
        <div className="card-regal p-5 shadow-md">
          <blockquote className="text-base md:text-lg font-semibold italic text-plum-800 dark:text-plum-100">
            "The plans of the diligent lead surely to abundance, but everyone who is hasty comes only to poverty."
          </blockquote>
          <div className="mt-2 text-base font-bold text-aure-600 dark:text-aure-400">- Proverbs 21:5</div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card-regal p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-aure-600 dark:text-aure-400">Credit Pillar</p>
            <h2 className="text-2xl font-bold text-purple-title">Credit & Debt Payoff Tools</h2>
            <p className="mt-1 text-sm text-plum-900/80 dark:text-plum-100/75">
              Understand utilization, payoff priority, and when a deeper credit review may be needed.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {credit.map((c) => <CalculatorCard key={c.slug} title={c.title} summary={c.summary} href={c.path} />)}
          </div>
          <Link href="https://fosterwealthventures.com/credit-insight" target="_blank" className="inline-flex text-sm font-semibold text-brand-green underline">
            Start Credit Insight Intelligence
          </Link>
        </div>

        <div className="card-regal p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-aure-600 dark:text-aure-400">Real Estate Pillar</p>
            <h2 className="text-2xl font-bold text-purple-title">Investor Deal Calculators</h2>
            <p className="mt-1 text-sm text-plum-900/80 dark:text-plum-100/75">
              Check cash flow, cap rate, DSCR, ARV, and max offer math before chasing a property.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {realEstate.map((c) => <CalculatorCard key={c.slug} title={c.title} summary={c.summary} href={c.path} />)}
          </div>
          <Link href="https://fosterwealthventures.com/havenmind" target="_blank" className="inline-flex text-sm font-semibold text-brand-green underline">
            Explore HavenMIND AI
          </Link>
        </div>
      </section>

      <section className="card-regal p-5 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-aure-600 dark:text-aure-400">Utility</p>
          <h2 className="text-2xl font-bold text-purple-title">Everyday Money Helper</h2>
          <p className="mt-1 text-sm text-plum-900/80 dark:text-plum-100/75">
            Keep one simple, useful tool that does not compete with the two main pillars.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {utility.map((c) => <CalculatorCard key={c.slug} title={c.title} summary={c.summary} href={c.path} />)}
        </div>
      </section>

      <section className="space-y-4 pb-10">
        <h2 className="text-2xl font-bold text-purple-title">What changed?</h2>
        <p className="max-w-4xl text-plum-900/90 dark:text-plum-100/80">
          FWV Calculators is no longer a generic calculator subscription site. It is now a focused free tool hub built around
          credit, debt payoff, and real estate investing, with clear next steps into the deeper FWV systems you are building.
        </p>
      </section>
    </main>
  );
}
