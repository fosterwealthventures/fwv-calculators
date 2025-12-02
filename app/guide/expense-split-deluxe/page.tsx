import Link from "next/link";
import { OpenCalculatorButton, RelatedSection, RelatedLink } from "@/components/GuideLinks";
import { NavText, H1, H2, Quote, Section, CTAWrap, HelperText } from "@/components/GuideTypography";
import { CALC_TIERS } from "@/lib/calc-tiers";

export const metadata = {
  title: "Advanced Expense Split Calculator Guide: Weights, Caps & Shares",
  description:
    "Split shared bills fairly using percentages, weights, and custom rules.",
};

export default function ExpenseSplitDeluxeGuide() {
  return (
    <main>
      <NavText>
        <Link href="/guide" className="underline hover:no-underline">
          ← Back to Guides
        </Link>
      </NavText>

      <H1>Advanced Expense Split Calculator Guide: Weights, Caps & Shares</H1>

      <Quote variant="paid">
        "Each of you should give what you have decided in your heart to give…" <span className="font-semibold">2 Corinthians 9:7</span>
      </Quote>

      <Section>
        <div>
          <H2>What it does</H2>
          <p>
            Splits expenses among people by fixed shares, weights (e.g., usage),
            or percentages; supports exclusions and caps.
          </p>
        </div>

        <div>
          <H2>How to use it</H2>
          <ul className="list-disc pl-6">
            <li>Add participants and optional weights or % shares.</li>
            <li>Enter each bill and choose split method.</li>
            <li>Review per-person totals and adjustments.</li>
          </ul>
        </div>

        <div>
          <H2>Tips</H2>
          <p>
            Use weights for usage-based fairness (e.g., room size or miles
            driven). Export/print the breakdown for records.
          </p>
        </div>
      </Section>

      <CTAWrap>
        <OpenCalculatorButton
          slug="expense-split-deluxe"
          tier={(CALC_TIERS as any)["expense_split"]}
          className="mt-2"
        />
        <HelperText>
          Pro/Premium may be required depending on your pro-choice gate.
        </HelperText>
      </CTAWrap>

      <RelatedSection title="Related Guides">
        <RelatedLink href="/guide/employee-cost">Employee Cost</RelatedLink>
        <RelatedLink href="/guide/break-even">Break-Even</RelatedLink>
        <RelatedLink href="/guide/savings-growth">Savings Growth</RelatedLink>
      </RelatedSection>
    </main>
  );
}
