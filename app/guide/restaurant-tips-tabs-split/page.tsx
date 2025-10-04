// app/guide/restaurant-tips-tabs-split/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ReceiptText } from "lucide-react";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";
import React from "react";

export const metadata: Metadata = {
  title: "Restaurant Tip & Tab Split—Discounts, Tax & Fair Splits",
  description:
    "A practical guide to tipping and splitting the bill with discounts and tax. Learn which amounts tip applies to and how to keep it fair per person.",
};

function Breadcrumb() {
  return (
    <nav className="mb-4 text-sm text-gray-600">
      <Link href="/" className="text-brand-green hover:underline">
        Home
      </Link>{" "}
      &rsaquo;{" "}
      <Link href="/guide" className="text-brand-green hover:underline">
        Guides
      </Link>{" "}
      &rsaquo; <span>Restaurant Tip & Tab Split</span>
    </nav>
  );
}

export default function TipTabSplitGuide() {
  const pageUrl =
    "https://www.fosterwealthventures.com/guide/restaurant-tip-tab-split";
  const shareTitle = String(metadata.title ?? "");

  const faq = [
    { q: "Should we tip on tax?", a: "Most groups tip on the discounted, pre-tax subtotal. Tipping on tax is uncommon." },
    { q: "What about auto-gratuity or service charge?", a: "If your receipt includes a service charge or auto-gratuity, set tip to 0% in the calculator." },
    { q: "Do we split before or after tip?", a: "Split the total after tax and tip so everyone contributes fairly to the final amount." },
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
        <h2>What this calculator does</h2>
        <p>
          This calculator helps you take a messy shared bill and turn it into a clear per‑person amount. You enter the
          bill total, apply any discount, choose how tax is calculated, set a tip, and decide whether that tip is on the
          discounted subtotal or the original amount. It then shows a clean final total and an even split so nobody is
          guessing or overpaying.
        </p>
      </section>

      <section>
        <h2>How to use it</h2>
        <p>
          Start by entering the Bill Amount exactly as shown before tax. Add the Number of People at the table. If you
          have a coupon or promo code, choose whether it is a percent or fixed amount and enter that in the Discount
          area. Set how tax should apply—most places tax the discounted subtotal. Then enter your Tip Percentage and
          choose whether the tip should be based on the discounted subtotal or the original subtotal (many groups still
          tip on the pre‑discount amount to fairly reflect service).
        </p>
        <p>
          The calculator recomputes live: you will see the discounted subtotal, tax added, tip calculated, and final
          total. It divides that by the number of people for a fair per‑person contribution. If someone wants to round,
          you can adjust after agreeing as a group. Try a sample: $80 bill, 10% discount, 8% tax, 18% tip on the
          pre‑discount subtotal, split four ways—watch how each choice changes the final share.
        </p>
      </section>

      <section>
        <h2>Pitfalls and tips</h2>
        <p>
          The most common mistakes: tipping on the wrong base, applying tax before removing the discount, or adding a tip
          when auto‑gratuity is already included. If there is a service charge on the receipt, set tip to zero unless the
          group decides to add more. When in doubt, show the screen so everyone understands the math—it removes pressure
          and keeps things friendly. Ready to try it? Open the calculator and experiment with your own numbers.
        </p>
      </section>

      <section>
        <CTAButton href="/?calc=tip-split" data-testid="try-matching-calc">
          Open the Tip & Tab Split Calculator
        </CTAButton>
      </section>

      <section>
        <h2>Related Guides</h2>
        <p>
          Compare growth decisions in{" "}
          <Link href="/guide/roi-vs-annualized-roi">ROI vs Annualized ROI</Link>, or understand interest behavior in{" "}
          <Link href="/guide/simple-vs-compound-interest">Simple vs Compound Interest</Link>. Browse every tool on the{" "}
          <Link href="/dashboard">calculator dashboard</Link>.
        </p>
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
    </main>
  );
}

export function NavText({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-sm">{children}</p>;
}

export function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{children}</h1>;
}

export function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="mt-3 rounded-xl bg-brand-gold/10 p-4 text-sm leading-relaxed text-brand-green">
      {children}
    </blockquote>
  );
}

export function QuoteRef({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold">{children}</span>;
}

export function Section({ children }: { children: React.ReactNode }) {
  return <section className="mt-8 space-y-8">{children}</section>;
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold">{children}</h2>;
}

export function List({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-6">{children}</ul>;
}

export function CTAWrap({ children }: { children: React.ReactNode }) {
  return <div className="mt-6">{children}</div>;
}

export function HelperText({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-base text-gray-600">{children}</p>;
}
