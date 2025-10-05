import type { Metadata } from "next";
import Link from "next/link";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";
import React from "react";

export const metadata: Metadata = {
  title:
    "ROI vs Annualized ROI—How to Read Them & Boost Your Investment Strategy",
  description:
    "Learn the difference between ROI and annualized ROI and how to use both to evaluate investments effectively.",
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
      &rsaquo; <span>ROI vs Annualized ROI</span>
    </nav>
  );
}

export default function GuidePage() {
  const pageUrl =
    "https://www.fosterwealthventures.com/guide/roi-vs-annualized-roi";
  const shareTitle = String(metadata.title ?? "");

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: shareTitle,
    description:
      "Learn the difference between ROI and annualized ROI and how to use both to evaluate investments effectively.",
    mainEntityOfPage: pageUrl,
    dateModified: "2025-09-20T21:27:38Z",
    publisher: { "@type": "Organization", name: "Foster Wealth Ventures" },
  };

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />

      <GuideHero
        title="ROI vs Annualized ROI"
        subtitle="Understand raw return vs time‑adjusted growth so you can compare investments fairly."
        icon={null}
      />

      <p className="mt-3 text-sm text-gray-600">Estimated reading time: 2 minutes</p>

      <section>
        <h2>What it does</h2>
        <p>
          Shows two views of an investment. Simple ROI is total gain; annualized ROI spreads that gain per year so you can compare things held for different lengths.
        </p>
      </section>

      <section>
        <h2>How to use it</h2>
        <p>Enter starting amount, ending value, and time in years; the numbers update at once.</p>
        <ul>
          <li>Initial Investment</li>
          <li>Final Value (today or sale)</li>
          <li>Time (years, can be decimal)</li>
          <li>Example: 10000 → 15000 in 2 years ≈ 50% ROI, lower annualized rate.</li>
        </ul>
      </section>

      <section>
        <h2>When to use it</h2>
        <p>
          Use simple ROI for a quick check when holding times match. Use annualized ROI to compare deals or funds with different time lengths.
        </p>
      </section>

      <section>
        <h2>Interpreting results</h2>
        <p>
          Higher simple ROI means more total profit; higher annualized ROI means faster pace. A small quick gain can beat a large slow gain; weak annualized return vs similar risk may signal moving funds.
        </p>
      </section>

      <section>
        <CTAButton href="/?calc=roi" data-testid="try-matching-calc">
          Open the ROI vs Annualized ROI calculator
        </CTAButton>
      </section>

      <section>
        <h2>Related</h2>
        <p>
          Continue exploring with the{" "}
          <Link href="/guide/break-even-made-simple">Break-Even Made Simple</Link>{" "}
          guide or see long‑term payment structure detail in{" "}
          <Link href="/guide/mortgage-payment-breakdown">
            Mortgage Payment Breakdown
          </Link>
          . You can also browse every tool on the{" "}
          <Link href="/dashboard">calculator dashboard</Link>.
        </p>
      </section>

      <div className="mt-6 not-prose">
        <SocialShare url={pageUrl} title={shareTitle} />
      </div>

      <GuideNav
        next={{
          href: "/guide/break-even-made-simple",
          title: "Break-Even Made Simple",
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
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
