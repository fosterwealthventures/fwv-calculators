// app/guide/mortgage/page.tsx
import Link from "next/link";
import { OpenCalculatorButton, RelatedLinks } from "@/components/GuideLinks";
import { CALC_TIERS } from "@/lib/calc-tiers";
import React from 'react';
import { redirect } from 'next/navigation';

export const metadata = {
  title: "Mortgage Payment Calculator — Guide | Foster Wealth Ventures",
  description:
    "Understand principal, interest, taxes, and insurance (PITI) and how rate, term, and down payment change your monthly.",
};

export default function MortgageGuide() {
  return (
    <main>
      <nav className="mb-4 text-sm">
        <Link href="/guide" className="underline hover:no-underline">
          ← Back to Guides
        </Link>
      </nav>

      <H1>
        Mortgage Payment — Guide
      </H1>

      <Quote>
        <QuoteRef>Proverbs 24:27 —</QuoteRef> “Prepare your work outside; get
        everything ready…”
      </Quote>

      <Section>
        <div>
          <H2>What it does</H2>
          <p>
            Breaks your payment into principal &amp; interest and optional
            taxes/insurance. Compare PI vs PITI and see how term, rate, and down
            payment shift affordability.
          </p>
        </div>

        <div>
          <H2>Key inputs</H2>
          <List>
            <li>Home price, down payment, loan term, interest rate</li>
            <li>Property tax %, homeowners insurance, HOA (optional)</li>
          </List>
        </div>

        <div>
          <H2>Tips</H2>
          <p>
            Longer term lowers payment but increases total interest. Try rate
            and down-payment scenarios to find your comfort zone.
          </p>
        </div>
      </Section>

      <CTAWrap>
        <OpenCalculatorButton
          slug="mortgage"                     // calculator slug
          tier={CALC_TIERS["mortgage"]}      // tier key in your map
          className="mt-2"
        />
        <HelperText>
          Free calculator unless your plan gates it.
        </HelperText>
      </CTAWrap>

      <aside className="mt-10">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide">
          Related Guides
        </h3>
        <RelatedLinks
          className="space-y-1"
          items={[
            { slug: "break-even", title: "Break-Even" },
            { slug: "savings-growth", title: "Savings Growth" },
            { slug: "roi", title: "ROI" },
          ]}
        />
      </aside>
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

export function MortgagePaymentBreakdownRedirect() {
  redirect('/guide/mortgage');
}
