import FreelancerRateCalculator from "@/components/FreelancerRateCalculator";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Freelancer Rate Calculator | Hourly, Day Rate, and Retainer Pricing",
  description:
    "Free freelance rate calculator with taxes, overhead, and realistic billable hours. Get your hourly, day, and monthly retainer rates instantly.",
  alternates: {
    canonical: "https://calculators.fosterwealthventures.com/freelancer-rate",
  },
  openGraph: {
    title: "Freelancer Rate Calculator | Free Pricing Tool",
    description:
      "Set sustainable freelance rates with taxes, overhead, and billable hours baked in. Get hourly, day, and retainer pricing in seconds.",
    url: "https://calculators.fosterwealthventures.com/freelancer-rate",
    siteName: "FWV Calculators",
    type: "website",
  },
};

export default function FreelancerRatePage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      {/* HERO */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Freelancer Rate Calculator</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Price with confidence by baking in taxes, overhead, and realistic billable hours — not wishful thinking.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <a href="#calculator" className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold">
            Calculate My Rate
          </a>
          <Link href="/" className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700">
            Browse All Calculators
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-3">No sign-up required. 100% free to use.</p>
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
              Enter your target take-home income, estimated tax rate, overhead, and billable time to see hourly, day, and monthly retainer rates.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <FreelancerRateCalculator />
        </div>
      </section>

      {/* EDUCATION */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How to use the freelance rate calculator</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><strong>Target take-home income:</strong> What you want to keep after taxes and business expenses.</li>
          <li><strong>Tax rate:</strong> Include federal, state, and self-employment (often 25–40% total).</li>
          <li><strong>Overhead:</strong> Software, insurance, health benefits, marketing, gear, and office costs.</li>
          <li><strong>Billable time:</strong> Realistic hours you can invoice after admin, marketing, and emails.</li>
        </ul>
        <p className="text-gray-700">
          Adjust overhead, billable time, or tax rate to see how your hourly rate shifts for a sustainable freelance business.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Popular uses</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>New freelancers setting their first hourly or day rate with taxes and overhead baked in.</li>
          <li>Agencies sanity-checking subcontractor rates and margins.</li>
          <li>Consultants and creators building retainers and packaged services.</li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Freelancer Rate Calculator FAQ</h2>

        <div className="space-y-3">
          <h3 className="font-semibold">What does this freelancer rate calculator do?</h3>
          <p className="text-gray-700">
            It sets a realistic hourly, day, or project rate by factoring in your business expenses, taxes, billable hours, and income goals so you stop undercharging.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">What information do I need?</h3>
          <p className="text-gray-700">
            Know your estimated expenses, desired take-home income, billable hours per week, and an approximate tax rate. The calculator uses this to estimate sustainable hourly, day, and retainer pricing.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Can I use this for both hourly and project pricing?</h3>
          <p className="text-gray-700">
            Yes. Start with a sustainable hourly rate, then build project pricing by estimating hours plus buffer for admin, revisions, and scope creep, multiplied by your hourly rate.
          </p>
        </div>
      </section>

      {/* INTERNAL LINKS */}
      <section className="space-y-4">
        <p className="text-gray-700">
          Once you’ve set your rate, use our {" "}
          <Link href="/roi" className="underline text-emerald-700">
            ROI Calculator
          </Link>{" "}
          to evaluate projects, or the {" "}
          <Link href="/break-even" className="underline text-emerald-700">
            Break-Even Calculator
          </Link>{" "}
          when launching new services.
        </p>
      </section>

      {/* BOTTOM CTA */}
      <section className="text-center space-y-3 pb-8">
        <p className="text-gray-700">Want more pricing tools?</p>
        <Link href="/" className="inline-flex px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold">
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
                    "The freelancer rate calculator helps you set a realistic hourly, day, or project rate by factoring in your expenses, billable hours, taxes, and income goals so you stop undercharging for your work.",
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
                    "Yes. Start with a solid hourly rate and then build project pricing by estimating the hours a project will take, plus time for admin and revisions, and multiplying by your hourly rate.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
