// app/guide/[slug]/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import GuideNav from "@/components/GuideNav";
import AdInSidebar from "@/components/ads/AdInSidebar";
import AdBannerTop from "@/components/ads/AdBannerTop";
import HtmlWithAutoAd from "@/components/ads/HtmlWithAutoAd";
import AutoToc from "@/components/toc/AutoToc";

type Plan = "free" | "plus" | "pro" | "premium";
type ProKey = "employee" | "expense_split";

const GUIDE_META: Record<
  string,
  { title: string; plan: Plan; calc: string; proKey?: ProKey }
> = {
  // Canonical slugs (keep these as the single source of truth)
  "roi-vs-annualized-roi": { title: "ROI vs Annualized ROI — Guide", plan: "free", calc: "roi" },
  "break-even-made-simple": { title: "Break-Even Calculator — Guide", plan: "free", calc: "break-even" },
  "mortgage-payment-breakdown": { title: "Mortgage Payment Breakdown — Guide", plan: "free", calc: "mortgage" },
  "simple-vs-compound-interest": { title: "Simple vs. Compound Interest — Guide", plan: "free", calc: "interest" },
  "set-your-freelance-rate-right": { title: "Set Your Freelancer Rate Right — Guide", plan: "free", calc: "freelancer-rate" },

  "savings-growth": { title: "Savings Growth Calculator — Guide", plan: "plus", calc: "savings" },
  "debt-payoff": { title: "Debt Payoff Calculator — Guide", plan: "plus", calc: "debt-payoff" },

  "expense-split-deluxe": { title: "Expense Split Deluxe — Guide", plan: "pro", calc: "expense-split-deluxe", proKey: "expense_split" },
  "employee-cost": { title: "Employee Cost Calculator — Guide", plan: "pro", calc: "employee-cost", proKey: "employee" },
};

// Aliases → canonical slug
const SLUG_ALIASES: Record<string, string> = {
  "break-even": "break-even-made-simple",
  mortgage: "mortgage-payment-breakdown",
  "freelance-rate": "set-your-freelance-rate-right",
  debt: "debt-payoff",
  savings: "savings-growth",
  "expense-split": "expense-split-deluxe",
  employee: "employee-cost",
};

const _CANONICAL_SLUGS = Object.keys(GUIDE_META);
const CALC_HOME = "/calculators"; // <- If your calculators live under /dashboard, change this to "/dashboard"

export const revalidate = 60;

const PLAN_RANK: Record<Plan, number> = { free: 0, plus: 1, pro: 2, premium: 3 };

function resolveSlug(slug: string): string | null {
  if (GUIDE_META[slug]) return slug;
  if (SLUG_ALIASES[slug]) return SLUG_ALIASES[slug];
  return null;
}

function getCTA(userPlan: Plan, required: Plan, calc: string, slug: string) {
  const userRank = PLAN_RANK[userPlan] ?? 0;
  const needRank = PLAN_RANK[required];

  if (userRank >= needRank) {
    return { href: `${CALC_HOME}?calc=${encodeURIComponent(calc)}`, label: "Open Calculator" };
  }
  if (required === "plus") {
    return {
      href: `/upgrade?plan=plus&select=${encodeURIComponent(calc)}&from=/guide/${slug}`,
      label: "Unlock with Plus ($6.99/mo)",
      subtext: "Includes Savings & Debt Payoff calculators.",
    };
  }
  return {
    href: `/upgrade/choose-pro?select=${encodeURIComponent(calc)}&from=/guide/${slug}`,
    label: "Choose in Pro plan",
    subtext: "Pro includes one advanced calculator (Expense Split Deluxe or Employee Cost). Premium unlocks both.",
  };
}

export default async function GuidePage({ params }: { params: { slug: string } }) {
  const incoming = params.slug;
  const slug = resolveSlug(incoming);

  // If we don't recognize the slug at all, send people to /guide index (no 404).
  if (!slug) redirect("/guide");

  // ✅ TS-safe cookies usage
  const cookieStore = await cookies();
  const userPlan = (cookieStore.get("fwv_plan")?.value as Plan | undefined) ?? "free";

  const meta = GUIDE_META[slug];
  const cta = getCTA(userPlan, meta.plan, meta.calc, slug);

  // Real content goes here; ToC parses <h2>/<h3> headings
  const html = /* html */ `
    <h2>What this calculator does</h2>
    <p>This guide explains how to use the <strong>${meta.title.replace(" — Guide", "")}</strong>. Enter your inputs, adjust assumptions, and use the results to plan with confidence.</p>

    <h2>How to use it</h2>
    <ol>
      <li>Enter your numbers accurately.</li>
      <li>Adjust assumptions to see different scenarios.</li>
      <li>Review the output breakdown and totals.</li>
      <li>Apply the insights to your decision.</li>
    </ol>

    <h2>Tips</h2>
    <ul>
      <li>Test multiple scenarios to understand sensitivity.</li>
      <li>Save a link with your chosen inputs for later.</li>
    </ul>

    <h2>Disclaimer</h2>
    <p>These tools are for educational purposes only and are not financial, tax, or legal advice. Results are estimates and may differ from your specific situation.</p>
  `;

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[1fr_320px]">
      {/* Main column */}
      <div>
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-gray-600" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/guide" className="hover:underline">Guides</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-500">{meta.title}</span>
        </nav>

        {/* Top banner ad — show on FREE guides only */}
        {meta.plan === "free" ? <AdBannerTop /> : null}

        <h1 className="mt-4 text-3xl font-bold text-brand-green">{meta.title}</h1>

        {/* CTA */}
        <div className="mt-4">
          <Link
            href={cta.href}
            className="inline-flex items-center rounded-lg bg-brand-green px-4 py-2 font-semibold text-white hover:bg-emerald-700"
          >
            {cta.label}
          </Link>
          {"subtext" in cta && cta.subtext ? (
            <span className="ml-3 text-sm text-gray-600">{cta.subtext}</span>
          ) : null}
        </div>

        {/* Table of Contents */}
        <div className="mt-6">
          <AutoToc html={html} title="Guide sections" />
        </div>

        {/* Body with automatic in-content ad insertion */}
        <div className="prose mt-4 max-w-none">
          <HtmlWithAutoAd html={html} />
        </div>

        {/* Related */}
        <section className="mt-12 border-t pt-6">
          <h2 className="text-xl font-semibold text-brand-green">Related</h2>
          <ul className="mt-4 list-inside list-disc text-gray-700">
            <li><Link href="/guide/roi-vs-annualized-roi">Guide: ROI vs Annualized ROI</Link></li>
            <li><Link href="/guide/mortgage-payment-breakdown">Guide: Mortgage Payment Breakdown</Link></li>
            <li><Link href="/guide">All Guides</Link></li>
          </ul>
        </section>
      </div>

      {/* Right rail */}
      <aside className="sticky top-6 h-fit space-y-8">
        <GuideNav className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" />
        {meta.plan === "free" ? <AdInSidebar width={300} height={600} /> : null}
      </aside>
    </div>
  );
}

// Pre-generate only canonical slugs (aliases are handled by redirects below)
export async function generateStaticParams() {
  return Object.keys(GUIDE_META).map((slug) => ({ slug }));
}
