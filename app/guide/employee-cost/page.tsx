import Link from "next/link";
import { OpenCalculatorButton, RelatedSection, RelatedLink } from "@/components/GuideLinks";
import { NavText, H1, H2, Quote, Section, CTAWrap, HelperText } from "@/components/GuideTypography";
import { CALC_TIERS } from "@/lib/calc-tiers";

export const metadata = {
  title: "Employee Cost Calculator Guide: Total Cost per Employee",
  description:
    "See the true employer cost beyond salary—taxes, benefits, equipment, and overhead.",
};

export default function EmployeeCostGuide() {
  return (
    <main>
      <NavText>
        <Link href="/guide" className="underline hover:no-underline">
          ← Back to Guides
        </Link>
      </NavText>

      <H1>Employee Cost Calculator Guide: Total Cost per Employee</H1>

      <Quote variant="paid">
        "For which of you, desiring to build a tower, does not first sit down and count the cost…" <span className="font-semibold">Luke 14:28</span>
      </Quote>

      <Section>
        <div>
          <H2>What it does</H2>
          <p>
            Adds employer payroll taxes, benefits, equipment, software, and
            overhead to estimate true annual and monthly cost of a hire.
          </p>
        </div>

        <div>
          <H2>Key inputs</H2>
          <ul className="list-disc pl-6">
            <li>Salary (or hourly × hours)</li>
            <li>Employer taxes (%), benefits ($/%)</li>
            <li>Equipment &amp; software, training, overhead</li>
          </ul>
        </div>

        <div>
          <H2>Reading results</H2>
          <p>
            Compare total annual vs monthly cost; use it to budget and price
            your services correctly.
          </p>
        </div>
      </Section>

      <CTAWrap>
        <OpenCalculatorButton
          slug="employee-cost"
          tier={(CALC_TIERS as any)["employee_cost"]}
          className="mt-2"
        />
        <HelperText>
          Pro/Premium may be required for report downloads depending on your gate.
        </HelperText>
      </CTAWrap>

      <RelatedSection title="Related Guides">
        <RelatedLink href="/guide/expense-split-deluxe">Expense Split Deluxe</RelatedLink>
        <RelatedLink href="/guide/break-even">Break-Even</RelatedLink>
        <RelatedLink href="/guide/roi">ROI</RelatedLink>
      </RelatedSection>
    </main>
  );
}
