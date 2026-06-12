import type { Metadata } from "next";
import Link from "next/link";
import DealSnapshotCalculator from "@/components/calculators/DealSnapshotCalculator";

export const metadata: Metadata = {
  title: "Real Estate Deal Snapshot | Foster Wealth Calculators",
  description: "Estimate cash flow, cap rate, DSCR, breakeven rent, and deal strength for a rental property.",
  alternates: { canonical: "https://fosterwealthventures.store/deal-snapshot" },
};

export default function Page() {
  return (
    <main className="fwv-container py-8 space-y-10">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link href="/" className="text-brand-green hover:underline">Home</Link> <span>›</span>{" "}
        <Link href="/calculators" className="text-brand-green hover:underline">Calculators</Link> <span>›</span>{" "}
        <span className="text-plum-700 dark:text-plum-200">Real Estate Deal Snapshot</span>
      </nav>

      <section className="space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-aure-600 dark:text-aure-400">Real Estate Calculators</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-title">Real Estate Deal Snapshot</h1>
        <p className="mx-auto max-w-3xl text-plum-900/85 dark:text-plum-100/80">Estimate cash flow, cap rate, DSCR, breakeven rent, and deal strength for a rental property.</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="#calculator" className="btn-regal">Analyze My Deal</Link>
          <Link href="/calculators" className="btn-ghost-regal">Browse All Calculators</Link>
        </div>
      </section>

      <section id="calculator" className="card-regal p-5 md:p-7 space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-purple-title">Real Estate Deal Snapshot</h2>
          <p className="mt-1 text-sm text-plum-900/75 dark:text-plum-100/70">Estimate cash flow, cap rate, DSCR, breakeven rent, and deal strength for a rental property.</p>
        </div>
        <DealSnapshotCalculator />
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">Educational estimate only. This tool does not guarantee financing approval, property value, rental income, or investment performance.</p>
      </section>

      <section className="card-regal p-5 md:p-6 space-y-3">
        <h2 className="text-2xl font-bold text-purple-title">How this fits FWV</h2>
        <p className="text-plum-900/85 dark:text-plum-100/80">A deal snapshot gives you a first-pass view of whether the numbers deserve deeper review. It should not replace due diligence, lender guidance, property inspections, or market research.</p>
      </section>

      <section className="text-center space-y-3 pb-8">
        <p className="text-plum-900/85 dark:text-plum-100/80">Ready for the next step?</p>
        <Link href="https://fosterwealthventures.com/havenmind" target="_blank" className="btn-regal">Explore HavenMIND AI</Link>
      </section>
    </main>
  );
}
