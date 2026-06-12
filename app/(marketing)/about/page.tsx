import Breadcrumb from "@/components/Breadcrumb";

export const metadata = { title: "About Us - Foster Wealth Ventures" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <Breadcrumb trail={[{ href: "/about", label: "About" }]} />
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-purple-title">
        About Foster Wealth Ventures
      </h1>
      <p className="text-gray-700">
        Foster Wealth Ventures (FWV) builds clear, trustworthy financial tools
        for everyday decision-making. This refocused calculator site helps
        people run useful numbers around credit, debt payoff, real estate, and
        practical shared expenses before taking the next step.
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
          "Moreover, it is required of stewards that they be found faithful."
          <span className="mt-2 block text-sm font-semibold not-italic text-brand-green">
            - 1 Corinthians 4:2
          </span>
        </blockquote>
      </section>

      <p className="text-gray-700">
        We believe financial clarity should be accessible. The focused
        calculators on this site are free to use without extra barriers.
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

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-brand-green">
          Content Policy
        </h2>
        <p className="text-gray-700">
          All content and calculators on Foster Wealth Ventures are created or
          reviewed by our editorial team. We sometimes use AI tools for
          formatting or idea generation, but every piece is personally verified
          for accuracy and clarity before publication.
        </p>
      </section>
    </main>
  );
}
