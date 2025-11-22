import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";

export const metadata: Metadata = {
  title: "Free Freelancer Rate Calculator - FWV Calculators",
  description:
    "Set a freelance hourly rate that covers taxes, overhead, and profit. Enter target income, billable hours, and expenses to get a sustainable rate.",
};

export default function FreelancerRateLandingPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      {/* HERO */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Free Freelancer Rate Calculator</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Price with confidence by factoring taxes, overhead, and realistic billable hours.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Link
            href="#calculator"
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
          >
            Calculate My Rate
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
            <h2 className="text-2xl font-semibold">Try the Freelancer Rate Calculator</h2>
            <p className="text-gray-600">
              Enter your target annual income, tax rate, overhead, and expected billable hours to get a sustainable hourly rate.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <FosterWealthCalculators freeOnly allowedCalcs={["freelancer-rate"]} />
        </div>
      </section>

      {/* EDUCATION */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How to use it</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Target income:</strong> What you want to take home yearly.
          </li>
          <li>
            <strong>Tax rate:</strong> Include federal, state, and self-employment estimates.
          </li>
          <li>
            <strong>Overhead:</strong> Software, gear, health insurance, and other monthly costs.
          </li>
          <li>
            <strong>Billable hours:</strong> Realistic hours you can invoice after admin time.
          </li>
        </ul>
        <p className="text-gray-700">
          Adjust overhead or billable hours to see how your rate should move for a profitable business.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Popular uses</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>New freelancers setting first rates with taxes baked in.</li>
          <li>Agencies checking if subcontractor rates are sustainable.</li>
          <li>Creators pricing packaged services or retainers.</li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Freelancer Rate FAQ</h2>

        <div className="space-y-3">
          <h3 className="font-semibold">How many hours should I mark billable?</h3>
          <p className="text-gray-700">
            Most solo operators invoice 50–70% of their working hours. Start conservative, then revisit after a month or two.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Does this include profit?</h3>
          <p className="text-gray-700">
            Yes. The calculator bakes profit into your target income so you are not just covering costs.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Do I need an account?</h3>
          <p className="text-gray-700">No. It is free and runs instantly in your browser.</p>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="text-center space-y-3 pb-8">
        <p className="text-gray-700">Want more pricing tools?</p>
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
