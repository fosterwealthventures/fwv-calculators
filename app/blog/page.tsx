// app/guide/[slug]/page.tsx
import Link from "next/link";
import Script from "next/script";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import GuideNav from "@/components/GuideNav";
import AdInSidebar from "@/components/ads/AdInSidebar";
import AdBannerTop from "@/components/ads/AdBannerTop";
import HtmlWithAutoAd from "@/components/ads/HtmlWithAutoAd";
import AutoToc from "@/components/toc/AutoToc";

// Guide slug → plan + calculator mapping
type Plan = "free" | "plus" | "pro";
type ProKey = "employee" | "expense_split";

const GUIDE_META: Record<
  string,
  { title: string; plan: Plan; calc: string; proKey?: ProKey }
> = {
  "roi-vs-annualized-roi": { title: "ROI vs Annualized ROI", plan: "free", calc: "roi" },
  "break-even-made-simple": { title: "Break-Even Calculator — Guide", plan: "free", calc: "break-even" },
  "mortgage-payment-breakdown": { title: "Mortgage Payment Breakdown — Guide", plan: "free", calc: "mortgage" },
  "simple-vs-compound-interest": { title: "Simple vs. Compound Interest — Guide", plan: "free", calc: "interest" },
  "set-your-freelance-rate-right": { title: "Set Your Freelancer Rate Right — Guide", plan: "free", calc: "freelancer-rate" },

  "savings-growth": { title: "Savings Growth Calculator — Guide", plan: "plus", calc: "savings" },
  "debt-payoff": { title: "Debt Payoff Calculator — Guide", plan: "plus", calc: "debt-payoff" },

  "expense-split-deluxe": { title: "Expense Split Deluxe — Guide", plan: "pro", calc: "expense-split-deluxe", proKey: "expense_split" },
  "employee-cost": { title: "Employee Cost Calculator — Guide", plan: "pro", calc: "employee-cost", proKey: "employee" },
};

export const revalidate = 60;

export default async function GuidePage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const meta = GUIDE_META[slug];
  if (!meta) return notFound();

  // ✅ Fix: await cookies() so TS doesn't complain
  const cookieStore = await cookies();
  const _planCookie = cookieStore.get("fwv_plan")?.value ?? "free"; // underscore avoids no-unused-vars if you don't use it

  // Decide CTA destination based on required plan
  const openHref =
    meta.plan === "free"
      ? `/dashboard?calc=${encodeURIComponent(meta.calc)}`
      : meta.plan === "plus"
        ? `/upgrade?plan=plus&select=${encodeURIComponent(meta.calc)}&from=/guide/${slug}`
        : `/upgrade/choose-pro?select=${encodeURIComponent(meta.calc)}&from=/guide/${slug}`;

  const buttonLabel =
    meta.plan === "free"
      ? "Open Calculator"
      : meta.plan === "plus"
        ? "Unlock with Plus ($6.99/mo)"
        : "Choose in Pro plan";

  // Placeholder HTML so ToC + ads render; replace with your real content as needed
  const html = /* html */ `
    <h2>What this calculator does</h2>
    <p>This guide explains how to use the ${meta.title.replace(" — Guide", "")}. Enter your inputs and use the results to plan with confidence.</p>

    <h2>How to use it</h2>
    <p>1) Enter your numbers. 2) Adjust assumptions. 3) Read the breakdown and totals. 4) Use the insights to make a decision.</p>

    <h2>Tips</h2>
    <p>Try a few scenarios to see sensitivity. Save a link with your chosen inputs to revisit later.</p>
  `;

  // JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "/guide" },
      { "@type": "ListItem", position: 3, name: meta.title, item: `/guide/${slug}` },
    ],
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    author: { "@type": "Organization", name: "Foster Wealth Ventures" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `/guide/${slug}` },
  };

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[1fr_320px]">
      {/* JSON-LD */}
      <Script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id="article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      {/* Main */}
      <div>
        <nav className="mb-6 text-sm text-gray-600" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/guide" className="hover:underline">Guides</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-500">{meta.title}</span>
        </nav>

        {/* banner ad (free-only via your Ad gate logic elsewhere) */}
        <AdBannerTop />

        <h1 className="mt-4 text-3xl font-bold text-brand-green">{meta.title}</h1>

        {/* CTA row */}
        <div className="mt-4">
          <Link
            href={openHref}
            className="inline-flex items-center rounded-lg bg-brand-green px-4 py-2 font-semibold text-white hover:bg-emerald-700"
          >
            {buttonLabel}
          </Link>
          {meta.plan !== "free" ? (
            <span className="ml-3 text-sm text-gray-600">
              {meta.plan === "plus"
                ? "This calculator is included with Plus."
                : "Pro includes one advanced calculator (choose Expense Split Deluxe or Employee Cost). Upgrade to Premium for both."}
            </span>
          ) : null}
        </div>

        {/* ToC */}
        <div className="mt-6">
          <AutoToc html={html} title="Guide sections" />
        </div>

        {/* Body with auto in-content ad insertion */}
        <div className="prose mt-4 max-w-none">
          <HtmlWithAutoAd html={html} />
        </div>

        {/* Related */}
        <section className="mt-12 border-t pt-6">
          <h2 className="text-xl font-semibold text-brand-green">Related</h2>
          <ul className="mt-4 list-inside list-disc text-gray-700">
            <li><Link href="/guide/roi-vs-annualized-roi">Guide: ROI vs Annualized ROI</Link></li>
            <li><Link href="/guide/mortgage-payment-breakdown">Guide: Mortgage Payment Breakdown</Link></li>
            <li><Link href="/dashboard">Explore All Calculators</Link></li>
          </ul>
        </section>
      </div>

      {/* Right rail */}
      <aside className="sticky top-6 h-fit space-y-8">
        <GuideNav className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" />
        <AdInSidebar width={300} height={600} />
      </aside>
    </div>
  );
}
