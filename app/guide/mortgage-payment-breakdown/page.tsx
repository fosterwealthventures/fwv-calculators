import type { Metadata } from "next";
import Link from "next/link";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";

export const metadata: Metadata = {
  title: "Mortgage Payment Breakdown — Guide",
  description:
    "Understand P&I, taxes, insurance, and PMI. See how rate, term, and down payment shape your monthly payment.",
};

function Breadcrumb() {
  return (
    <nav className="mb-4 text-sm text-gray-600">
      <Link href="/" className="text-brand-green hover:underline">Home</Link> ›{" "}
      <Link href="/guide" className="text-brand-green hover:underline">Guides</Link> ›{" "}
      <span>Mortgage Payment Breakdown</span>
    </nav>
  );
}

export default function GuidePage() {
  const pageUrl =
    "https://www.fosterwealthventures.com/guide/mortgage-payment-breakdown";

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />

      <GuideHero
        title="Mortgage Payment Breakdown"
        subtitle="Decode P&I, taxes, insurance, PMI—and how rate, term, and down payment move your payment."
        minTier="free"
      />

      <p className="mt-3 text-sm text-gray-600">Estimated reading time: 3–4 minutes</p>

      <section>
        <h2>Quick Summary</h2>
        <p>
          Most mortgages are quoted as <strong>PITI</strong>:
          <em> Principal &amp; Interest</em> + <em>Taxes</em> + <em>Insurance</em> (+ PMI if &lt;20% down).
        </p>
      </section>

      <section>
        <CTAButton href="/?calc=mortgage">👉 Try the matching calculator</CTAButton>
      </section>

      <section>
        <h2>Inputs</h2>
        <ul>
          <li><strong>Home Price</strong> and <strong>Down Payment</strong>.</li>
          <li><strong>Loan Term</strong> (years) and <strong>Interest Rate</strong>.</li>
          <li><strong>Property Tax Rate</strong> (or yearly tax).</li>
          <li><strong>Homeowners Insurance</strong> estimate (annual).</li>
          <li><strong>PMI</strong> if down payment &lt; 20% (stops once LTV drops below threshold).</li>
        </ul>
      </section>

      <section>
        <h2>Outputs</h2>
        <ul>
          <li><strong>Monthly P&amp;I</strong> and full <strong>PITI</strong>.</li>
          <li><strong>Amortization schedule</strong> (interest vs. principal over time).</li>
          <li><strong>Total interest</strong> over loan life; payoff projections for extra principal.</li>
        </ul>
      </section>

      <section>
        <h2>Step-by-Step</h2>
        <ol>
          <li>Enter price, down payment (or %), rate, and term.</li>
          <li>Add property tax %, insurance, and any HOA/PMI.</li>
          <li>Review P&amp;I vs. taxes/insurance breakdown and the amortization chart.</li>
          <li>Experiment with extra principal or a shorter term to compare interest saved.</li>
        </ol>
      </section>

      <section>
        <h2>Example</h2>
        <p>
          Price $400k, 10% down, 30-yr fixed @ 6.25%. Estimated taxes 1.2%/yr, insurance $1,500/yr.
          The calculator shows monthly P&amp;I plus taxes/insurance/PMI and a detailed payoff schedule.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul>
          <li>Ignoring taxes/insurance when comparing “just rate”.</li>
          <li>Not budgeting for PMI when putting less than 20% down.</li>
          <li>Underestimating maintenance/HOA that still affect affordability.</li>
        </ul>
      </section>

      <section>
        <CTAButton href="/?calc=mortgage">👉 Open the calculator again</CTAButton>
      </section>

      <section>
        <h2>Related Guides</h2>
        <ul>
          <li><Link href="/guide/simple-vs-compound-interest">Simple vs Compound Interest</Link></li>
          <li><Link href="/guide/roi-vs-annualized-roi">ROI vs Annualized ROI</Link></li>
        </ul>
      </section>

      <div className="not-prose mt-6">
        <SocialShare url={pageUrl} title="Mortgage Payment Breakdown — Guide" />
      </div>

      <GuideNav
        prev={{ href: "/guide/break-even-made-simple", title: "Break-Even Made Simple" }}
        next={{ href: "/guide/simple-vs-compound-interest", title: "Simple vs Compound Interest" }}
      />
    </main>
  );
}
