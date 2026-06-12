// app/guide/mortgage/page.tsx
import Link from "next/link";
import { OpenCalculatorButton, RelatedLinks } from "@/components/GuideLinks";
import { CALC_TIERS } from "@/lib/calc-tiers";
import React from 'react';
import { redirect } from 'next/navigation';

export const metadata = {
  title: "Mortgage Payment Calculator Guide | Calculate Your Monthly Mortgage Payment",
  description:
    "Use the monthly mortgage payment calculator to see principal & interest plus taxes, insurance, PMI, and HOA. Learn how each input changes your payment with step-by-step instructions and examples.",
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
        Mortgage Payment Calculator Guide: Calculate Your Monthly Mortgage Payment
      </H1>

      <Quote>
        <QuoteRef>Proverbs 24:27 —</QuoteRef> “Prepare your work outside; get
        everything ready…”
      </Quote>

      <Section>
        <div>
          <H2>What the mortgage payment calculator does</H2>
          <p>
            It estimates your monthly mortgage payment by combining principal &amp; interest with the common add-ons you enter: property taxes, homeowners insurance, PMI, and HOA dues. You get both the core P&amp;I and an estimated all-in payment so you know what to budget each month.
          </p>
        </div>

        <div>
          <H2>Inputs you can control</H2>
          <List>
            <li>Home price and down payment (or loan amount)</li>
            <li>Interest rate (annual) and loan term (years)</li>
            <li>Property tax (annual or monthly)</li>
            <li>Homeowners insurance (annual or monthly)</li>
            <li>PMI (annual or monthly, if applicable)</li>
            <li>HOA dues (monthly)</li>
          </List>
        </div>

        <div>
          <H2>How to use the calculator (step by step)</H2>
          <List>
            <li>Enter the home price and down payment; or enter the loan amount directly.</li>
            <li>Select the loan term (e.g., 30 years) and interest rate (e.g., 6.5%).</li>
            <li>Add property tax and homeowners insurance (toggle annual/monthly to match your statements).</li>
            <li>If you expect PMI, enter the annual PMI amount (toggle annual/monthly as needed).</li>
            <li>Add monthly HOA dues if your property has them.</li>
            <li>Review the outputs: core principal &amp; interest and the estimated total monthly payment (P&amp;I + taxes + insurance + PMI + HOA).</li>
          </List>
        </div>

        <div>
          <H2>Examples (realistic scenarios)</H2>
          <p><strong>Example 1:</strong> $300,000 home, 20% down ($60,000), 30-year term, 6.5% rate, taxes $3,600/yr, insurance $1,200/yr, no PMI, HOA $0.</p>
          <List>
            <li>Loan amount: $240,000</li>
            <li>Principal &amp; interest: ~$1,518/month</li>
            <li>Taxes: ~$300/month; Insurance: ~$100/month</li>
            <li>Estimated total payment: ~$1,918/month</li>
          </List>
          <p><strong>Example 2:</strong> $450,000 home, 10% down ($45,000), 30-year term, 6.75% rate, taxes $5,400/yr, insurance $1,500/yr, PMI $1,800/yr, HOA $85/month.</p>
          <List>
            <li>Loan amount: $405,000</li>
            <li>Principal &amp; interest: ~$2,629/month</li>
            <li>Taxes: ~$450/month; Insurance: ~$125/month; PMI: ~$150/month; HOA: $85/month</li>
            <li>Estimated total payment: ~$3,439/month</li>
          </List>
          <p className="text-sm text-gray-600">These figures are illustrative; enter your own numbers for precise estimates.</p>
        </div>

        <div>
          <H2>Tips to sanity-check results</H2>
          <List>
            <li>Toggle annual vs monthly for taxes/insurance/PMI to match your statements.</li>
            <li>Raising the down payment often removes PMI and lowers both P&amp;I and total payment.</li>
            <li>Longer terms lower the monthly payment but increase total interest paid.</li>
            <li>If HOA applies, include it—small dues add up across the year.</li>
          </List>
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
