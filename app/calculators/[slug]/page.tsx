// Legacy dynamic calculator route.
// Active calculator pages now live at top-level SEO-friendly routes like /credit-utilization.

import { bySlug } from "@/lib/calculators";
import { redirect } from "next/navigation";

export function generateStaticParams() {
  return [];
}

export default function CalculatorSlugPage({ params }: { params: { slug: string } }) {
  const entry = bySlug(params.slug);
  redirect(entry?.path || "/calculators");
}
