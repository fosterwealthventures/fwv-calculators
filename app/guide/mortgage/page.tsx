import Link from "next/link";
import { OpenCalculatorButton, RelatedSection, RelatedLink } from "@/components/GuideLinks";
import { CALC_TIERS } from "@/lib/calc-tiers";
import { NavText, H1, Quote, QuoteRef, Section, H2, List, CTAWrap, HelperText } from "@/components/GuideTypography";

export const metadata = {
  title: "Mortgage Payment Calculator — Guide | Foster Wealth Ventures",
  description:
    "Understand principal, interest, taxes, and insurance (PITI) and how rate, term, and down payment change your monthly.",
};

export default function MortgageGuide() {
  return (
    <main>
      <NavText>
        <Link href="/guide" className="underline hover:no-underline">
          ← Back to Guides
        </Link>
      </NavText>

      <H1>Mortgage Payment — Guide</H1>

      <Quote>
        "Prepare your work outside; get everything ready…" <QuoteRef>Proverbs 24:27</QuoteRef>
      </Quote>

      <Section>
        <div>
          <H2>What it does</H2>
          <p>
            Breaks your payment into principal & interest and optional
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
          <H2>Payment breakdown</H2>
          <p>
            Your monthly payment has four main components (PITI):
          </p>
          <List>
            <li><strong>Principal:</strong> Pays down the loan balance</li>
            <li><strong>Interest:</strong> Cost of borrowing money</li>
            <li><strong>Taxes:</strong> Property taxes (if escrowed)</li>
            <li><strong>Insurance:</strong> Homeowners insurance (if escrowed)</li>
          </List>
        </div>

        <div>
          <H2>Tips</H2>
          <p>
            Longer term lowers payment but increases total interest. Try rate
            and down-payment scenarios to find your comfort zone. Lower rate or 
            larger down payment reduces the monthly payment.
          </p>
        </div>
      </Section>

      <CTAWrap>
        <OpenCalculatorButton
          slug="mortgage"
          tier={CALC_TIERS["mortgage"]}
          className="mt-2"
        />
        <HelperText>
          Free calculator. Try different terms and rates.
        </HelperText>
      </CTAWrap>

      <RelatedSection title="Related">
        <RelatedLink href="/guide/break-even">Break-Even Calculator</RelatedLink>
        <RelatedLink href="/guide/roi">ROI Calculator</RelatedLink>
        <RelatedLink href="/guide/savings-growth">Savings Growth</RelatedLink>
      </RelatedSection>
    </main>
  );
}