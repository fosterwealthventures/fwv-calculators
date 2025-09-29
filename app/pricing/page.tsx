// app/pricing/page.tsx — SERVER component (no "use client")
import PriceClient from "./price-client";

export const metadata = {
  title: "Plans & Pricing · Foster Wealth Calculators",
  description:
    "Choose Free, Plus, Pro, or Premium. Plus removes ads and unlocks Savings & Debt; Pro/Premium unlock advanced calculators.",
  alternates: { canonical: "/pricing" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Plans & Pricing · Foster Wealth Calculators",
    description:
      "Free, Plus, Pro, and Premium options. Pick monthly or yearly billing.",
    url: "/pricing",
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <main className="fwv-container py-6 space-y-6">
      <PriceClient />

      {/* Deep-link CTAs: set plan cookie server-side then redirect to calculators */}
      <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Plus (unlocks Savings + Debt; open Savings by default) */}
        <a className="card p-4 text-center hover:shadow-md transition"
           href="/api/plan?to=plus&calc=savings">
          See Plus calculators
        </a>

        {/* Pro (Pro Choice; choose which to open) */}
        <a className="card p-4 text-center hover:shadow-md transition"
           href="/api/plan?to=pro&calc=employee-cost">
          See Pro — Employee Cost
        </a>
        <a className="card p-4 text-center hover:shadow-md transition"
           href="/api/plan?to=pro&calc=expense-split-deluxe">
          See Pro — Expense Split Deluxe
        </a>

        {/* Premium (everything; showcase your best) */}
        <a className="card p-4 text-center hover:shadow-md transition"
           href="/api/plan?to=premium&calc=expense-split-deluxe">
          See Premium calculators
        </a>
      </section>
    </main>
  );
}
