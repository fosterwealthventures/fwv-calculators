import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Shopping Budget Calculator – Plan Your Spending & Avoid Overspending",
  description:
    "Use this free shopping budget calculator to plan your spending before you buy. Add items, compare totals, and stay on target for trips, events, or everyday shopping.",
  alternates: {
    canonical: "https://calculators.fosterwealthventures.com/shopping-budget",
  },
  openGraph: {
    title: "Shopping Budget Calculator – Free Spending Planner",
    description:
      "Plan your shopping trip with a clear budget. Add items, adjust quantities, and track your total so you don't overspend.",
    url: "https://calculators.fosterwealthventures.com/shopping-budget",
    siteName: "FWV Calculators",
    type: "website",
  },
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
        <h2 className="text-2xl font-semibold">Shopping Budget Calculator FAQ</h2>

        <div className="space-y-3">
          <h3 className="font-semibold">What does this shopping budget calculator do?</h3>
          <p className="text-gray-700">
            This calculator helps you plan your spending before you check out. You can
            set a total budget, add items with estimated prices, and see how close you
            are to your limit so you can adjust your cart with confidence.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            What kinds of shopping can I use this for?
          </h3>
          <p className="text-gray-700">
            You can use it for grocery runs, back-to-school shopping, holiday gifts,
            travel prep, or any shopping trip where you want to stay within a
            specific budget. It works whether you're shopping in-store or
            online.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            How does this help me avoid overspending?
          </h3>
          <p className="text-gray-700">
            Instead of guessing while you shop, you can see your running total as you
            add items. If you're getting close to your budget, you can remove or
            swap items before you spend the money, which makes it easier to stick to
            your plan.
          </p>
        </div>
      </section>

      {/* INTERNAL LINKS */}
      <section className="space-y-4">
        <p className="text-gray-700">
          If you're planning a bigger purchase or trip, you can pair this tool
          with our{" "}
          <Link href="/roi" className="underline text-emerald-700">
            ROI Calculator
          </Link>{" "}
          to see if the spend is worth it, or our{" "}
          <Link href="/interest" className="underline text-emerald-700">
            Interest Calculator
          </Link>{" "}
          if you're saving up over time.
        </p>
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

      {/* FAQ SCHEMA */}
      <Script
        id="shopping-budget-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What does this shopping budget calculator do?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "The shopping budget calculator helps you plan your spending by letting you set a budget, add items with estimated prices, and see how close you are to your limit before you check out.",
                },
              },
              {
                "@type": "Question",
                name: "What kinds of shopping can I use this for?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "You can use the calculator for groceries, holiday shopping, school supplies, travel, or any trip where you want to stay within a specific budget. It works for both in-store and online shopping.",
                },
              },
              {
                "@type": "Question",
                name: "How does this shopping budget calculator help me avoid overspending?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "By tracking your running total as you add items, the calculator shows when you're approaching your budget so you can remove or swap items before you overspend.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
