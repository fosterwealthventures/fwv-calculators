import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Mortgage Calculator – Estimate Monthly House Payments (Free P&I Tool)",
  description:
    "Use this free mortgage calculator to estimate your monthly house payment, total interest, and payoff cost. Compare loan terms and rates before you buy or refinance.",
  alternates: {
    canonical: "https://calculators.fosterwealthventures.com/mortgage",
  },
  openGraph: {
    title: "Mortgage Calculator – Estimate Monthly House Payments",
    description:
      "Instantly estimate your monthly mortgage payment, total interest, and payoff cost. Free calculator for homebuyers, refinancers, and investors.",
    url: "https://calculators.fosterwealthventures.com/mortgage",
    siteName: "Foster Wealth Calculators",
    type: "website",
  },
};

export default function MortgageLandingPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      {/* HERO SECTION */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          Free Mortgage Payment Calculator
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Stress-test your affordability by instantly calculating your monthly
          payment, total interest, and how your loan term affects your overall
          cost.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Link
            href="#calculator"
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
          >
            See My Monthly Payment
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

      {/* CALCULATOR SECTION */}
      <section
        id="calculator"
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-4"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-semibold">
              Try the Mortgage Calculator
            </h2>
            <p className="text-gray-600">
              Enter your home price, down payment, interest rate, and term to
              see your monthly payment and total cost.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <FosterWealthCalculators freeOnly allowedCalcs={["mortgage"]} />
        </div>
      </section>

      {/* SEO CONTENT: EDUCATION + TRUST */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          How to Use the Mortgage Payment Calculator
        </h2>
        <p className="text-gray-700">
          This free mortgage calculator helps you estimate your monthly payment
          based on your loan amount, interest rate, and term. Adjust the inputs
          to see how a higher down payment or shorter term can reduce your total
          interest paid over the life of the loan.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Home Price / Loan Amount:</strong> The cost of the home or
            total mortgage you plan to borrow.
          </li>
          <li>
            <strong>Down Payment:</strong> The amount you pay upfront. A larger
            down payment usually lowers your monthly payment.
          </li>
          <li>
            <strong>Interest Rate:</strong> Your annual mortgage rate from your
            lender.
          </li>
          <li>
            <strong>Loan Term:</strong> The number of years you&apos;ll take to
            pay off the mortgage (e.g., 15 or 30 years).
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          What Affects Your Mortgage Payment?
        </h2>
        <p className="text-gray-700">
          Your payment is mainly driven by your interest rate, loan amount, and
          term length. Even a small change in rate or term can significantly
          impact your total interest cost. Use this calculator to compare
          scenarios before you commit to a loan.
        </p>
        <p className="text-gray-700">
          Many homeowners use this tool to answer questions like:{" "}
          <em>&quot;How much house can I afford?&quot;</em>,{" "}
          <em>&quot;What will my payment be if rates go up?&quot;</em>, or{" "}
          <em>&quot;Is it worth refinancing to a lower rate?&quot;</em>
        </p>
      </section>

      {/* FAQ SECTION FOR SEO */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Mortgage Calculator FAQ</h2>

        <div className="space-y-3">
          <h3 className="font-semibold">
            How accurate is this mortgage calculator?
          </h3>
          <p className="text-gray-700">
            The calculator uses a standard mortgage formula to estimate
            principal and interest. It does not include property taxes,
            homeowner&apos;s insurance, or HOA fees, which vary by location and
            lender.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            Does this calculator include taxes and insurance?
          </h3>
          <p className="text-gray-700">
            By default, it focuses on principal and interest. You can manually
            add estimated taxes and insurance to the monthly payment to see your
            total housing cost.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            Is this mortgage calculator really free to use?
          </h3>
          <p className="text-gray-700">
            Yes. The FWV Calculators tools are designed to help you make
            confident money decisions, and this mortgage calculator is free with
            no sign-up required.
          </p>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="text-center space-y-3 pb-8">
        <p className="text-gray-700">
          Ready to explore more money tools for homebuyers and investors?
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

      {/* FAQ SCHEMA FOR RICH RESULTS */}
      <Script
        id="mortgage-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How accurate is this mortgage calculator?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "The calculator uses a standard mortgage formula to estimate principal and interest. It does not include property taxes, homeowner's insurance, or HOA fees, which vary by location and lender.",
                },
              },
              {
                "@type": "Question",
                name: "Does this calculator include taxes and insurance?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "By default, it focuses on principal and interest. You can manually add estimated taxes and insurance to the monthly payment to see your total housing cost.",
                },
              },
              {
                "@type": "Question",
                name: "Is this mortgage calculator really free to use?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Yes. The FWV Calculators tools are designed to help you make confident money decisions, and this mortgage calculator is free with no sign-up required.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
