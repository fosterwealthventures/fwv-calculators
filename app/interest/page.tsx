import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";

export const metadata: Metadata = {
  title: "Free Interest Calculator (Simple & Compound) - FWV Calculators",
  description:
    "Project savings or loan growth with simple and compound interest. Enter principal, rate, and time horizon to see totals and interest earned.",
};

export default function InterestLandingPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      {/* HERO */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          Free Interest Calculator
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Compare simple vs. compound interest so you can see how contributions
          and rates change your balance over time.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Link
            href="#calculator"
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
          >
            Calculate My Growth
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
            <h2 className="text-2xl font-semibold">Try the Interest Calculator</h2>
            <p className="text-gray-600">
              Enter your starting balance, rate, time, and optional contributions
              to see total value and interest earned with simple and compound settings.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <FosterWealthCalculators freeOnly allowedCalcs={["interest"]} />
        </div>
      </section>

      {/* EDUCATION */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How to use the interest tool</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Principal:</strong> Your starting balance or loan amount.
          </li>
          <li>
            <strong>Rate (APR):</strong> Annual rate expressed as a percentage.
          </li>
          <li>
            <strong>Time horizon:</strong> Enter years or months to see how long
            you earn or accrue interest.
          </li>
          <li>
            <strong>Contributions:</strong> Add recurring deposits to model
            savings growth; set to zero for a one-time deposit.
          </li>
          <li>
            <strong>Simple vs. compound:</strong> Toggle to see how compounding
            frequency changes the ending balance.
          </li>
        </ul>
        <p className="text-gray-700">
          Small changes to rate, time, or contribution amount can dramatically
          change your ending balance. Run a few scenarios to choose the plan that
          fits your goal.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Popular ways people use it</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Compare a high-yield savings account vs. a CD before locking funds.</li>
          <li>See how extra monthly deposits accelerate an emergency fund.</li>
          <li>Check how interest-only vs. amortizing loans differ over time.</li>
          <li>Model long-term compounding for college, retirement, or big purchases.</li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Interest Calculator FAQ</h2>

        <div className="space-y-3">
          <h3 className="font-semibold">When should I use simple interest?</h3>
          <p className="text-gray-700">
            Use simple interest for short-term loans or scenarios that do not
            compound (many auto loans or some personal loans).
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Why is compound interest larger?</h3>
          <p className="text-gray-700">
            Compound interest grows on both your principal and previously earned
            interest, so balances snowball faster as time and rate increase.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Do I need an account to use it?</h3>
          <p className="text-gray-700">
            No. The interest calculator is free and runs instantly in your browser.
          </p>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="text-center space-y-3 pb-8">
        <p className="text-gray-700">
          Ready for more money tools that answer tough questions?
        </p>
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
