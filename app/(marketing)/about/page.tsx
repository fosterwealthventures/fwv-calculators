export const metadata = { title: "About Us — Foster Wealth Ventures" };
import Breadcrumb from "@/components/Breadcrumb";
export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <Breadcrumb trail={[{ href: "/about", label: "About" }]} />
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-purple-title">
        About Foster Wealth Ventures
      </h1>
      <p className="text-gray-700">
        Foster Wealth Ventures (FWV) builds clear, trustworthy business &
        financial tools for everyday decision-making. Our calculator suites
        cover ROI, Break-Even, Mortgage, Interest (Simple & Compound),
        Freelancer Rate, and more—designed to be fast, accurate, and easy to
        understand.
      </p>
      <section className="mt-8 rounded-xl border border-brand-gold/30 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-brand-green">
          Our Approach to Stewardship
        </h2>
        <p className="mt-3 text-gray-700">
          We believe financial tools should help people steward resources with
          wisdom and integrity.
        </p>
        <blockquote className="mt-4 border-l-4 border-brand-gold/50 pl-4 italic text-gray-700">
          “Moreover, it is required of stewards that they be found faithful.”
          <span className="mt-2 block text-sm font-semibold not-italic text-brand-green">
            — 1 Corinthians 4:2
          </span>
        </blockquote>
      </section>

      <p className="text-gray-700">
        We believe financial clarity should be accessible. That’s why our free
        tools are ad-supported, with optional Pro features planned for advanced
        scenarios.
      </p>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-brand-green">
          What Makes Us Different
        </h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Plain-language explanations next to results</li>
          <li>Transparent formulas and assumptions</li>
          <li>Consistent UX with clear inputs/outputs</li>
        </ul>
      </section>
    </main>
  );
}
