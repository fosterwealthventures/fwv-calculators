import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Break-Even Calculator – Find Units & Revenue Needed to Break Even",
  description:
    "Use this free break-even calculator to find how many units or how much revenue you need to cover your costs. See contribution margin, profit, and pricing impact.",
  alternates: {
    canonical: "https://calculators.fosterwealthventures.com/break-even",
  },
  openGraph: {
    title: "Break-Even Calculator – Units & Revenue to Break Even",
    description:
      "Instantly calculate your break-even point in units and revenue. Enter price, fixed cost, and variable cost to see when your business starts making profit.",
    url: "https://calculators.fosterwealthventures.com/break-even",
    siteName: "FWV Calculators",
    type: "website",
  },
};

export default function BreakEvenLandingPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      {/* HERO */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Free Break-even Calculator</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Quickly see how many units or dollars you need to sell to cover costs and start making profit.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Link
            href="#calculator"
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
          >
            Find My Break-even
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
            <h2 className="text-2xl font-semibold">Try the Break-even Calculator</h2>
            <p className="text-gray-600">
              Input fixed costs, variable cost per unit, and price to see units and revenue to break even.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <FosterWealthCalculators freeOnly allowedCalcs={["break-even"]} />
        </div>
      </section>

      {/* EDUCATION */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How to use it</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Fixed costs:</strong> Monthly overhead like salaries, rent, and software.
          </li>
          <li>
            <strong>Variable cost per unit:</strong> What it costs to deliver one unit (COGS, fulfillment, ads).
          </li>
          <li>
            <strong>Price:</strong> Your selling price per unit or average order value.
          </li>
        </ul>
        <p className="text-gray-700">
          Adjust price or costs to see how many units you need to hit breakeven and how margin changes runway.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Popular uses</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Founders pressure-testing launch pricing before spending on ads.</li>
          <li>Product teams modeling margin impact of new features or bundles.</li>
          <li>Creators validating payback period on merch or courses.</li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Break-Even Calculator FAQ</h2>

        <div className="space-y-3">
          <h3 className="font-semibold">What is a break-even point?</h3>
          <p className="text-gray-700">
            Your break-even point is where your total revenue equals your total
            costs—no profit, no loss. Our break-even calculator uses your price per
            unit, variable cost per unit, and fixed costs to show how many units you
            need to sell and the revenue you need to cover your costs.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            What information do I need to use this break-even calculator?
          </h3>
          <p className="text-gray-700">
            You'll need your price per unit, your variable cost per unit (cost
            that changes with each sale), and your total fixed costs (like rent,
            salaries, or software). With those, the calculator can estimate units and
            sales dollars required to break even.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            Can I use this for services, not just physical products?
          </h3>
          <p className="text-gray-700">
            Yes. You can treat your "unit" as a service package, project, or
            billable hour. As long as you know your average price, variable costs per
            unit of work, and fixed overhead, this calculator can help you find your
            break-even point for almost any business model.
          </p>
        </div>
      </section>

      {/* INTERNAL LINKS */}
      <section className="space-y-4">
        <p className="text-gray-700">
          After you know your break-even point, you can use our{" "}
          <Link href="/roi" className="underline text-emerald-700">
            ROI Calculator
          </Link>{" "}
          to compare profit potential or our{" "}
          <Link href="/freelancer-rate" className="underline text-emerald-700">
            Freelancer Rate Calculator
          </Link>{" "}
          if you're pricing services instead of physical products.
        </p>
      </section>

      {/* BOTTOM CTA */}
      <section className="text-center space-y-3 pb-8">
        <p className="text-gray-700">Want more pricing and margin tools?</p>
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
        id="break-even-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is a break-even point?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "The break-even point is where your total revenue equals your total costs, so there is no profit and no loss. This calculator uses your price, variable costs, and fixed costs to show how many units and how much revenue you need to cover your costs.",
                },
              },
              {
                "@type": "Question",
                name: "What information do I need to use this break-even calculator?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "To use the break-even calculator you need your price per unit, variable cost per unit, and total fixed costs. With those three inputs the calculator can estimate both the units and sales dollars required to break even.",
                },
              },
              {
                "@type": "Question",
                name: "Can I use this break-even calculator for services?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Yes. You can treat a unit as a service package, project, or billable hour. As long as you know your average price, variable costs per unit of work, and fixed overhead, the break-even calculator can be used for service businesses, freelancers, agencies, and more.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
