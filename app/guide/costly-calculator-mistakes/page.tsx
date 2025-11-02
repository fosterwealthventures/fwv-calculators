// app/guide/costly-calculator-mistakes/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

import GuideNav from "@/components/GuideNav";
import { SocialShare, OpenCalculatorButton } from "@/components/GuideParts";
import {
  NavText,
  H1,
  Section,
  H2,
  List,
  CTAWrap,
  HelperText,
} from "@/components/GuideTypography";
import { RelatedSection, RelatedLink } from "@/components/GuideLinks";

export const metadata: Metadata = {
  title: "5 Costly Calculator Mistakes (and How to Avoid Them)",
  description:
    "The five input traps that quietly ruin results—and the quick fixes. Standardize time bases, use the right units, include all costs, stress-test assumptions, and annualize for fair comparisons.",
};

function Breadcrumb() {
  return (
    <NavText>
      <Link href="/" className="text-brand-green hover:underline">Home</Link> &rsaquo;{" "}
      <Link href="/guide" className="text-brand-green hover:underline">Guides</Link> &rsaquo;{" "}
      <span>5 Costly Calculator Mistakes</span>
    </NavText>
  );
}

export default function CostlyCalculatorMistakesGuide() {
  const pageUrl =
    "https://fosterwealthventures.store/guide/costly-calculator-mistakes";
  const shareTitle = String(metadata.title ?? "");

  return (
    <main>
      {/* Navigation */}
      <Breadcrumb />

      {/* Page Title */}
      <H1>5 Costly Calculator Mistakes (and How to Avoid Them)</H1>

      {/* Read time */}
      <p className="mt-2 text-sm text-gray-600">Estimated reading time: 3–4 minutes</p>

      {/* Content */}
      <Section>
        <div>
          <H2>Mistake #1 — Mixing time bases (monthly vs yearly)</H2>
          <p>
            The most common error is entering revenue per year while expenses are
            per month (or vice-versa). The totals look “about right,” but the math
            is off by 12×. Mortgage, break-even, ROI, and employee cost
            calculations all suffer from this.
          </p>
          <p>
            <strong>Fix:</strong> Pick a single period for <em>all</em> inputs—either
            monthly or yearly—and convert everything to that base before running the
            numbers. Many fields list the expected period; when in doubt, convert
            explicitly.
          </p>
          <List>
            <li>Monthly ↔ Yearly: multiply or divide by 12.</li>
            <li>Weekly ↔ Monthly: multiply or divide by ~4.33.</li>
            <li>Daily ↔ Monthly: multiply or divide by 30 (or workdays used).</li>
          </List>
        </div>

        <div>
          <H2>Mistake #2 — Percent vs decimal (and per-period rates)</H2>
          <p>
            Entering <code>7</code> when a field expects <code>0.07</code>, or using an
            annual rate in a monthly column, skews interest, ROI, and discounting.
            Labels like APR/APY and “per period” are easy to skip when moving fast.
          </p>
          <p>
            <strong>Fix:</strong> Confirm whether a field expects a percentage or a
            decimal and the <em>rate period</em>. If a model is monthly, use the
            monthly rate (APR ÷ 12) unless it explicitly compounds differently.
          </p>
          <List>
            <li>Percent → decimal: divide by 100 (7% → 0.07).</li>
            <li>Annual → monthly rate: APR ÷ 12 (simple assumption).</li>
            <li>Check compounding notes if precision matters.</li>
          </List>
        </div>

        <div>
          <H2>Mistake #3 — Ignoring “small” costs and fees</H2>
          <p>
            Payment processor fees, employer taxes/benefits, sales tax, shipping,
            maintenance, and one-time setup costs look tiny alone but compound into
            real money. Leaving them out inflates margins and ROI.
          </p>
          <p>
            <strong>Fix:</strong> List every recurring and one-time cost, then add them
            to your model. For employee cost, include payroll taxes, benefits, and
            tools. For products, include freight, packaging, and returns. For SaaS,
            include tiers after growth.
          </p>
          <List>
            <li>Processors: % + fixed fee per transaction.</li>
            <li>Employer burden: taxes, healthcare, PTO.</li>
            <li>“Hidden” ops: shipping, chargebacks, refunds, support.</li>
          </List>
        </div>

        <div>
          <H2>Mistake #4 — No sensitivity or scenario testing</H2>
          <p>
            Using best-case inputs (perfect conversion, zero churn, stable prices)
            makes any plan look great. Real life wanders. If one assumption moves,
            your result might flip from profit to loss.
          </p>
          <p>
            <strong>Fix:</strong> Stress-test the top drivers. Re-run the model at
            −10% and +10–20% for the few inputs that move the outcome most (price,
            conversion, utilization, rate). Save scenarios—Best / Base / Worst—and
            decide with the full picture.
          </p>
        </div>

        <div>
          <H2>Mistake #5 — Comparing apples to oranges (no annualization)</H2>
          <p>
            A 6-month project with 8% total return can beat a 2-year project with
            12% total return once you account for time. Comparing <em>totals</em> only
            is misleading.
          </p>
          <p>
            <strong>Fix:</strong> Use <em>annualized ROI</em> (or NPV/IRR when relevant)
            to make durations comparable. When you must keep it simple, at least
            note the time horizon next to the result.
          </p>
        </div>

        <div>
          <H2>Quick walkthrough (5 steps)</H2>
          <List>
            <li>Pick a single time base (monthly or yearly) and convert all inputs.</li>
            <li>Confirm units (percent vs decimal) and rate period per field.</li>
            <li>Add every relevant cost: fees, taxes, shipping, benefits, one-time.</li>
            <li>Run Best / Base / Worst with ±10–20% on key drivers.</li>
            <li>Compare options using annualized ROI (or NPV/IRR) when durations differ.</li>
          </List>
        </div>
      </Section>

      {/* CTA */}
      <CTAWrap>
        <OpenCalculatorButton slug="roi" className="mt-2" />
        <HelperText>Free to use — open the ROI calculator and test your scenario.</HelperText>
      </CTAWrap>

      {/* Related */}
      <RelatedSection title="Related">
        <RelatedLink href="/guide/roi-vs-annualized-roi">ROI vs Annualized ROI</RelatedLink>
        <RelatedLink href="/guide/simple-vs-compound-interest" tag="Guide">
          Simple vs. Compound Interest
        </RelatedLink>
        <RelatedLink href="/guide/break-even-calculator">Break-Even Made Simple</RelatedLink>
      </RelatedSection>

      {/* Share */}
      <div className="mt-6">
        <SocialShare url={pageUrl} title={shareTitle} />
      </div>

      {/* Bottom nav */}
      <GuideNav
        prev={{ href: "/guide/restaurant-tips-tabs-split", title: "Restaurant Tips & Tabs Split" }}
        next={{ href: "/guide/mortgage", title: "Mortgage Calculator Guide" }}
      />
    </main>
  );
}
