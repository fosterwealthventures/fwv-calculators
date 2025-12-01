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
          <h3 className="font-semibold">What is ROI and how is it calculated?</h3>
          <p className="text-gray-700">
            ROI (Return on Investment) measures how much profit you earn compared to
            what you invested. The basic formula is: (Gain from Investment − Cost of
            Investment) ÷ Cost of Investment. Our calculator uses this formula to show
            your ROI as a percentage and in dollars.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            What is a good ROI for a business or project?
          </h3>
          <p className="text-gray-700">
            A "good" ROI depends on your industry, risk level, and time frame. Many
            small business owners look for ROIs that outperform basic savings or index
            funds over the same period. Use this calculator to compare different ideas
            and choose where your money works hardest.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            Can I use this ROI calculator for side hustles or online businesses?
          </h3>
          <p className="text-gray-700">
            Yes. This tool works for almost any type of investment: ads, side
            hustles, digital products, real estate, and more. Just enter your total
            costs and total returns to see whether the idea is worth scaling.
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
                    "ROI (Return on Investment) measures how much profit you earn compared to what you invested. The formula is (Gain from Investment − Cost of Investment) ÷ Cost of Investment. This calculator uses that formula to show ROI in both percentage and dollars.",
                },
              },
              {
                "@type": "Question",
                name: "What is a good ROI for a business or project?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "A good ROI depends on your industry, risk level, and time frame. Many businesses aim for returns that beat basic savings or index funds. Use this ROI calculator to compare projects and choose where your money performs best.",
                },
              },
              {
                "@type": "Question",
                name: "Can I use this ROI calculator for side hustles or online businesses?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Yes. This ROI calculator works for side hustles, digital products, online ads, real estate, and more. Enter your total costs and total returns to see whether your idea is worth continuing or scaling.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
