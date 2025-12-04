import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Mortgage Payment Calculator – Free Monthly House Payment Tool (P&I)",
  description:
    "Use this free mortgage payment calculator to estimate your monthly house payment and total interest based on loan amount, interest rate, and term. Perfect for homebuyers, refinancers, and investors.",
  alternates: {
    canonical: "https://calculators.fosterwealthventures.com/mortgage",
  },
  openGraph: {
    title: "Mortgage Payment Calculator – Estimate Monthly House Payments",
    description:
      "Instantly estimate your monthly mortgage payment and total interest using our free P&I mortgage calculator. Compare loan terms and rates before you buy or refinance.",
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
          Free Monthly Mortgage Payment Calculator
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Use this free mortgage payment calculator to estimate your monthly
          principal and interest payment, total interest cost, and how your loan
          term and rate impact what you pay over time.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Link
            href="#calculator"
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
          >
            Calculate My Monthly Payment
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700"
          >
            Browse All FWV Calculators
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          No sign-up required. 100% free principal &amp; interest calculator.
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
              Try the Mortgage Payment Calculator
            </h2>
            <p className="text-gray-600">
              Enter your home price or loan amount, down payment, interest rate,
              and term to see your estimated monthly mortgage payment and total
              interest over the life of the loan.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <FosterWealthCalculators freeOnly allowedCalcs={["mortgage"]} />
        </div>
      </section>

      {/* SEO CONTENT: HOW-TO + EXAMPLE */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          How to Use the Mortgage Payment Calculator (Step-by-Step)
        </h2>
        <p className="text-gray-700">
          This monthly mortgage payment calculator uses the standard mortgage
          formula to estimate your principal and interest (P&amp;I) payment
          based on your loan amount, interest rate, and loan term. Adjust the
          inputs to test different scenarios before you talk to a lender.
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Enter the home price or loan amount.</strong> This is the
            amount you&apos;re financing after your down payment.
          </li>
          <li>
            <strong>Add your down payment.</strong> A larger down payment
            reduces the amount you borrow and often lowers your monthly payment.
          </li>
          <li>
            <strong>Set the interest rate.</strong> Use the rate your lender
            quoted or a rate you want to test (for example, 6.5%).
          </li>
          <li>
            <strong>Choose a loan term.</strong> Common terms are 15 years and
            30 years. Shorter terms usually mean higher monthly payments but
            much less total interest.
          </li>
          <li>
            <strong>Review your results.</strong> Look at the monthly mortgage
            payment and total interest. Adjust the numbers until the payment
            feels affordable for your budget.
          </li>
        </ol>
      </section>

      {/* REAL-LIFE EXAMPLE */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Example: What Does a $300,000 Mortgage Payment Look Like?
        </h2>
        <p className="text-gray-700">
          Here&apos;s a simple example of how this mortgage payment calculator
          can help you stress-test your affordability:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li>Home price: $300,000</li>
          <li>Down payment: 20% ($60,000)</li>
          <li>Loan amount: $240,000</li>
          <li>Interest rate: 6.5% (fixed)</li>
          <li>Loan term: 30 years</li>
        </ul>
        <p className="text-gray-700">
          Plugging these numbers into the mortgage payment calculator, you&apos;ll
          see an estimated monthly principal and interest payment and total
          interest over 30 years. From there, you can test ideas like:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li>What happens if rates go up to 7.0%?</li>
          <li>What if I choose a 15-year term instead?</li>
          <li>How much does a bigger down payment lower my monthly payment?</li>
        </ul>
        <p className="text-gray-700">
          Use the tool to answer practical questions like{" "}
          <em>&quot;What will my mortgage payment be?&quot;</em> and{" "}
          <em>&quot;Can I comfortably afford this house?&quot;</em>
        </p>
      </section>

      {/* WHAT AFFECTS PAYMENT */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          What Affects Your Monthly Mortgage Payment?
        </h2>
        <p className="text-gray-700">
          Your monthly mortgage payment is mainly driven by your interest rate,
          loan amount, and term length. Even a small change in rate or term can
          significantly increase or decrease your total interest cost. This
          mortgage payment calculator lets you quickly compare scenarios before
          you commit to a loan.
        </p>
        <p className="text-gray-700">
          Remember, most lenders will also include property taxes, homeowner&apos;s
          insurance, and possibly HOA fees in your total monthly housing payment
          (often called PITI: Principal, Interest, Taxes, and Insurance). This
          tool focuses on the principal and interest portion so you have a clear
          baseline for your financing cost.
        </p>
      </section>

      {/* FAQ SECTION FOR SEO */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Mortgage Payment Calculator FAQ</h2>

        <div className="space-y-3">
          <h3 className="font-semibold">
            How accurate is this mortgage payment calculator?
          </h3>
          <p className="text-gray-700">
            The calculator uses the standard mortgage payment formula to
            estimate principal and interest based on your loan amount, rate, and
            term. It&apos;s a strong estimate for comparing options, but your
            actual payment may differ slightly depending on your lender&apos;s
            fees and rounding.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            Does this calculator include taxes and insurance?
          </h3>
          <p className="text-gray-700">
            This tool focuses on principal and interest (P&amp;I) so you can see
            the core mortgage payment. To estimate your full housing cost, you
            can add your expected monthly property taxes, homeowner&apos;s
            insurance, HOA dues, and other housing expenses on top of the P&amp;I
            result.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            Is this mortgage payment calculator really free to use?
          </h3>
          <p className="text-gray-700">
            Yes. The Foster Wealth Ventures (FWV) Calculators are designed to
            help you make confident money decisions. This monthly mortgage
            payment calculator is completely free to use with no sign-up or
            email required.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            Can I use this mortgage calculator for refinancing?
          </h3>
          <p className="text-gray-700">
            Absolutely. You can treat your current balance as the loan amount
            and enter the new interest rate and term you&apos;re considering.
            The calculator will show the new estimated monthly payment so you
            can compare it with what you&apos;re paying now.
          </p>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="text-center space-y-3 pb-8">
        <p className="text-gray-700">
          Ready to explore more money tools for homebuyers, refinancers, and
          investors?
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
                name: "How accurate is this mortgage payment calculator?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "The calculator uses the standard mortgage payment formula to estimate principal and interest based on your loan amount, rate, and term. It's a strong estimate for comparing options, but your actual payment may differ slightly depending on your lender's fees and rounding.",
                },
              },
              {
                "@type": "Question",
                name: "Does this calculator include taxes and insurance?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "This tool focuses on principal and interest (P&I) so you can see the core mortgage payment. To estimate your full housing cost, you can add your expected monthly property taxes, homeowner's insurance, HOA dues, and other housing expenses on top of the P&I result.",
                },
              },
              {
                "@type": "Question",
                name: "Is this mortgage payment calculator really free to use?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Yes. The Foster Wealth Ventures (FWV) Calculators are designed to help you make confident money decisions. This monthly mortgage payment calculator is completely free to use with no sign-up or email required.",
                },
              },
              {
                "@type": "Question",
                name: "Can I use this mortgage calculator for refinancing?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Yes. Enter your current loan balance as the loan amount, along with the new interest rate and term you're considering. The calculator will estimate your new principal and interest payment so you can compare it to your existing mortgage.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
