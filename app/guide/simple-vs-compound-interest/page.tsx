import type { Metadata } from "next";
import Link from "next/link";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";
import React from "react";

export const metadata: Metadata = {
  title:
    "Simple vs Compound Interest — Updated Calculator with Monthly Contributions & Frequency",
  description:
    "Learn how our updated Simple vs Compound Interest calculator works: add monthly contributions, choose compounding frequency, view real-time totals, and see a year-by-year breakdown.",
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
      &rsaquo; <span>Simple vs Compound Interest</span>
    </nav>
  );
}

export default function GuidePage() {
  const pageUrl =
    "https://www.fosterwealthventures.com/guide/simple-vs-compound-interest";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Simple vs Compound Interest — Updated Calculator with Monthly Contributions & Frequency",
    description:
      "How to use our updated interest calculator: toggle Simple/Compound, add monthly contributions, pick compounding frequency (Annually→Daily), see real-time totals and a year-by-year table.",
    mainEntityOfPage: pageUrl,
    dateModified: "2025-10-05T12:00:00Z",
    publisher: { "@type": "Organization", name: "Foster Wealth Ventures" },
  };

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />

      <GuideHero
        title="Simple vs Compound Interest"
        subtitle="Now supports monthly contributions, flexible compounding frequency, and a clear year-by-year breakdown."
        icon={null}
      />

      <p className="mt-3 text-sm text-gray-600">Estimated reading time: 3 minutes</p>

      {/* What it does */}
      <section>
        <h2>What this calculator does</h2>
        <p>
          It compares <strong>Simple</strong> vs <strong>Compound</strong> interest growth
          using the same set of inputs. You can:
        </p>
        <ul>
          <li><strong>Toggle modes</strong>: Simple or Compound.</li>
          <li>
            <strong>Add monthly contributions</strong> to see how regular deposits change the curve.
          </li>
          <li>
            <strong>Pick a compounding frequency</strong> (Annually, Semi-Annually, Quarterly,
            Monthly, or Daily) when in Compound mode.
          </li>
          <li>
            See <strong>real-time totals</strong>: Final Amount, Total Interest, and
            Total Contributed.
          </li>
          <li>
            Review a <strong>year-by-year breakdown</strong> of starting balance, contributions,
            interest, and ending balance.
          </li>
        </ul>
      </section>

      {/* How to use it */}
      <section>
        <h2>How to use it</h2>
        <ol>
          <li>
            Enter your <strong>Principal ($)</strong>, <strong>Annual Rate (%)</strong>, and{" "}
            <strong>Years</strong>.
          </li>
          <li>
            (Optional) Add a <strong>Monthly Contribution ($)</strong>. We assume contributions happen at the{" "}
            <em>end of each month</em>.
          </li>
          <li>
            Choose a <strong>Compounding Frequency</strong> if you’re in <em>Compound</em> mode:
            Annually, Semi-Annually, Quarterly, Monthly, or Daily.
          </li>
          <li>
            Use the <strong>Simple / Compound</strong> toggle to compare outcomes instantly.
          </li>
        </ol>
        <p>
          The <em>Results</em> panel updates immediately. Scroll down to the table to see how the balance
          evolves year by year.
        </p>
      </section>

      {/* Interpreting results */}
      <section>
        <h2>Interpreting results</h2>
        <ul>
          <li>
            <strong>Final Amount</strong> — your ending balance at the end of the period.
          </li>
          <li>
            <strong>Total Interest</strong> — the portion of your ending balance that came from growth.
          </li>
          <li>
            <strong>Total Contributed</strong> — your principal plus all monthly deposits.
          </li>
        </ul>
        <p>
          Over longer time horizons, <strong>Compound</strong> typically outpaces <strong>Simple</strong> because
          interest earns interest. If the difference looks small, try increasing years, rate, or contribution size.
        </p>
      </section>

      {/* Year-by-year breakdown */}
      <section>
        <h2>Year-by-year breakdown</h2>
        <p>
          The table shows each year’s <strong>starting balance</strong>, <strong>contributions</strong>,
          <strong> interest</strong>, and <strong>ending balance</strong>. Monthly contributions post at the end
          of each month, so they begin earning growth the following month.
        </p>
        <p>
          In <strong>Compound</strong> mode, interest compounds at the chosen frequency (converted internally to an
          equivalent monthly rate). In <strong>Simple</strong> mode, interest accrues on principal-to-date only —
          <em>interest itself doesn’t earn interest</em>.
        </p>
      </section>

      {/* Under the hood */}
      <section>
        <h2>Under the hood (formulas)</h2>
        <ul>
          <li>
            <strong>Compound with monthly contributions:</strong>{" "}
            monthly rate r<sub>m</sub> = (1 + r/n)<sup>n/12</sup> − 1. Each month:
            <em> balance = balance × (1 + r<sub>m</sub>) + PMT</em>.
          </li>
          <li>
            <strong>Simple with monthly contributions:</strong>{" "}
            monthly interest = (principal to date) × (r/12). Contributions increase principal,
            but interest does not compound.
          </li>
          <li>
            <strong>Totals:</strong> “Total Contributed” = initial principal + all monthly deposits.
          </li>
        </ul>
        <p className="text-sm text-gray-600">
          Assumptions: constant nominal rate; contributions at end of month; frequency choice affects
          compounding only in Compound mode.
        </p>
      </section>

      {/* CTA */}
      <section>
        <CTAButton href="/?calc=interest">
          Open the updated calculator (Simple / Compound Interest)
        </CTAButton>
      </section>

      {/* Related */}
      <section>
        <h2>Related Guides</h2>
        <p>
          Keep building your plan with{" "}
          <Link href="/guide/set-your-freelancer-rate-right">
            Set Your Freelancer Rate Right
          </Link>{" "}
          and fair bill sharing in{" "}
          <Link href="/guide/restaurant-tips-tabs-split">
            Restaurant Tip &amp; Tab Split
          </Link>
          . You can also browse every tool on the{" "}
          <Link href="/dashboard">calculator dashboard</Link>.
        </p>
      </section>

      <div className="not-prose mt-6">
        <SocialShare
          url={pageUrl}
          title="Simple vs Compound Interest — Updated Calculator with Monthly Contributions & Frequency"
        />
      </div>

      <GuideNav
        prev={{
          href: "/guide/mortgage-payment-breakdown",
          title: "Mortgage Payment Breakdown",
        }}
        next={{
          href: "/guide/set-your-freelancer-rate-right",
          title: "Set Your Freelancer Rate Right",
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}

/** Local helper components (kept for look & feel parity with other guides) */
export function NavText({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-sm">{children}</p>;
}

export function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
      {children}
    </h1>
  );
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
