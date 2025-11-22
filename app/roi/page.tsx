import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";

export const metadata: Metadata = {
  title: "Free ROI Calculator - FWV Calculators",
  description:
    "Calculate return on investment fast. Enter cost, ending value, and time horizon to see ROI and annualized ROI for projects, campaigns, or assets.",
};

export default function ROILandingPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      {/* HERO */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Free ROI Calculator</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Measure the payoff of any project, ad campaign, or investment by
          seeing total ROI and annualized ROI in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Link
            href="#calculator"
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
          >
            Calculate My ROI
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
            <h2 className="text-2xl font-semibold">Try the ROI Calculator</h2>
            <p className="text-gray-600">
              Enter your initial investment, ending value, and time held to see
              both ROI and annualized ROI you can compare across projects.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <FosterWealthCalculators freeOnly allowedCalcs={["roi"]} />
        </div>
      </section>

      {/* EDUCATION */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How to use the ROI tool</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Initial investment:</strong> Everything you spent (cash,
            fees, or ad spend).
          </li>
          <li>
            <strong>Ending value:</strong> Sale proceeds or current value of the
            asset/project.
          </li>
          <li>
            <strong>Time held:</strong> Use years or months so the calculator
            can annualize your return fairly.
          </li>
          <li>
            <strong>Mid-period cash flow (optional):</strong> Add any extra
            contributions or withdrawals to get a truer ROI.
          </li>
        </ul>
        <p className="text-gray-700">
          Annualized ROI helps you stack-rank projects with different lengths—so
          a 6-month pilot and a 2-year investment can be compared apples to
          apples.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Popular ways people use it</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Marketing teams comparing campaigns by ROI and speed of payback.</li>
          <li>Founders checking if a prototype build beat their hurdle rate.</li>
          <li>Investors benchmarking flips, rentals, or side bets vs. the S&P.</li>
          <li>DIYers validating if a home upgrade or tool paid for itself.</li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">ROI Calculator FAQ</h2>

        <div className="space-y-3">
          <h3 className="font-semibold">Is ROI the same as profit margin?</h3>
          <p className="text-gray-700">
            No. ROI compares your gain to what you invested, while margin
            compares profit to revenue. Use ROI to judge if the investment
            outperformed your hurdle rate.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Why show annualized ROI?</h3>
          <p className="text-gray-700">
            Annualizing normalizes projects of different lengths so you can
            quickly tell which use of capital worked hardest each year.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Do I need an account to use it?</h3>
          <p className="text-gray-700">
            No. The ROI calculator is free and runs instantly in your browser.
          </p>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="text-center space-y-3 pb-8">
        <p className="text-gray-700">
          Want more ways to size up your next move?
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
