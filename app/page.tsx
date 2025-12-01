"use client";

import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";
import AdSlot from "@/components/ads/AdSlot";
import Link from "next/link";
import Script from "next/script";

export default function Home() {
  return (
    <main className="fwv-container py-6 space-y-10">
      {/* Heading + intro */}
      <section className="space-y-3">
        <h1 className="text-4xl font-extrabold text-purple-title">
          Foster Wealth Calculators
        </h1>
        <p className="mt-1 text-plum-900 dark:text-plum-100/80 max-w-2xl">
          Start with the free calculators below. Upgrade any time to unlock
          Savings Growth, Debt Payoff, Employee Cost Pro, and Expense Split
          Deluxe in FWV Plus & Pro.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/dashboard" className="btn-regal">
            See all calculators
          </Link>
          <Link href="/guide" className="btn-ghost-regal">
            Learn how each calculator works
          </Link>
        </div>
      </section>

      {/* Scripture */}
      <section>
        <div className="card-regal p-5 shadow-md">
          <blockquote className="text-base md:text-lg font-semibold italic text-plum-800 dark:text-plum-100">
            "The plans of the diligent lead surely to abundance, but everyone who
            is hasty comes only to poverty."
          </blockquote>
          <div className="mt-2 text-base font-bold text-aure-600 dark:text-aure-400">
            - Proverbs 21:5
          </div>
        </div>
      </section>

      {/* Free-only calculators on Home */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-purple-title">
          Free Money Calculators
        </h2>
        <p className="text-sm text-plum-900/80 dark:text-plum-100/70 max-w-3xl">
          These calculators are completely free to use - no sign-up required.
          Use them to stress-test big decisions, check affordability, and plan
          your next move before you spend a dollar.
        </p>
        <FosterWealthCalculators freeOnly />
        <div className="pt-4">
          <AdSlot containerId="adsterra-home-free" />
        </div>
      </section>

      {/* Explainer / positioning */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-purple-title">
          Your Money Tools Hub for Everyday Life & Business
        </h2>
        <p className="text-plum-900/90 dark:text-plum-100/80 max-w-4xl">
          FWV Calculators is designed for real decisions: homebuyers checking
          monthly payments, freelancers setting rates, small business owners
          tracking profitability, and households trying not to blow the
          shopping budget. Each calculator focuses on a single money question,
          with clear inputs and instant results.
        </p>
        <p className="text-plum-900/90 dark:text-plum-100/80 max-w-4xl">
          When you're ready for deeper planning, FWV Plus and Pro unlock
          premium tools like Savings Growth, Debt Payoff, Employee Cost Pro,
          and Expense Split Deluxe so you can see the long-term impact of your
          choices - not just today's numbers.
        </p>
      </section>

      {/* Quick link clusters */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="card-regal p-5 space-y-2">
          <h3 className="font-semibold text-purple-title">Everyday Money</h3>
          <p className="text-sm text-plum-900/80 dark:text-plum-100/80">
            Plan purchases, protect your budget, and avoid surprises.
          </p>
          <ul className="text-sm space-y-1 text-plum-900 dark:text-plum-100">
            <li>
              <Link href="/mortgage" className="underline">
                Mortgage Calculator
              </Link>
            </li>
            <li>
              <Link href="/shopping-budget" className="underline">
                Shopping Budget Calculator
              </Link>
            </li>
            <li>
              <Link href="/tip-split" className="underline">
                Tip & Tab Split Calculator
              </Link>
            </li>
            <li>
              <Link href="/interest" className="underline">
                Interest (Simple/Compound)
              </Link>
            </li>
          </ul>
        </div>

        <div className="card-regal p-5 space-y-2">
          <h3 className="font-semibold text-purple-title">
            Business & Side Hustles
          </h3>
          <p className="text-sm text-plum-900/80 dark:text-plum-100/80">
            See the numbers behind your offers, projects, and hiring decisions.
          </p>
          <ul className="text-sm space-y-1 text-plum-900 dark:text-plum-100">
            <li>
              <Link href="/roi" className="underline">
                ROI Calculator
              </Link>
            </li>
            <li>
              <Link href="/break-even" className="underline">
                Break-Even Calculator
              </Link>
            </li>
            <li>
              <Link href="/freelancer-rate" className="underline">
                Freelancer Rate Calculator
              </Link>
            </li>
            <li>
              <Link href="/employee-cost-pro" className="underline">
                Employee Cost Pro (Pro)
              </Link>
            </li>
          </ul>
        </div>

        <div className="card-regal p-5 space-y-2">
          <h3 className="font-semibold text-purple-title">
            Savings, Debt & Shared Costs
          </h3>
          <p className="text-sm text-plum-900/80 dark:text-plum-100/80">
            Plan ahead, pay off faster, and split fairly.
          </p>
          <ul className="text-sm space-y-1 text-plum-900 dark:text-plum-100">
            <li>
              <Link href="/savings-growth" className="underline">
                Savings Growth (Plus)
              </Link>
            </li>
            <li>
              <Link href="/debt-payoff" className="underline">
                Debt Payoff (Plus)
              </Link>
            </li>
            <li>
              <Link href="/order-split" className="underline">
                Order Split (Plus)
              </Link>
            </li>
            <li>
              <Link href="/expense-split-deluxe" className="underline">
                Expense Split Deluxe (Pro)
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Homepage FAQ */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-purple-title">
          Foster Wealth Calculators FAQ
        </h2>

        <div className="space-y-2">
          <h3 className="font-semibold text-purple-title">
            Are all calculators on this page free?
          </h3>
          <p className="text-plum-900/90 dark:text-plum-100/80">
            The calculators you see in the grid above are free to use here on
            the homepage. FWV Plus and Pro unlock additional premium tools,
            which you can preview from their landing pages or on the dashboard.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-purple-title">
            Do I need to create an account to use these calculators?
          </h3>
          <p className="text-plum-900/90 dark:text-plum-100/80">
            No account is required for the free tools - just open a calculator,
            enter your numbers, and see your results. To use Plus or Pro
            calculators, you'll create an FWV account and choose a plan on
            the Pricing page.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-purple-title">
            How do FWV Plus and FWV Pro work with these calculators?
          </h3>
          <p className="text-plum-900/90 dark:text-plum-100/80">
            FWV Plus and Pro expand what you can do with your numbers. Plus
            adds deeper savings and debt tools, while Pro unlocks advanced
            business calculators like Employee Cost Pro and Expense Split
            Deluxe. You can always start free and upgrade later.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center pb-10 space-y-3">
        <p className="text-plum-900/90 dark:text-plum-100/80 text-lg">
          Ready to go beyond the basics and unlock the full FWV calculator
          suite?
        </p>
        <Link href="/pricing" className="btn-regal">
          Explore FWV Plus & Pro Plans
        </Link>
      </section>

      {/* FAQ Schema for rich results */}
      <Script
        id="fwv-home-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Are all calculators on this page free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "The calculators shown on the homepage are free to use without an account. FWV Plus and Pro unlock additional premium tools that can be previewed from their landing pages or on the main dashboard.",
                },
              },
              {
                "@type": "Question",
                name: "Do I need to create an account to use these calculators?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "You do not need an account for free calculators. An FWV account and paid plan are required to access Plus and Pro calculators.",
                },
              },
              {
                "@type": "Question",
                name: "How do FWV Plus and FWV Pro work with these calculators?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "FWV Plus and Pro add premium calculators on top of the free tools. Plus focuses on savings and debt payoff, while Pro unlocks advanced business tools such as Employee Cost Pro and Expense Split Deluxe.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
