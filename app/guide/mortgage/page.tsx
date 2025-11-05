import { AdInContent } from "@/components/ads";
import Breadcrumb from "@/components/Breadcrumb";
import GuideNav from "@/components/GuideNav";
import { CTAButton, GuideHero, SocialShare } from "@/components/GuideParts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Guide",
  description: "Payment, interest, and amortization explained.",
};

// Use shared Breadcrumb for consistency

export default function GuidePage() {
  const pageUrl =
    "https://fosterwealthventures.store/guide/mortgage";
  const shareTitle = String(metadata.title ?? "");

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: shareTitle,
    description: "Payment, interest, and amortization explained.",
    mainEntityOfPage: pageUrl,
    dateModified: "2025-10-21T00:00:00Z",
    publisher: { "@type": "Organization", name: "Foster Wealth Ventures" },
  };

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb trail={[{ href: "/guide", label: "Guides" }, { href: "/guide/mortgage", label: "Mortgage" }]} />

      <GuideHero
        title="Mortgage — Guide"
        subtitle="Payment, interest, and amortization breakdowns."
        icon={null}
      />

      <p className="mt-3 text-sm text-gray-600">Estimated reading time: 2 minutes</p>
      {/* (ad moved lower to avoid spacing under title) */}

      <section>
        <h2>What it does</h2>
        <p>
          Calculates monthly mortgage payments and shows how much goes toward principal vs interest over time.
        </p>
      </section>

      {/* Native banner ad */}
      <div className="not-prose my-6">
        <AdInContent />
      </div>

      <section>
        <h2>Inputs</h2>
        <ul>
          <li>Loan Amount</li>
          <li>Interest Rate (annual)</li>
          <li>Loan Term (years)</li>
        </ul>
      </section>

      <section>
        <h2>Output</h2>
        <ul>
          <li>Monthly Payment</li>
          <li>Total Interest Paid</li>
          <li>Amortization table</li>
        </ul>
      </section>

      <section>
        <h2>Example</h2>
        <p>$300,000 loan at 6.5% for 30 years → Monthly payment: ~$1,896</p>
      </section>

      <section>
        <h2>Tip</h2>
        <p>Compare different loan terms to see how extra payments can save you thousands in interest.</p>
      </section>

      <section>
        <CTAButton href="/calculators/mortgage" data-testid="try-matching-calc">
          Open the Mortgage calculator
        </CTAButton>
      </section>

      <div className="mt-6 not-prose">
        <SocialShare url={pageUrl} title={shareTitle} />
      </div>

      <GuideNav
        prev={{
          href: "/guide/break-even",
          title: "Break-Even",
        }}
        next={{
          href: "/guide/interest",
          title: "Interest (Simple/Compound)",
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}
