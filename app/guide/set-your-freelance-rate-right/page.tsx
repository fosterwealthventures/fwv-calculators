import type { Metadata } from "next";
import Link from "next/link";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";

export const metadata: Metadata = {
  title:
    "Set Your Freelancer Rate Right—Use Our Calculator to Avoid Undervaluing Your Time",
  description:
    "Learn how to calculate the right hourly and project rates to meet income goals and cover expenses as a freelancer.",
};

function Breadcrumb() {
  return (
    <nav className="mb-4 text-sm text-gray-600">
      <Link href="/" className="text-brand-green hover:underline">Home</Link>{" "}
      &rsaquo;{" "}
      <Link href="/guide" className="text-brand-green hover:underline">Guides</Link>{" "}
      &rsaquo; <span>Set Your Freelancer Rate Right</span>
    </nav>
  );
}

export default function GuidePage() {
  const pageUrl =
    "https://www.fosterwealthventures.com/guide/set-your-freelancer-rate-right";
  const shareTitle = String(metadata.title ?? "");

  const faq = [
    {
      q: "What’s the main takeaway from this guide?",
      a: "Use the calculator to quickly apply concepts and avoid undervaluing your time.",
    },
    {
      q: "How do I apply this in real life?",
      a: "Follow the walkthrough below and then try the calculator with your own numbers.",
    },
  ];

  const howToSteps = [
    "Skim summary",
    "Review concepts",
    "Follow walkthrough",
    "Try the calculator",
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: shareTitle,
    description:
      "Learn how to calculate the right hourly and project rates to meet income goals and cover expenses as a freelancer.",
    mainEntityOfPage: pageUrl,
    dateModified: "2025-09-20T21:27:38Z",
    publisher: { "@type": "Organization", name: "Foster Wealth Ventures" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to apply Set Your Freelancer Rate Right",
    step: howToSteps.map((n, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: n,
    })),
  };

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />

      <GuideHero
        title="Set Your Freelancer Rate Right"
        subtitle="A concise walkthrough with examples, pitfalls, and the matching calculator."
        icon={null}
      />

      <p className="mt-3 text-sm text-gray-600">Estimated reading time: 3–4 minutes</p>

      <section>
        <CTAButton href="/?calc=freelancer-rate">
          👉 Try the matching calculator
        </CTAButton>
      </section>

      <section>
        <h2>Related Guides</h2>
        <ul>
          <li>
            <Link href="/guide/roi-vs-annualized-roi">ROI vs Annualized ROI</Link>
          </li>
          <li>
            <Link href="/guide/break-even-made-simple">Break-Even Made Simple</Link>
          </li>
        </ul>
      </section>

      <div className="mt-6 not-prose">
        <SocialShare url={pageUrl} title={shareTitle} />
      </div>

      <GuideNav
        prev={{
          href: "/guide/simple-vs-compound-interest",
          title: "Simple vs Compound Interest",
        }}
        next={{
          href: "/guide/5-costly-calculator-mistakes",
          title: "5 Costly Calculator Mistakes",
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </main>
  );
}
