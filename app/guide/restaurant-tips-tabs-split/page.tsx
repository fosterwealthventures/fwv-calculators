// app/guide/restaurant-tips-tabs-split/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ReceiptText } from "lucide-react";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";

export const metadata: Metadata = {
  title: "Restaurant Tip & Tab Split—Discounts, Tax & Fair Splits",
  description:
    "A practical guide to tipping and splitting the bill with discounts and tax. Learn which amounts tip applies to and how to keep it fair per person.",
};

function Breadcrumb() {
  return (
    <nav className="mb-4 text-sm text-gray-600">
      <Link href="/" className="text-brand-green hover:underline">Home</Link>{" "}
      &rsaquo;{" "}
      <Link href="/guide" className="text-brand-green hover:underline">Guides</Link>{" "}
      &rsaquo; <span>Restaurant Tip & Tab Split</span>
    </nav>
  );
}

export default function TipTabSplitGuide() {
  // If your route folder is /guide/restaurant-tips-tabs-split this constant can be updated,
  // but it doesn't affect TypeScript. It’s only for sharing.
  const pageUrl =
    "https://www.fosterwealthventures.com/guide/restaurant-tip-tab-split";

  // Coerce Next’s metadata.title to a plain string for <SocialShare />
  const shareTitle = String(metadata.title ?? "");

  const faq = [
    {
      q: "Should we tip on tax?",
      a: "Most groups tip on the discounted, pre-tax subtotal. Tipping on tax is uncommon.",
    },
    {
      q: "What about auto-gratuity or service charge?",
      a: "If your receipt includes a service charge or auto-gratuity, set tip to 0% in the calculator.",
    },
    {
      q: "Do we split before or after tip?",
      a: "Split the total after tax and tip so everyone contributes fairly to the final amount.",
    },
  ];

  const howToSteps = [
    "Enter the bill amount and number of people.",
    "Choose discount type (% or $), then enter the discount value.",
    "Set where tax applies (after or before discount).",
    "Choose the tip % and whether tip is on the discounted or original subtotal.",
    "Review the total and per-person amounts; adjust inputs if needed.",
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: shareTitle,
    description: metadata.description,
    mainEntityOfPage: pageUrl,
    dateModified: "2025-09-20T21:05:43Z",
    publisher: { "@type": "Organization", name: "Foster Wealth Ventures" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to split a restaurant bill with discounts, tax and tip",
    step: howToSteps.map((name, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name,
    })),
  };

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />

      <GuideHero
        title="Restaurant Tip & Tab Split — How to Handle Discounts & Tax"
        subtitle="A simple, fair method that matches the logic in our free calculator."
        icon={<ReceiptText className="text-brand-green" />}
      />

      <p className="mt-3 text-sm text-gray-600">Estimated reading time: 3–4 minutes</p>

      <section>
        <h2>Quick Summary</h2>
        <p>
          <strong>Most fair approach:</strong> apply discounts first, calculate
          tax on the discounted subtotal, compute tip on the discounted{" "}
          <em>pre-tax</em> subtotal, then split the final total across people.
        </p>
      </section>

      <section>
        <h2>Common pitfalls</h2>
        <ul>
          <li>Forgetting to apply the discount before tax.</li>
          <li>Tipping on the wrong base (tax vs pre-tax subtotal).</li>
          <li>Not accounting for auto-gratuity already on the receipt.</li>
        </ul>
        <p>
          See also:{" "}
          <Link href="/guide/5-costly-calculator-mistakes">
            5 Costly Calculator Mistakes
          </Link>
          .
        </p>
      </section>

      <section>
        <CTAButton href="/?calc=tip-split">👉 Try the Tip &amp; Tab Split Calculator</CTAButton>
      </section>

      <section>
        <h2>Related Guides</h2>
        <ul>
          <li>
            <Link href="/guide/roi-vs-annualized-roi">
              ROI vs Annualized ROI
            </Link>
          </li>
          <li>
            <Link href="/guide/simple-vs-compound-interest">
              Simple vs Compound Interest
            </Link>
          </li>
        </ul>
      </section>

      <div className="mt-6">
        <SocialShare url={pageUrl} title={shareTitle} />
      </div>

      <GuideNav
        prev={{
          href: "/guide/5-costly-calculator-mistakes",
          title: "5 Costly Calculator Mistakes",
        }}
      />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </main>
  );
}
