import type { Metadata } from "next";
import Link from "next/link";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";
import React from "react";

export const metadata: Metadata = {
  title:
    "Simple vs Compound Interest—Which One Grows Your Money Faster? Try Our Calculator",
  description:
    "Compare simple and compound interest to see which method accelerates your savings growth.",
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
      "Simple vs Compound Interest—Which One Grows Your Money Faster? Try Our Calculator",
    description:
      "Compare simple and compound interest to see which method accelerates your savings growth.",
    mainEntityOfPage: pageUrl,
    dateModified: "2025-09-20T21:27:38Z",
    publisher: { "@type": "Organization", name: "Foster Wealth Ventures" },
  };

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />

      <GuideHero
        title="Simple vs Compound Interest"
        subtitle="A clear comparison of two growth methods and how to test them."
        icon={null}
      />

      <p className="mt-3 text-sm text-gray-600">
        Estimated reading time: 2 minutes
      </p>

      {/* Concise, scannable rewrite */}
      <section>
        <h2>What it does</h2>
        <p>
          Shows side-by-side growth using simple interest (no reinvest) and
          compound interest (earn on prior growth). Example: 10,000 at 5% for 10
          years; compound ends higher because each year builds.
        </p>
      </section>

      <section>
        <h2>How to use it</h2>
        <p>Enter four inputs, then compare.</p>
        <ul>
          <li>Principal (starting amount)</li>
          <li>Annual rate %</li>
          <li>Years</li>
          <li>Compounds per year (1, 4, 12, etc.)</li>
          <li>Toggle Simple vs Compound</li>
          <li>Adjust rate or years to test scenarios</li>
        </ul>
        <p>
          Switch modes to see how reinvesting changes the curve.
        </p>
      </section>

      <section>
        <h2>When to use it</h2>
        <p>
          Use when weighing accounts, savings plans, or start dates. It helps
          decide where to park cash and how early to begin, especially for long
          goals like college or retirement.
        </p>
      </section>

      <section>
        <h2>Interpreting results</h2>
        <p>
          Final balance shows end value; interest earned shows growth portion.
          Bigger gap over longer years or higher frequency means compounding
          working harder; if numbers feel low, extend time or raise
          contributions.
        </p>
      </section>

      <section>
        <CTAButton href="/?calc=interest">
          Open the calculator (Simple vs Compound Interest)
        </CTAButton>
      </section>

      <section>
        <h2>Related Guides</h2>
        <p>
          Explore more with{" "}
          <Link href="/guide/set-freelance-rate-right">
            Set Your Freelancer Rate Right
          </Link>{" "}
          and fair bill sharing in{" "}
          <Link href="/guide/restaurant-tips-tabs-split">
            Restaurant Tip & Tab Split
          </Link>
          . You can also browse every tool on the{" "}
          <Link href="/dashboard">calculator dashboard</Link>.
        </p>
      </section>

      <div className="not-prose mt-6">
        <SocialShare
          url={pageUrl}
          title="Simple vs Compound Interest—Which One Grows Your Money Faster? Try Our Calculator"
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
