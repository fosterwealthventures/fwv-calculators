import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "ROI Calculator – Free Return on Investment Calculator (Instant ROI%)",
  description:
    "Use this free ROI calculator to find your return on investment. Enter cost and returns to see profit, ROI percentage, and total gain. Perfect for small businesses, side hustles, and investors.",
  alternates: {
    canonical: "https://calculators.fosterwealthventures.com/roi",
  },
  openGraph: {
    title: "ROI Calculator – Free Return on Investment Calculator",
    description:
      "Instantly calculate your return on investment with our free ROI calculator. Compare scenarios and see profit, ROI %, and total gain before you commit.",
    url: "https://calculators.fosterwealthventures.com/roi",
    siteName: "FWV Calculators",
    type: "website",
  },
};

export default function ROILandingPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      {/* HERO */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Free ROI Calculator</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Use this free ROI calculator to measure the payoff of any project, ad
          campaign, or investment. See profit, ROI percentage, and annualized
          ROI in seconds so you know where your money works hardest.
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
          No sign-up required. 100% free ROI calculator.
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
              your total ROI and annualized ROI. Compare ideas side by side
              before you commit more money.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <FosterWealthCalculators freeOnly allowedCalcs={["roi"]} />
        </div>
      </section>

      {/* HOW-TO / EDUCATION */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          How to Use the ROI Calculator (Step-by-Step)
        </h2>
        <p className="text-gray-700">
          ROI (Return on Investment) shows how much profit you earned compared
          to what you spent. This ROI calculator makes it easy to plug in your
          numbers and instantly see whether something is worth continuing,
          fixing, or shutting down.
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Enter your initial investment.</strong> Include everything
            you spent: cash, fees, tools, ad spend, or labor costs you want to
            track.
          </li>
          <li>
            <strong>Add your ending value or total return.</strong> This might
            be sales revenue from a campaign, profit from a flip, or the current
            value of an investment.
          </li>
          <li>
            <strong>Set how long you held the investment.</strong> Use months
            or years so the tool can calculate annualized ROI and compare a
            short test vs. a long project fairly.
          </li>
          <li>
            <strong>Include mid-period cash flows (optional).</strong> Add any
            extra contributions or withdrawals to get a more realistic ROI.
          </li>
          <li>
            <strong>Review your ROI and annualized ROI.</strong> Use these
            numbers to decide whether to scale, tweak, or stop the idea.
          </li>
        </ol>
        <p className="text-gray-700">
          Annualized ROI is especially useful when you&apos;re comparing
          projects with different time frames—like a 3-month ad test vs. a
          2-year real estate deal.
        </p>
        <p className="text-gray-700">
          Once you know your ROI, you can also explore our{" "}
          <Link href="/break-even" className="underline text-emerald-700">
            Break-Even Calculator
          </Link>{" "}
          and{" "}
          <Link href="/freelancer-rate" className="underline text-emerald-700">
            Freelancer Rate Calculator
          </Link>{" "}
          to price services and understand your path to profit.
        </p>
      </section>

      {/* REAL-LIFE EXAMPLES */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Example ROI Calculations (Marketing, Business, and Investing)
        </h2>

        <div className="space-y-2 text-gray-700">
          <h3 className="font-semibold">1. Marketing Campaign ROI</h3>
          <p>
            You spend <strong>$1,000</strong> on ads and generate{" "}
            <strong>$3,000</strong> in sales.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Initial investment: $1,000</li>
            <li>Ending value (revenue): $3,000</li>
            <li>Profit: $2,000</li>
          </ul>
          <p>
            ROI = (2,000 ÷ 1,000) = <strong>200% ROI</strong>. You can now ask:
            &quot;Should I scale this campaign or test a new one first?&quot;
          </p>
        </div>

        <div className="space-y-2 text-gray-700">
          <h3 className="font-semibold">2. Small Business Equipment ROI</h3>
          <p>
            You buy a tool for <strong>$2,500</strong> that helps you produce
            more work, leading to <strong>$5,000</strong> in extra profit over a
            year.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Initial investment: $2,500</li>
            <li>Extra profit: $5,000</li>
          </ul>
          <p>
            ROI = (5,000 ÷ 2,500) = <strong>200% ROI</strong> over one year.
          </p>
        </div>

        <div className="space-y-2 text-gray-700">
          <h3 className="font-semibold">3. Simple Investment ROI</h3>
          <p>
            You invest <strong>$10,000</strong> and it grows to{" "}
            <strong>$11,500</strong> in one year.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Initial investment: $10,000</li>
            <li>Ending value: $11,500</li>
            <li>Profit: $1,500</li>
          </ul>
          <p>
            ROI = (1,500 ÷ 10,000) = <strong>15% ROI</strong>. Compare that to
            other options (like index funds) to see if the risk is worth it.
          </p>
        </div>
      </section>

      {/* POPULAR USE CASES */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Popular Ways People Use It</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Marketing teams comparing campaigns by ROI and payback speed.</li>
          <li>Founders checking if a prototype or launch beat their hurdle rate.</li>
          <li>
            Investors benchmarking flips, rentals, or side bets vs. a basic
            index fund.
          </li>
          <li>
            Side hustlers and DIYers validating whether a tool, course, or
            upgrade paid for itself.
          </li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">ROI Calculator FAQ</h2>

        <div className="space-y-3">
          <h3 className="font-semibold">
            What is ROI and how is it calculated?
          </h3>
          <p className="text-gray-700">
            ROI (Return on Investment) measures how much profit you earn
            compared to what you invested. The basic formula is:{" "}
            <em>(Gain from Investment − Cost of Investment) ÷ Cost of
              Investment</em>. This ROI calculator uses that formula to show your
            ROI as both a percentage and a dollar amount.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            What is the difference between ROI and annualized ROI?
          </h3>
          <p className="text-gray-700">
            ROI looks at your total return over the whole period. Annualized ROI
            adjusts that return to a yearly rate so you can compare short tests
            and long projects fairly. For example, a 20% return over 3 months
            will show a much higher annualized ROI than 20% over 3 years.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            What is a good ROI for a business or project?
          </h3>
          <p className="text-gray-700">
            A &quot;good&quot; ROI depends on your industry, risk level, and
            time frame. Many business owners look for returns that beat basic
            savings or index funds over the same period. Use this ROI calculator
            to compare different ideas and move more money into the ones that
            consistently win.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            Can I use this ROI calculator for side hustles or online businesses?
          </h3>
          <p className="text-gray-700">
            Yes. This tool works for almost any type of investment: ad
            campaigns, side hustles, digital products, software tools, real
            estate, and more. Just enter your total costs and total returns to
            see whether the idea is worth scaling.
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

      {/* FAQ SCHEMA FOR RICH RESULTS */}
      <Script
        id="roi-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is ROI and how is it calculated?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "ROI (Return on Investment) measures how much profit you earn compared to what you invested. The basic formula is (Gain from Investment − Cost of Investment) ÷ Cost of Investment. This ROI calculator uses that formula to show your return in both percentage and dollars.",
                },
              },
              {
                "@type": "Question",
                name: "What is the difference between ROI and annualized ROI?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "ROI looks at your total return over the whole period, while annualized ROI converts that return into a yearly rate. This helps you compare short projects and long investments on the same basis.",
                },
              },
              {
                "@type": "Question",
                name: "What is a good ROI for a business or project?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "A good ROI depends on your industry, risk, and time frame. Many businesses aim for returns that beat basic savings or index funds over the same period. Use this free ROI calculator to compare projects and focus on the ones that consistently perform best.",
                },
              },
              {
                "@type": "Question",
                name: "Can I use this ROI calculator for side hustles or online businesses?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Yes. This ROI calculator works for side hustles, online businesses, digital products, marketing campaigns, real estate, and more. Enter your total costs and total returns to see whether your idea is worth continuing or scaling.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
