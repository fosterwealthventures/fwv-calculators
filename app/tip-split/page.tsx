import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";

export const metadata: Metadata = {
  title: "Free Tip & Tab Split Calculator - FWV Calculators",
  description:
    "Split restaurant bills and tips fairly. Enter totals, tax, and custom splits to see what each person owes.",
};

export default function TipSplitLandingPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      {/* HERO */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Free Tip & Tab Split Calculator</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Split group meals without awkward math—add tax, tip, and custom shares in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Link
            href="#calculator"
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
          >
            Split My Bill
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
            <h2 className="text-2xl font-semibold">Try the Tip & Tab Split Calculator</h2>
            <p className="text-gray-600">
              Enter bill total, tip %, tax, and per-person adjustments to see what everyone owes.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <FosterWealthCalculators freeOnly allowedCalcs={["tip-split"]} />
        </div>
      </section>

      {/* EDUCATION */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How to use it</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Bill total:</strong> Add food and drinks before tip.
          </li>
          <li>
            <strong>Tip %:</strong> Choose your gratuity or enter a custom amount.
          </li>
          <li>
            <strong>Tax:</strong> Include local tax so the split is accurate.
          </li>
          <li>
            <strong>Custom shares:</strong> Adjust for someone who ordered more (or less).
          </li>
        </ul>
        <p className="text-gray-700">
          Share the results instantly so the group can pay quickly with no awkward math.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Popular uses</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Friends splitting a night out with different orders.</li>
          <li>Roommates dividing grocery or delivery tabs.</li>
          <li>Teams expensing meals with clear receipts per person.</li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Tip & Tab Split FAQ</h2>

        <div className="space-y-3">
          <h3 className="font-semibold">Can I handle people who don't drink?</h3>
          <p className="text-gray-700">
            Yes. Use custom shares to assign higher portions to those who ordered more.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Does it include tax?</h3>
          <p className="text-gray-700">
            Add tax so the split reflects the real total with tip included.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Do I need an account?</h3>
          <p className="text-gray-700">No. It is free and runs instantly in your browser.</p>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="text-center space-y-3 pb-8">
        <p className="text-gray-700">Ready to split the next bill faster?</p>
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
