import type { Metadata } from "next";
import Link from "next/link";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";

export const metadata: Metadata = {
  title: "Break-Even Made Simple — Guide",
  description:
    "Understand break-even analysis and how to calculate the units or revenue needed to cover costs and reach profitability.",
};

function Breadcrumb() {
  return (
    <nav className="mb-4 text-sm text-gray-600">
      <Link href="/" className="text-brand-green hover:underline">Home</Link> ›{" "}
      <Link href="/guide" className="text-brand-green hover:underline">Guides</Link> ›{" "}
      <span>Break-Even Made Simple</span>
    </nav>
  );
}

export default function GuidePage() {
  const pageUrl =
    "https://www.fosterwealthventures.com/guide/break-even-made-simple";

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />

      <GuideHero
        title="Break-Even Made Simple"
        subtitle="Learn exactly how many units (or how much revenue) you need to stop losing money and start making it."
        minTier="free"
      />

      <p className="mt-3 text-sm text-gray-600">Estimated reading time: 3–4 minutes</p>

      <section>
        <h2>Quick Summary</h2>
        <p>
          Break-even is where <strong>total revenue = total costs</strong>. Use it to set
          prices, goals, and budgets.
        </p>
        <ul>
          <li>
            <strong>BE Units</strong> = Fixed Costs ÷ (Price per Unit − Variable Cost per Unit)
          </li>
          <li>
            <strong>BE Revenue</strong> = Fixed Costs ÷ Contribution Margin Ratio
            (where CMR = (Price − Variable Cost) ÷ Price)
          </li>
        </ul>
      </section>

      <section>
        <CTAButton href="/calculators?calc=break-even">👉 Try the matching calculator</CTAButton>
      </section>

      <section>
        <h2>Inputs (what you’ll enter)</h2>
        <ul>
          <li><strong>Price per Unit</strong> — your selling price.</li>
          <li><strong>Variable Cost per Unit</strong> — costs that scale with each unit (materials, shipping, fees).</li>
          <li><strong>Fixed Costs</strong> — expenses that don’t change with volume (rent, salaries, software).</li>
          <li className="text-gray-600">
            Optional: <em>Target Profit</em>, tax rate, or multiple products with weighted margins.
          </li>
        </ul>
      </section>

      <section>
        <h2>Outputs (what you’ll get)</h2>
        <ul>
          <li><strong>Break-even units</strong> and <strong>break-even revenue</strong>.</li>
          <li><strong>Contribution margin</strong> (per unit and ratio).</li>
          <li><strong>Margin of safety</strong> — your cushion above break-even.</li>
          <li>Scenario tweaks — see how price, costs, or goals change results.</li>
        </ul>
      </section>

      <section>
        <h2>Step-by-Step</h2>
        <ol>
          <li>Enter price, variable cost per unit, and total fixed costs.</li>
          <li>Optionally add a target profit to see units <em>to hit the goal</em>.</li>
          <li>Read the calculator’s break-even units/revenue and margin diagnostics.</li>
          <li>Adjust price/costs to explore faster paths to profit.</li>
        </ol>
      </section>

      <section>
        <h2>Example</h2>
        <p>
          Price = $50, Variable = $30, Fixed = $20,000.
          CM per unit = $20.
          Break-even units = 20,000 ÷ 20 = <strong>1,000 units</strong>.
          CMR = 20 ÷ 50 = 0.40 → Break-even revenue = 20,000 ÷ 0.40 = <strong>$50,000</strong>.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul>
          <li>Using averages that hide product mix differences.</li>
          <li>Forgetting fees, discounts, returns, or shrinkage.</li>
          <li>Assuming 100% of fixed costs are productive (include downtime, seasonality).</li>
        </ul>
      </section>

      <section>
        <CTAButton href="/calculators?calc=break-even">👉 Open the calculator again</CTAButton>
      </section>

      <section>
        <h2>Related Guides</h2>
        <ul>
          <li><Link href="/guide/roi-vs-annualized-roi">ROI vs Annualized ROI</Link></li>
          <li><Link href="/guide/mortgage-payment-breakdown">Mortgage Payment Breakdown</Link></li>
        </ul>
      </section>

      <div className="not-prose mt-6">
        <SocialShare url={pageUrl} title="Break-Even Made Simple — Guide" />
      </div>

      <GuideNav
        prev={{ href: "/guide/roi-vs-annualized-roi", title: "ROI vs Annualized ROI" }}
        next={{ href: "/guide/mortgage-payment-breakdown", title: "Mortgage Payment Breakdown" }}
      />
    </main>
  );
}
