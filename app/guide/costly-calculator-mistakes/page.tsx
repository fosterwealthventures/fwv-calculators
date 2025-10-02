import type { Metadata } from "next";
import Link from "next/link";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";

export const metadata: Metadata = {
  title: "5 Costly Calculator Mistakes",
  description:
    "Avoid the most common mistakes that lead to wrong answers: time frames, fees/taxes, compounding, averages vs. margins, and rounding assumptions.",
};

function Breadcrumb() {
  return (
    <nav className="mb-4 text-sm text-gray-600">
      <Link href="/" className="text-brand-green hover:underline">Home</Link>{" "}
      ›{" "}
      <Link href="/guide" className="text-brand-green hover:underline">
        Guides
      </Link>{" "}
      › <span>5 Costly Calculator Mistakes</span>
    </nav>
  );
}

export default function GuidePage() {
  const pageUrl =
    "https://www.fosterwealthventures.com/guide/costly-calculator-mistakes";

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />

      <GuideHero
        title="5 Costly Calculator Mistakes"
        subtitle="Real-world errors that skew results — and simple fixes so your answers match reality."
        minTier="free"
      />

      <p className="mt-3 text-sm text-gray-600">Estimated reading time: 3–4 minutes</p>

      <section>
        <h2>Quick Summary</h2>
        <p>
          Most bad outputs come from a few repeat offenders: mismatched time
          frames, ignoring fees/taxes, mixing APR with APY, using averages
          when you need margins, and rounding/omitting details that matter.
          Fix those and your calculations line up with the bank statement.
        </p>
      </section>

      <section>
        <div className="not-prose flex flex-wrap gap-3">
          <CTAButton href="/?calc=roi">👉 Try ROI</CTAButton>
          <CTAButton href="/?calc=interest">👉 Try Interest</CTAButton>
        </div>
      </section>

      <section>
        <h2>Mistake #1 — Comparing different time frames</h2>
        <p>
          A 10% gain over 3 months is not directly comparable to 10% over 3 years.
          Using total ROI alone makes short periods look artificially attractive.
        </p>
        <p>
          <strong>Fix:</strong> convert to a common basis (per year). Use{" "}
          <em>Annualized ROI</em> for investments, or make sure all inputs share the
          same units (months vs. years) before comparing.
        </p>
        <p className="text-sm text-gray-600">
          Example: ROI 15% in 2 years → Annualized ≈ (1.15)^(1/2) − 1 ≈ 7.25%/yr.
        </p>
      </section>

      <section>
        <h2>Mistake #2 — Ignoring fees and taxes</h2>
        <p>
          Commissions, closing costs, PMI, card fees, or capital-gains taxes can
          flip a “great” result into just okay.
        </p>
        <p>
          <strong>Fix:</strong> include one-time and recurring fees in your inputs.
          For taxes, model a realistic rate so you’re not surprised later.
        </p>
        <ul>
          <li>Mortgage: taxes/insurance/PMI belong in the payment picture.</li>
          <li>Investing: use net proceeds (after fees) in ROI.</li>
        </ul>
      </section>

      <section>
        <h2>Mistake #3 — Mixing APR and APY (and compounding)</h2>
        <p>
          APR is the quoted yearly rate; APY includes compounding. Using APR in a
          compounding formula without setting the frequency (or vice versa) produces
          wrong growth/payoff numbers.
        </p>
        <p>
          <strong>Fix:</strong> match the calculator’s compounding to reality
          (annual, quarterly, monthly, daily) — or select “simple” when there’s
          no compounding.
        </p>
        <p className="text-sm text-gray-600">
          Example: $5,000 at 6% for 3 years → simple interest $900; yearly
          compounding ≈ $955 interest.
        </p>
      </section>

      <section>
        <h2>Mistake #4 — Using averages when you need margins</h2>
        <p>
          Break-even and pricing rely on <em>contribution margin</em>, not average
          revenue. Mixing products without weighting, or using “average cost” when
          variable cost per unit is what matters, shifts break-even incorrectly.
        </p>
        <p>
          <strong>Fix:</strong> use <em>Price − Variable Cost</em> for margin per unit
          and weight by mix. Keep fixed costs separate.
        </p>
        <p className="text-sm text-gray-600">
          Example: BE Units = Fixed Costs ÷ (Price − Variable Cost).
        </p>
      </section>

      <section>
        <h2>Mistake #5 — Rounding and omissions that snowball</h2>
        <p>
          Trimming cents, leaving out small monthly costs, or forgetting an occasional
          fee can be fine once — but across 360 payments or 12 months it becomes
          real money.
        </p>
        <p>
          <strong>Fix:</strong> enter exact values; use rounding <em>after</em> you
          review totals. Add recurring costs in their native frequency and let the
          calculator convert.
        </p>
      </section>

      <section>
        <h2>Mini Checklist</h2>
        <ul>
          <li>Are all time inputs in the same units (months vs. years)?</li>
          <li>Did you include one-time and recurring fees/taxes?</li>
          <li>Does compounding frequency match the product?</li>
          <li>For pricing/BE: did you use <em>variable</em> cost, not average?</li>
          <li>Any rounding/edge cases that need a sanity check?</li>
        </ul>
      </section>

      <section>
        <h2>Try it the right way</h2>
        <div className="not-prose flex flex-wrap gap-3">
          <CTAButton href="/?calc=break-even">Break-Even</CTAButton>
          <CTAButton href="/?calc=interest">Simple vs. Compound</CTAButton>
          <CTAButton href="/?calc=roi">ROI / Annualized ROI</CTAButton>
          <CTAButton href="/">All Calculators</CTAButton>
        </div>
      </section>

      <section>
        <h2>Related Guides</h2>
        <ul>
          <li><Link href="/guide/break-even-made-simple">Break-Even Made Simple</Link></li>
          <li><Link href="/guide/roi-vs-annualized-roi">ROI vs Annualized ROI</Link></li>
          <li><Link href="/guide/simple-vs-compound-interest">Simple vs Compound Interest</Link></li>
        </ul>
      </section>

      <div className="not-prose mt-6">
        <SocialShare url={pageUrl} title="5 Costly Calculator Mistakes" />
      </div>

      <GuideNav
        prev={{ href: "/guide/simple-vs-compound-interest", title: "Simple vs Compound Interest" }}
        next={{ href: "/guide/break-even-made-simple", title: "Break-Even Made Simple" }}
      />
    </main>
  );
}
