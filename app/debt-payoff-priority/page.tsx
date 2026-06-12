import type { Metadata } from "next";
import Link from "next/link";
import DebtPayoffPriority from "@/components/calculators/DebtPayoffPriority";

export const metadata: Metadata = {
  title: "Debt Payoff Priority Ranker | Foster Wealth Calculators",
  description: "Compare avalanche and snowball payoff priorities so you can see which debts deserve attention first.",
  alternates: { canonical: "https://fosterwealthventures.store/debt-payoff-priority" },
};

export default function Page() {
  return (
    <main className="fwv-container py-8 space-y-10">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link href="/" className="text-brand-green hover:underline">Home</Link> <span>›</span>{" "}
        <Link href="/calculators" className="text-brand-green hover:underline">Calculators</Link> <span>›</span>{" "}
        <span className="text-plum-700 dark:text-plum-200">Debt Payoff Priority Ranker</span>
      </nav>

      <section className="space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-aure-600 dark:text-aure-400">Credit Calculators</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-title">Debt Payoff Priority Ranker</h1>
        <p className="mx-auto max-w-3xl text-plum-900/85 dark:text-plum-100/80">Compare avalanche and snowball payoff priorities so you can see which debts deserve attention first.</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="#calculator" className="btn-regal">Rank My Debts</Link>
          <Link href="/calculators" className="btn-ghost-regal">Browse All Calculators</Link>
        </div>
      </section>

      <section id="calculator" className="card-regal p-5 md:p-7 space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-purple-title">Debt Payoff Priority Ranker</h2>
          <p className="mt-1 text-sm text-plum-900/75 dark:text-plum-100/70">Compare avalanche and snowball payoff priorities so you can see which debts deserve attention first.</p>
        </div>
        <DebtPayoffPriority />
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">Educational estimate only. This tool is not financial, legal, or credit repair advice and does not guarantee savings or credit outcomes.</p>
      </section>

      <section className="card-regal p-5 md:p-6 space-y-3">
        <h2 className="text-2xl font-bold text-purple-title">How this fits FWV</h2>
        <p className="text-plum-900/85 dark:text-plum-100/80">A payoff priority ranker helps you decide where extra money may have the strongest effect. Avalanche prioritizes interest cost. Snowball prioritizes quick wins and momentum.</p>
      </section>

      <section className="text-center space-y-3 pb-8">
        <p className="text-plum-900/85 dark:text-plum-100/80">Ready for the next step?</p>
        <Link href="https://fosterwealthventures.com/credit-insight" target="_blank" className="btn-regal">Start Credit Insight Intelligence</Link>
      </section>
    </main>
  );
}
