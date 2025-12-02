import type { Metadata } from "next";
import Link from "next/link";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";

export const metadata: Metadata = {
  title: "Freelance Rate Calculator Guide: How to Price Your Services",
  description:
    "Learn how to calculate the right hourly and project rates to meet income goals and cover expenses as a freelancer.",
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
      &rsaquo; <span>Freelance Rate Calculator Guide: How to Price Your Services</span>
    </nav>
  );
}

export default function GuidePage() {
  const pageUrl =
    "https://fosterwealthventures.store/guide/set-your-freelance-rate-right";
  const shareTitle = String(metadata.title ?? "");

  // (Schemas retained if previously used)
  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />
      <GuideHero
        title="Freelance Rate Calculator Guide: How to Price Your Services"
        subtitle="A concise walkthrough with examples, pitfalls, and the matching calculator."
        icon={null}
      />
      <p className="mt-3 text-sm text-gray-600">Estimated reading time: 2 minutes</p>

      {/* (ad moved lower to avoid spacing under title) */}

      <section>
        <h2>What it does</h2>
        <p>
          Turns your income goal, weeks off, billable hours, and overhead into a minimum hourly rate. Prevents the common error of dividing income by 2,000 hours.
        </p>
      </section>

      {/* In-content ad removed; footer banner handles ads */}

      <section>
        <h2>How to use it</h2>
        <p>Fill four inputs, then tweak:</p>
        <ul>
          <li>Target income (before personal taxes)</li>
          <li>Weeks off for vacation, holidays, sick</li>
          <li>Billable hours per week (real client time)</li>
          <li>Overhead % (software, insurance, gear, marketing)</li>
          <li>Example: 90000 goal, 4 weeks off, 25 hrs, 30% → higher rate than you guess</li>
        </ul>
      </section>

      <section>
        <h2>When to use it</h2>
        <p>
          Use before quoting a new client or bidding a project. Helpful when raising rates or planning a shift to fewer hours.
        </p>
      </section>

      <section>
        <h2>Interpreting results</h2>
        <p>
          The rate shown is a floor, not a cap. If it feels too high, adjust overhead, add realistic billable time, or lower income target; if demand is strong, quote above it for rush or complex work.
        </p>
        <CTAButton href="/?calc=freelancer-rate">
          Open the calculator (Freelancer Rate)
        </CTAButton>
      </section>

      <section>
        <h2>Related Guides</h2>
        <p>
          See cost structure in{" "}
          <Link href="/guide/break-even-made-simple">Break-Even Made Simple</Link>, improve fairness in{" "}
          <Link href="/guide/restaurant-tips-tabs-split">Restaurant Tip & Tab Split</Link>, or browse every tool on the{" "}
          <Link href="/dashboard">calculator dashboard</Link>.
        </p>
      </section>

      <div className="mt-6 not-prose">
        <SocialShare url={pageUrl} title={shareTitle} />
      </div>

      <GuideNav
        prev={{
          href: "/guide/simple-vs-compound-interest",
          title: "Compound Interest Calculator Guide: Simple vs. Compound",
        }}
        next={{
          href: "/guide/5-costly-calculator-mistakes",
          title: "5 Costly Calculator Mistakes",
        }}
      />
    </main>
  );
}

import React from 'react';

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
