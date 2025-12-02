import GuideNav from "@/components/GuideNav";
import { CTAButton, GuideHero, SocialShare } from "@/components/GuideParts";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Break-Even Calculator Guide: How to Find Your Break-Even Point",
  description: "Understand break-even analysis and how to calculate the units needed to cover costs and reach profitability.",
};

function Breadcrumb() {
  return (
    <nav className="mb-4 text-sm text-gray-600">
      <Link href="/" className="text-brand-green hover:underline">
        Home
      </Link>{" "}
      &rsaquo;{" "}
      <Link href="/guide" className="text-brand-green hover:underline">
        Guides
      </Link>{" "}
      &rsaquo; <span>Break-Even Calculator Guide: How to Find Your Break-Even Point</span>
    </nav>
  );
}

export default function GuidePage() {
  const pageUrl = "https://fosterwealthventures.store/guide/break-even-made-simple";

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />

      <GuideHero
        title="Break-Even Calculator Guide: How to Find Your Break-Even Point"
        subtitle="A concise walkthrough with examples, pitfalls, and the matching calculator."
        icon={null}
      />

      <p className="mt-3 text-sm text-gray-600">Estimated reading time: 3-4 minutes</p>

      <section>
        <h2>What it does</h2>
        <p>
          The break-even calculator tells how many units you must sell before revenue covers fixed and variable costs. It now also shows break-even revenue, contribution margin ($ and %), units/revenue to hit a profit target, safety margin vs your current sales, and rough time-to-break-even when you enter expected monthly units.
        </p>
      </section>

      <section>
        <h2>How to use it</h2>
        <p>Enter the core three numbers, then add optional fields for more insight.</p>
        <ul>
          <li>Fixed Costs (rent, salaries, etc.)</li>
          <li>Variable Cost per Unit (materials, fees)</li>
          <li>Price per Unit</li>
          <li>Target Profit (optional) - see how many units/revenue you need to hit that goal.</li>
          <li>Current Sales (units, optional) - shows safety margin vs break-even.</li>
          <li>Expected Monthly Units (optional) - shows approximate months to break-even.</li>
        </ul>
      </section>

      <section>
        <h2>When to use it</h2>
        <p>
          Use it to test pricing, cost cuts, or new product ideas before committing. Helpful when deciding if planned volume can cover startup spend or when setting minimum viable sales for a launch.
        </p>
      </section>

      <section>
        <h2>Interpreting results</h2>
        <ul>
          <li>If price is near or below variable cost, raise price or reduce variable cost - break-even is impossible otherwise.</li>
          <li>Contribution margin ($ and %) tells you how much each unit contributes to covering fixed costs and profit.</li>
          <li>Target profit output gives you a clear "sell at least X units" goal.</li>
          <li>Safety margin shows how far above/below break-even you are at current sales.</li>
          <li>Months-to-break-even helps sanity-check your monthly volume assumptions.</li>
        </ul>
      </section>

      <section>
        <h2>Example</h2>
        <ul>
          <li>Fixed costs: $10,000/month</li>
          <li>Variable cost: $20/unit</li>
          <li>Price: $50/unit - Contribution margin: $30 (60%)</li>
          <li>Break-even: 334 units (about $16,700 revenue)</li>
          <li>Profit target $5,000: 500 units (about $25,000 revenue)</li>
          <li>Current sales 400 units - Safety margin ~17% above break-even</li>
          <li>Expected monthly units 150 - ~3 months to break-even</li>
        </ul>
      </section>

      <section>
        <h2>Pitfalls</h2>
        <ul>
          <li>Using overly optimistic monthly units - time-to-break-even will be wrong.</li>
          <li>Ignoring variable costs (discounts, payment fees, shipping) when pricing.</li>
          <li>Counting sunk costs�stick to relevant fixed costs for the time period.</li>
        </ul>
      </section>

      <section>
        <CTAButton href="/calculators/break-even" data-testid="try-matching-calc">
          Open the Break-Even Calculator
        </CTAButton>
      </section>

      <section>
        <h2>Related Guides</h2>
        <p>
          Continue learning with{" "}
          <Link href="/guide/roi-vs-annualized-roi">ROI vs Annualized ROI</Link>{" "}
          and dive into loan affordability in{" "}
          <Link href="/guide/mortgage-payment-breakdown">Mortgage Payment Breakdown</Link>. You can also explore every tool on the{" "}
          <Link href="/dashboard">calculator dashboard</Link>.
        </p>
      </section>

      <div className="mt-6 not-prose">
        <SocialShare url={pageUrl} title={String(metadata.title ?? "")} />
      </div>

      <GuideNav
        prev={{
          href: "/guide/roi-vs-annualized-roi",
          title: "ROI Calculator Guide: How to Calculate Return on Investment",
        }}
        next={{
          href: "/guide/mortgage-payment-breakdown",
          title: "Mortgage Payment Calculator Guide: Understand Your Monthly Payment",
        }}
      />
    </main>
  );
}
