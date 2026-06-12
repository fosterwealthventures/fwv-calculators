import type { Metadata } from "next";
import Link from "next/link";
import TipSplitCalculator from "@/components/calculators/TipSplitCalculator";

export const metadata: Metadata = {
  title: "Tip & Tab Split Calculator | Foster Wealth Calculators",
  description: "Split a restaurant bill with tax, tip, discounts, and the number of people included.",
  alternates: { canonical: "https://fosterwealthventures.store/tip-split" },
};

export default function Page() {
  return (
    <main className="fwv-container py-8 space-y-10">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link href="/" className="text-brand-green hover:underline">Home</Link> <span>›</span>{" "}
        <Link href="/calculators" className="text-brand-green hover:underline">Calculators</Link> <span>›</span>{" "}
        <span className="text-plum-700 dark:text-plum-200">Tip & Tab Split Calculator</span>
      </nav>

      <section className="space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-aure-600 dark:text-aure-400">Utility Calculator</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-title">Tip & Tab Split Calculator</h1>
        <p className="mx-auto max-w-3xl text-plum-900/85 dark:text-plum-100/80">Split a restaurant bill with tax, tip, discounts, and the number of people included.</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="#calculator" className="btn-regal">Split My Bill</Link>
          <Link href="/calculators" className="btn-ghost-regal">Browse All Calculators</Link>
        </div>
      </section>

      <section id="calculator" className="card-regal p-5 md:p-7 space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-purple-title">Tip & Tab Split Calculator</h2>
          <p className="mt-1 text-sm text-plum-900/75 dark:text-plum-100/70">Split a restaurant bill with tax, tip, discounts, and the number of people included.</p>
        </div>
        <TipSplitCalculator />
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">Everyday estimate only. Check your receipt for actual tax, service fees, automatic gratuity, and restaurant-specific charges.</p>
      </section>

      <section className="card-regal p-5 md:p-6 space-y-3">
        <h2 className="text-2xl font-bold text-purple-title">How this fits FWV</h2>
        <p className="text-plum-900/85 dark:text-plum-100/80">This utility stays on the site as a simple everyday helper. It keeps the site useful without distracting from the core credit and real estate calculator pillars.</p>
      </section>

      <section className="text-center space-y-3 pb-8">
        <p className="text-plum-900/85 dark:text-plum-100/80">Ready for the next step?</p>
        <Link href="/calculators" className="btn-regal">Explore Free Calculators</Link>
      </section>
    </main>
  );
}
