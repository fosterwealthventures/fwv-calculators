import type { Metadata } from "next";
import Link from "next/link";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";
import React from "react";

export const metadata: Metadata = {
  title:
    "Break-Even Made Simple—Use Our Calculator to Master Costs & Profit Margins",
  description:
    "Understand break-even analysis and how to calculate the units needed to cover costs and reach profitability.",
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
      &rsaquo; <span>Break-Even Made Simple</span>
    </nav>
  );
}

export default function GuidePage() {
  const pageUrl =
    "https://fosterwealthventures.store/guide/break-even-made-simple";

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />

      <GuideHero
        title="Break-Even Made Simple"
        subtitle="A concise walkthrough with examples, pitfalls, and the matching calculator."
        icon={null}
      />

      <p className="mt-3 text-sm text-gray-600">
        Estimated reading time: 3–4 minutes
      </p>

      <section>
        <h2>What it does</h2>
        <p>
          The break-even calculator tells how many units you must sell before
          revenue covers fixed and variable costs. After that point each sale adds
          margin. It uses fixed costs divided by contribution per unit (price
          minus variable cost) to find the threshold.
        </p>
      </section>

      <section>
        <h2>How to use it</h2>
        <p>Enter three numbers; result appears instantly.</p>
        <ul>
          <li>Fixed Costs (rent, salaries, etc.)</li>
          <li>Variable Cost per Unit (materials, fees)</li>
          <li>Price per Unit</li>
          <li>
            Example: 5000 fixed, 20 variable, 50 price → about 167 units.
          </li>
        </ul>
      </section>

      <section>
        <h2>When to use it</h2>
        <p>
          Use it to test pricing, cost cuts, or new product ideas before
          committing. Helpful when deciding if planned volume can cover startup
          spend.
        </p>
      </section>

      <section>
        <h2>Interpreting results</h2>
        <p>
          Lower break-even means less risk; reach it sooner or adjust assumptions.
          If price is at or below variable cost you cannot break even—raise price
          or reduce cost.
        </p>
      </section>
      <section>
        <CTAButton href="/?calc=break-even" data-testid="try-matching-calc">
          Open the Break-Even Calculator
        </CTAButton>
      </section>

      <section>
        <h2>Related Guides</h2>
        <p>
          Continue learning with{" "}
          <Link href="/guide/roi-vs-annualized-roi">ROI vs Annualized ROI</Link>{" "}
          and dive into loan affordability in{" "}
          <Link href="/guide/mortgage-payment-breakdown">
            Mortgage Payment Breakdown
          </Link>
          . You can also explore every tool on the{" "}
          <Link href="/dashboard">calculator dashboard</Link>.
        </p>
      </section>

      <div className="mt-6 not-prose">
        <SocialShare url={pageUrl} title={String(metadata.title ?? "")} />
      </div>

      <GuideNav
        prev={{
          href: "/guide/roi-vs-annualized-roi",
          title: "ROI vs Annualized ROI",
        }}
        next={{
          href: "/guide/mortgage-payment-breakdown",
          title: "Mortgage Payment Breakdown",
        }}
      />

      {/* JSON-LD scripts (if previously present) remain unchanged */}
    </main>
  );
}

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
