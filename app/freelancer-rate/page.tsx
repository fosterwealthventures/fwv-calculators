import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title:
    "Freelancer Rate Calculator – Set Your Hourly Rate with Confidence (Free)",
  description:
    "Use this free freelancer rate calculator to set your hourly or project rate. Factor in expenses, taxes, billable hours, and income goals so you stop undercharging.",
  alternates: {
    canonical: "https://calculators.fosterwealthventures.com/freelancer-rate",
  },
  openGraph: {
    title: "Freelancer Rate Calculator – Free Pricing Tool",
    description:
      "Set your freelance rates with confidence. This free calculator helps you price your services based on real expenses, taxes, and income goals.",
    url: "https://calculators.fosterwealthventures.com/freelancer-rate",
    siteName: "FWV Calculators",
    type: "website",
  },
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
        <h2 className="text-2xl font-semibold">Freelancer Rate Calculator FAQ</h2>

        <div className="space-y-3">
          <h3 className="font-semibold">What does this freelancer rate calculator do?</h3>
          <p className="text-gray-700">
            This calculator helps you set a realistic hourly or project rate by
            factoring in your business expenses, taxes, billable hours, and income
            goals. Instead of guessing, you'll see what you actually need to
            charge to hit your target annual income.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            What information do I need to use this rate calculator?
          </h3>
          <p className="text-gray-700">
            You'll want a rough idea of your monthly or annual expenses, your
            desired income, your estimated tax rate, and how many hours you can
            realistically bill each week. The calculator uses this to estimate a
            baseline hourly rate and optional project rate.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            Can I use this for both hourly and project pricing?
          </h3>
          <p className="text-gray-700">
            Yes. Start by finding a sustainable hourly rate. From there, you can
            estimate project pricing by multiplying your hourly rate by the number of
            hours a project will take, plus a buffer for admin, revisions, and scope
            creep.
          </p>
        </div>
      </section>

      {/* INTERNAL LINKS */}
      <section className="space-y-4">
        <p className="text-gray-700">
          Once you've set your rate, you can use our{" "}
          <Link href="/roi" className="underline text-emerald-700">
            ROI Calculator
          </Link>{" "}
          to see whether your projects are worth the effort, or our{" "}
          <Link href="/break-even" className="underline text-emerald-700">
            Break-Even Calculator
          </Link>{" "}
          if you're launching new services or offers.
        </p>
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

      {/* FAQ SCHEMA */}
      <Script
        id="freelancer-rate-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What does this freelancer rate calculator do?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "The freelancer rate calculator helps you set a realistic hourly or project rate by factoring in your expenses, billable hours, taxes, and income goals so you stop undercharging for your work.",
                },
              },
              {
                "@type": "Question",
                name: "What information do I need to use this rate calculator?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "To use the freelancer rate calculator you should know your estimated business expenses, desired annual income, typical billable hours per week, and an approximate tax rate. The calculator uses this to estimate a sustainable hourly rate.",
                },
              },
              {
                "@type": "Question",
                name: "Can I use this freelancer rate calculator for both hourly and project pricing?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Yes. You can start with a solid hourly rate and then build project pricing by estimating the number of hours a project will take, plus time for admin and revisions, and multiplying by your hourly rate.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
