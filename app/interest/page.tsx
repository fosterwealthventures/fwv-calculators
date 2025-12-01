import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title:
    "Interest Calculator – Simple & Compound Interest Growth (Free Tool)",
  description:
    "Use this free interest calculator to see how your money grows with simple or compound interest. Compare rates, timelines, and contribution amounts instantly.",
  alternates: {
    canonical: "https://calculators.fosterwealthventures.com/interest",
  },
  openGraph: {
    title: "Interest Calculator – Simple & Compound Interest",
    description:
      "Calculate simple and compound interest in seconds. Estimate future value, total interest earned, and compare different savings or investment scenarios.",
    url: "https://calculators.fosterwealthventures.com/interest",
    siteName: "FWV Calculators",
    type: "website",
  },
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
          <h3 className="font-semibold">
            What is the difference between simple and compound interest?
          </h3>
          <p className="text-gray-700">
            Simple interest is calculated only on your original principal, while
            compound interest is calculated on your principal plus any interest that
            has already been added. Over time, compound interest usually grows your
            money faster than simple interest.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            What inputs do I need for this interest calculator?
          </h3>
          <p className="text-gray-700">
            You'll need your starting balance, interest rate, time period, and
            whether interest is simple or compounded (and how often it compounds, such
            as yearly, monthly, or daily). You can also include regular contributions
            to see how consistent saving affects your results.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            Can I use this interest calculator for savings and investments?
          </h3>
          <p className="text-gray-700">
            Yes. You can use it for savings accounts, CDs, basic investment growth
            estimates, and more. It's designed to give you a clear picture of
            how your balance changes over time at different rates and contribution
            levels.
          </p>
        </div>
      </section>

      {/* INTERNAL LINKS */}
      <section className="space-y-4">
        <p className="text-gray-700">
          Once you understand how interest works, you can also use our{" "}
          <Link href="/roi" className="underline text-emerald-700">
            ROI Calculator
          </Link>{" "}
          to see return on investment or our{" "}
          <Link href="/savings-growth" className="underline text-emerald-700">
            Savings Growth Calculator
          </Link>{" "}
          (Plus) if you're planning a long-term savings habit.
        </p>
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

      {/* FAQ SCHEMA */}
      <Script
        id="interest-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is the difference between simple and compound interest?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Simple interest is calculated only on the original principal, while compound interest is calculated on the principal plus previously earned interest. Over time, compound interest usually leads to faster growth.",
                },
              },
              {
                "@type": "Question",
                name: "What inputs do I need for this interest calculator?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "To use the interest calculator you need your starting balance, interest rate, time period, and whether you want simple or compound interest. You can also specify how often interest compounds and add regular contributions to see how your balance changes over time.",
                },
              },
              {
                "@type": "Question",
                name: "Can I use this interest calculator for savings and investments?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Yes. The interest calculator can be used for savings accounts, CDs, and basic investment growth estimates. It helps you visualize how your money may grow with different interest rates and contribution schedules.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
