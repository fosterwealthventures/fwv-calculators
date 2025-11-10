// app/calculators/[slug]/page.tsx
// Dynamic route that renders the suites component; the component will
// read the slug from the pathname and activate the matching calculator.

import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";
import type { Metadata } from "next";
import { CALCULATORS, bySlug } from "@/lib/calculators";

export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const entry = bySlug(params.slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.summary || 'Open a calculator from Foster Wealth Calculators.',
    alternates: { canonical: entry.path },
  };
}

export default function CalculatorSlugPage() {
  return (
    <main className="fwv-container py-6">
      <FosterWealthCalculators />
    </main>
  );
}
