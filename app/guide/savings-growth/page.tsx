// app/guide/savings-growth/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Savings Growth Calculator Guide | Foster Wealth Ventures",
  description:
    "Learn how the Savings Growth Calculator turns diligent planning into real abundance with compounding over time.",
};

export default function SavingsGrowthGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-4 text-sm">
        <Link href="/guide" className="underline hover:no-underline">
          ← Back to Guides
        </Link>
      </nav>

      <h1 className="heading-hero">Savings Growth Calculator — Guide</h1>

      <p className="mt-3 rounded-xl bg-brand-gold/10 p-4 text-sm leading-relaxed text-brand-green">
        <span className="font-semibold">Proverbs 21:5 —</span>{" "}
        “The plans of the diligent lead surely to abundance, but everyone who is
        hasty comes only to poverty.”
      </p>

      <section className="mt-6 space-y-4">
        <p>
          The Savings Growth Calculator helps you see how consistent, diligent
          contributions lead to long-term abundance. Enter your deposit amount,
          frequency, interest rate, and time horizon to visualize how compound
          growth works in your favor.
        </p>
        <p>
          Use this guide to test scenarios: “What happens if I add $50/month?”
          “How much faster if I raise the rate by 1%?” Build a plan you can
          stick to and let time do the heavy lifting.
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/pricing"
          className="rounded-xl bg-brand-green px-4 py-2 font-semibold text-white hover:opacity-90"
        >
          Unlock with Plus ($4.99/mo)
        </Link>
        <Link
          href="/calculators/savings"
          className="rounded-xl border border-brand-green px-4 py-2 font-semibold text-brand-green hover:bg-brand-green/5"
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
