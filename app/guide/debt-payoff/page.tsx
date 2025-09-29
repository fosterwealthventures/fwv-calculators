// app/guide/debt-payoff/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Debt Payoff Calculator Guide | Foster Wealth Ventures",
  description:
    "Learn how to choose between snowball vs. avalanche and get a clear path to debt freedom.",
};

export default function DebtPayoffGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-4 text-sm">
        <Link href="/guide" className="underline hover:no-underline">
          ← Back to Guides
        </Link>
      </nav>

      <h1 className="heading-hero">Debt Payoff Calculator — Guide</h1>

      <p className="mt-3 rounded-xl bg-brand-gold/10 p-4 text-sm leading-relaxed text-brand-green">
        <span className="font-semibold">Romans 13:8 —</span>{" "}
        “Let no debt remain outstanding, except the continuing debt to love one
        another.”
      </p>

      <section className="mt-6 space-y-4">
        <p>
          Debt can feel overwhelming, but a clear plan brings peace. This
          calculator compares the{" "}
          <span className="font-semibold">snowball</span> (smallest balance
          first) and <span className="font-semibold">avalanche</span> (highest
          interest first) methods so you can pick the approach that motivates
          you most.
        </p>
        <p>
          Enter each debt (balance, APR, minimum payment), choose a strategy,
          and instantly see your payoff date and total interest saved. Small,
          steady steps → big freedom.
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
          href="/calculators/debt-payoff"
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
