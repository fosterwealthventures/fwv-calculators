// app/guide/savings-growth/page.tsx
import Link from "next/link";
import { OpenCalculatorButton, RelatedSection, RelatedLink } from "@/components/GuideLinks";
import { NavText, H1, H2, Quote, Section, CTAWrap, HelperText } from "@/components/GuideTypography";
import { CALC_TIERS } from "@/lib/calc-tiers";

export const metadata = {
  title: "Savings Growth Calculator — Guide | Foster Wealth Ventures",
  description:
    "How compounding grows your money and how to use the Savings Growth calculator the smart way.",
};

export default function SavingsGrowthGuide() {
  return (
    <main>
      <NavText>
        <Link href="/guide" className="underline hover:no-underline">
          ← Back to Guides
        </Link>
      </NavText>

      <H1>Savings Growth — Guide</H1>

      <Quote variant="paid">
        "The plans of the diligent lead surely to abundance…" <span className="font-semibold">Proverbs 21:5</span>
      </Quote>

      <Section>
        <div>
          <H2>What it does</H2>
          <p>
            Projects your balance over time with contributions and compound
            interest. Test rates, contribution amounts, and frequency to see the
            long-term impact.
          </p>
        </div>

        <div>
          <H2>How to use it</H2>
          <ul className="list-disc pl-6">
            <li>Enter starting balance and monthly contribution</li>
            <li>Choose annual rate and years</li>
            <li>Toggle compound frequency if available</li>
            <li>Compare scenarios (e.g., +1% rate, +$50/month)</li>
          </ul>
        </div>

        <div>
          <H2>Reading results</H2>
          <p>
            Focus on final balance and total contributions. The gap between them
            is compound growth—your money working for you.
          </p>
        </div>
      </Section>

      <CTAWrap>
        <OpenCalculatorButton
          slug="savings"
          tier={(CALC_TIERS as any)["savings"]}
          className="mt-2"
        />
        <HelperText>
          If this calculator is gated on your plan, you'll be routed to upgrade.
        </HelperText>
      </CTAWrap>

      <RelatedSection title="Related Guides">
        <RelatedLink href="/guide/debt-payoff">Debt Payoff</RelatedLink>
        <RelatedLink href="/guide/mortgage-payment-breakdown">Mortgage Payment</RelatedLink>
        <RelatedLink href="/guide/roi-vs-annualized-roi">ROI</RelatedLink>
      </RelatedSection>
    </main>
  );
}
