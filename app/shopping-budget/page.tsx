import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";

export const metadata: Metadata = {
  title: "Free Shopping Budget Calculator - FWV Calculators",
  description:
    "Plan a shopping trip with clarity. Set your budget, categories, and must-haves to see what you can spend without overshooting.",
};

export default function ShoppingBudgetLandingPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      {/* HERO */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Free Shopping Budget Calculator</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Build a realistic shopping plan by allocating your budget across categories and tracking totals in real time.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Link
            href="#calculator"
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
          >
            Plan My Budget
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
            <h2 className="text-2xl font-semibold">Try the Shopping Budget Calculator</h2>
            <p className="text-gray-600">
              Enter your total budget and allocate across categories like groceries, gifts, and extras to stay on track.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <FosterWealthCalculators freeOnly allowedCalcs={["shopping-budget"]} />
        </div>
      </section>

      {/* EDUCATION */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How to use it</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Total budget:</strong> What you are willing to spend on this trip or month.
          </li>
          <li>
            <strong>Categories:</strong> Add line items (groceries, gifts, clothing) with amounts.
          </li>
          <li>
            <strong>Must-haves vs. nice-to-haves:</strong> Prioritize essentials first.
          </li>
        </ul>
        <p className="text-gray-700">
          Adjust categories live to see how a splurge affects your remaining balance and avoid overspending.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Popular uses</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Holiday shopping with a hard cap per person.</li>
          <li>Grocery runs with set limits for staples and treats.</li>
          <li>Back-to-school lists with must-have vs. optional items.</li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Shopping Budget FAQ</h2>

        <div className="space-y-3">
          <h3 className="font-semibold">What if prices change?</h3>
          <p className="text-gray-700">
            Update item amounts on the fly to keep totals accurate as you shop.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Can I reuse a budget?</h3>
          <p className="text-gray-700">
            Yes. Save your category list and refresh amounts before your next trip.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Do I need an account?</h3>
          <p className="text-gray-700">No. It is free and runs instantly in your browser.</p>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="text-center space-y-3 pb-8">
        <p className="text-gray-700">Want more tools to keep spending on track?</p>
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
