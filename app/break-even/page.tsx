import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";

export const metadata: Metadata = {
  title: "Free Break-even Calculator - FWV Calculators",
  description:
    "Find the break-even point fast. Enter fixed costs, variable cost per unit, and price to see units and revenue needed to cover costs.",
};

export default function BreakEvenLandingPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      {/* HERO */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Free Break-even Calculator</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Quickly see how many units or dollars you need to sell to cover costs and start making profit.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Link
            href="#calculator"
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
          >
            Find My Break-even
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700"
          >
            Browse All Calculators
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          No sign-up required. 100% free to use.
        </p>
      </section>

      {/* CALCULATOR */}
      <section
        id="calculator"
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-4"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-semibold">Try the Break-even Calculator</h2>
            <p className="text-gray-600">
              Input fixed costs, variable cost per unit, and price to see units and revenue to break even.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <FosterWealthCalculators freeOnly allowedCalcs={["break-even"]} />
        </div>
      </section>

      {/* EDUCATION */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How to use it</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Fixed costs:</strong> Monthly overhead like salaries, rent, and software.
          </li>
          <li>
            <strong>Variable cost per unit:</strong> What it costs to deliver one unit (COGS, fulfillment, ads).
          </li>
          <li>
            <strong>Price:</strong> Your selling price per unit or average order value.
          </li>
        </ul>
        <p className="text-gray-700">
          Adjust price or costs to see how many units you need to hit breakeven and how margin changes runway.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Popular uses</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Founders pressure-testing launch pricing before spending on ads.</li>
          <li>Product teams modeling margin impact of new features or bundles.</li>
          <li>Creators validating payback period on merch or courses.</li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Break-even FAQ</h2>

        <div className="space-y-3">
          <h3 className="font-semibold">What if my variable cost changes?</h3>
          <p className="text-gray-700">
            Re-run the calculator with the higher cost to see how many more units you need or where to raise price.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Does this include taxes?</h3>
          <p className="text-gray-700">
            This focuses on operating costs. Layer in taxes separately if you need an after-tax view.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Do I need an account?</h3>
          <p className="text-gray-700">
            No. It is free and runs instantly in your browser.
          </p>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="text-center space-y-3 pb-8">
        <p className="text-gray-700">Want more pricing and margin tools?</p>
        <Link
          href="/"
          className="inline-flex px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
        >
          Explore More FWV Calculators
        </Link>
      </section>

      {/* BOTTOM ADSTERRA BLOCK */}
      <section className="flex justify-center py-6">
        <Script
          src="//pl28080189.effectivegatecpm.com/449baf3ee6c092918f8d0ea54be7aa6e/invoke.js"
          async
          data-cfasync="false"
        />
        <div id="container-449baf3ee6c092918f8d0ea54be7aa6e" />
      </section>
    </main>
  );
}
