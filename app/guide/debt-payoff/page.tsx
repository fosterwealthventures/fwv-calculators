import Link from "next/link";
import { OpenCalculatorButton, RelatedSection, RelatedLink } from "@/components/GuideLinks";
import { NavText, H1, H2, Quote, Section, CTAWrap, HelperText } from "@/components/GuideTypography";
import { CALC_TIERS } from "@/lib/calc-tiers";

export const metadata = {
  title: "Debt Planner (Snowball/Avalanche) — Guide | Foster Wealth Ventures",
  description:
    "Learn how to prioritize debts, pick snowball vs avalanche, and read your payoff timeline.",
};

export default function DebtPlannerGuide() {
  return (
    <main>
      <NavText>
        <Link href="/guide" className="underline hover:no-underline">
          ← Back to Guides
        </Link>
      </NavText>

      <H1>Debt Planner — Guide</H1>

      <Quote variant="paid">
        "Let no debt remain outstanding, except the continuing debt to love one another." <span className="font-semibold">Romans 13:8</span>
      </Quote>

      <Section>
        <div>
          <H2>What it does</H2>
          <p>
            Organizes your debts, applies Snowball (smallest balance first) or
            Avalanche (highest APR first), and projects the month you'll be
            debt-free based on your extra payment.
          </p>
        </div>

        <div id="how-to-use">
          <H2>How to use it</H2>
          <ul className="list-disc pl-6">
            <li>List each debt with balance, APR, and minimum payment.</li>
            <li>Choose Snowball or Avalanche.</li>
            <li>Enter your monthly extra payment (if any).</li>
            <li>Review the schedule and total interest saved.</li>
          </ul>
        </div>

        <div id="tips">
          <H2>Tips</H2>
          <p>
            Snowball gives faster wins; Avalanche saves the most interest.
            Increase extra payment even slightly to shave months off.
          </p>
        </div>
      </Section>

      <CTAWrap>
        <OpenCalculatorButton
          slug="debt"
          tier={(CALC_TIERS as any)["debt"]}
          className="mt-2"
        />
        <HelperText>
          If this is a paid calculator on your plan, you'll be routed to upgrade.
        </HelperText>
      </CTAWrap>

      <RelatedSection title="Related Guides">
        <RelatedLink href="/guide/savings-growth">Savings Growth</RelatedLink>
        <RelatedLink href="/guide/roi">ROI</RelatedLink>
        <RelatedLink href="/guide/break-even">Break-Even</RelatedLink>
      </RelatedSection>
    </main>
  );
}
