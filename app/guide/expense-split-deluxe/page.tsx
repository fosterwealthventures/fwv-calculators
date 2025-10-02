// app/guide/expense-split-deluxe/page.tsx
import Link from "next/link";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const PremiumUpsell = dynamic(() => import("@/components/PremiumUpsell.client"), {
  ssr: false,
});

export const metadata = {
  title: "Expense Split Deluxe — Guide | Foster Wealth Ventures",
  description:
    "Split life’s shared costs fairly—roommates, couples, co-parents, and trips—with custom categories and downloadable reports.",
};

export default function ExpenseSplitDeluxeGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-4 text-sm">
        <Link href="/guide" className="underline hover:no-underline">
          ← Back to Guides
        </Link>
      </nav>

      <h1 className="heading-hero">Expense Split Deluxe — Guide</h1>

      <p className="mt-3 rounded-xl bg-brand-gold/10 p-4 text-sm leading-relaxed text-brand-green">
        <span className="font-semibold">2 Corinthians 9:7 —</span> “Each of you
        should give what you have decided in your heart to give, not reluctantly
        or under compulsion, for God loves a cheerful giver.”
      </p>

      <section className="mt-6 space-y-4">
        <p>
          Share costs with clarity and kindness. Expense Split Deluxe handles
          roommates, couples, co-parents, and group travel with flexible splits
          (equal, by income %, custom weights), itemized categories, notes, and
          a downloadable report for records.
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>Add unlimited expenses and custom categories</li>
          <li>Split by percentage, shares, or exact amounts</li>
          <li>Travel mode for trips; child-related categories optional</li>
          <li>Export a clean PDF/CSV summary for transparency</li>
        </ul>
      </section>

<div className="mt-8 flex flex-wrap gap-3">
  <Link
    href="/pricing"
    className="rounded-xl bg-brand-green px-4 py-2 font-semibold text-white hover:opacity-90"
  >
    {/* Unlock with Pro */}
  </Link>
  <Link
    href="/pro?calc=expense-split-deluxe"
    className="inline-flex items-center rounded-xl bg-brand-green px-4 py-2 font-semibold text-white hover:opacity-90"
    aria-label="Unlock Expense Split Deluxe with Pro for $29.99 per month"
  >
    Unlock with Pro ($29.99/mo)
  </Link>

  {/* Premium upsell — bigger, high-contrast panel */}
  <PremiumUpsell className="mt-2" price={59.99} />

  {/* Open Calculator */}
  <Link
    href="/calculators/expense-split-deluxe"
    className="mt-2 inline-flex items-center rounded-xl border border-brand-green px-4 py-2 font-semibold text-brand-green hover:bg-brand-green/5"
  >
    Open Calculator
  </Link>
</div>


      <footer className="mt-8 text-xs text-gray-500">
        Powered by <span className="font-semibold">Foster Wealth Ventures</span>
      </footer>
    </main>
  );
}
