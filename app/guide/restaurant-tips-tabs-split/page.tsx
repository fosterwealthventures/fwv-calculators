// app/guide/restaurant-tips-tabs-split/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

import { RelatedLink, RelatedSection } from "@/components/GuideLinks";
import GuideNav from "@/components/GuideNav";
import { OpenCalculatorButton, SocialShare } from "@/components/GuideParts";
import {
  CTAWrap,
  H1,
  H2,
  HelperText,
  NavText,
  Section
} from "@/components/GuideTypography";

export const metadata: Metadata = {
  title: "Tip Split Calculator Guide: Split Restaurant Bills & Tips",
  description:
    "A practical guide to tipping and splitting the bill with discounts and tax. Learn which amounts tip applies to and how to keep it fair per person.",
};

function Breadcrumb() {
  return (
    <NavText>
      <Link href="/" className="text-brand-green hover:underline">Home</Link> &rsaquo;{" "}
      <Link href="/guide" className="text-brand-green hover:underline">Guides</Link> &rsaquo;{" "}
      <span>Tip Split Calculator Guide: Split Restaurant Bills &amp; Tips</span>
    </NavText>
  );
}

export default function TipTabSplitGuide() {
  const pageUrl =
    "https://fosterwealthventures.store/guide/restaurant-tip-tab-split";
  const shareTitle = String(metadata.title ?? "");

  // FAQ / How-to for schema
  const faq = [
    { q: "Should we tip on tax?", a: "Most groups tip on the discounted, pre-tax subtotal. Tipping on tax is uncommon." },
    { q: "What about auto-gratuity or service charge?", a: "If your receipt includes a service charge or auto-gratuity, set tip to 0% in the calculator." },
    { q: "Do we split before or after tip?", a: "Split the total after tax and tip so everyone contributes fairly to the final amount." },
    { q: "Is Split by Order free?", a: "Split by Order (including shared appetizers) is included with the Plus plan and higher. The basic Tip & Tab Split remains free." },
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
    dateModified: "2025-10-19T00:00:00Z",
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
    <main>
      {/* Navigation */}
      <Breadcrumb />

      {/* Page Title */}
      <H1>Tip Split Calculator Guide: Split Restaurant Bills &amp; Tips</H1>

      {/* Reading time */}
      <p className="mt-2 text-sm text-gray-600">Estimated reading time: 3–4 minutes</p>

      {/* Main content sections */}
      <Section>
        <div>
          <H2>What this calculator does (Free)</H2>
          <p>
            The Free version helps you turn a messy shared bill into a clear per-person amount for up to <b>4 people</b>.
            Enter the bill total, apply any discount, choose how tax is calculated, set a tip, and choose whether that tip
            is on the discounted or original subtotal. The app shows a clean final total and an even split so nobody is
            guessing or overpaying.
          </p>
        </div>

        <div>
          <H2>How to use it</H2>
          <p>
            Start by entering the Bill Amount before tax. Add the Number of People. If you have a coupon or promo code,
            choose percent or fixed amount in Discount. Set how tax should apply—most places tax the discounted subtotal.
            Then enter your Tip Percentage and choose whether the tip should be based on the discounted or the original
            subtotal (some groups tip on the pre-discount amount to reflect service).
          </p>
          <p>
            The calculator recomputes live: you’ll see the discounted subtotal, tax, tip, and final total. It divides that
            by the number of people for a fair per-person contribution. Example: $80 bill, 10% discount, 8% tax, 18% tip
            on the pre-discount subtotal, split four ways—watch how each choice changes the share.
          </p>
        </div>

        <div>
          <H2>When to upgrade (Plus)</H2>
          <p>
            For uneven orders, shared appetizers, groups of <b>5+</b>, or if you want exports, use
            <span className="ml-2 rounded-md border px-1.5 py-0.5 text-[11px]">Plus</span> and switch to
            <b> Split by Order</b>. It allocates tax and tip proportionally to each person’s items.
          </p>
        </div>

        <div>
          <H2>Pitfalls & tips</H2>
          <p>
            Common mistakes: tipping on the wrong base, applying tax before removing the discount, or adding a tip when a
            service charge already applies. If there’s auto-gratuity, set Tip to 0% (or only the extra you want).
          </p>
        </div>
      </Section>

      {/* CTA */}
      <CTAWrap>
        <OpenCalculatorButton slug="tip-split" className="mt-2" />
        <HelperText>Free to use — open the calculator and try your own numbers.</HelperText>
      </CTAWrap>

      {/* Related */}
      <RelatedSection title="Related">
        <RelatedLink href="/guide/restaurant-split-by-order" tag="Guide">
          Bill Split by Item Calculator Guide: Orders &amp; Shared Appetizers
        </RelatedLink>
        <RelatedLink href="/guide/roi-vs-annualized-roi">ROI Calculator Guide: How to Calculate Return on Investment</RelatedLink>
      </RelatedSection>

      {/* Share */}
      <div className="mt-6">
        <SocialShare url={pageUrl} title={shareTitle} />
      </div>

      {/* Bottom nav */}
      <GuideNav
        prev={{
          href: "/guide/5-costly-calculator-mistakes",
          title: "5 Costly Calculator Mistakes",
        }}
      />

      {/* SEO schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
    </main>
  );
}
