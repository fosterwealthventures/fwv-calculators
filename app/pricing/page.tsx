// app/pricing/page.tsx — SERVER component (clean)
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
      {/* Removed legacy anchors to /api/plan */}
    </main>
  );
}
