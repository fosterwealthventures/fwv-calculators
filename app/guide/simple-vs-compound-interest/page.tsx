import type { Metadata } from "next";
import Link from "next/link";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";

export const metadata: Metadata = {
  title:
    "Simple vs Compound Interest—Which One Grows Your Money Faster? Try Our Calculator",
  description:
    "Compare simple and compound interest to see which method accelerates your savings growth.",
};

function Breadcrumb() {
  return (
    <nav className="mb-4 text-sm text-gray-600">
      <Link href="/" className="text-brand-green hover:underline">
        Home
      </Link>{" "}
      &rsaquo;{" "}
      <Link href="/guide" className="text-brand-green hover:underline">
        Guides
      </Link>{" "}
      &rsaquo; <span>Simple vs Compound Interest</span>
    </nav>
  );
}

export default function GuidePage() {
  const pageUrl =
    "https://www.fosterwealthventures.com/guide/simple-vs-compound-interest";

  const faq = [
    {
      q: "What’s the main takeaway from Simple vs Compound Interest?",
      a: "Use the paired calculator to quickly apply the concepts, and watch for the pitfalls we list in this guide.",
    },
    {
      q: "How do I apply this in real life?",
      a: "Follow the step-by-step walkthrough below and then try the CTA calculator to see results with your own numbers.",
    },
  ];

  const howToSteps = [
    "Skim the Quick Summary to orient yourself.",
    "Review the core concepts and formulas.",
    "Follow the walkthrough steps in order.",
    "Click the CTA button to open the matching calculator.",
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Simple vs Compound Interest—Which One Grows Your Money Faster? Try Our Calculator",
    description:
      "Compare simple and compound interest to see which method accelerates your savings growth.",
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
    name: "How to apply Simple vs Compound Interest",
    step: howToSteps.map((name, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name,
    })),
  };

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />

      <GuideHero
        title="Simple vs Compound Interest"
        subtitle="A concise walkthrough with examples, pitfalls, and the matching calculator."
        icon={null}
      />

      <p className="mt-3 text-sm text-gray-600">
        Estimated reading time: 3–4 minutes
      </p>

      <section>
        <h2>Quick Summary</h2>
        <p>
          Compare simple and compound interest to see which method accelerates
          your savings growth.
        </p>
      </section>

      <section>
        <CTAButton href="/?calc=interest">
          👉 Try the matching calculator
        </CTAButton>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul>
          <li>Key idea #1 relevant to Simple vs Compound Interest.</li>
          <li>Key idea #2 with a short explanation.</li>
          <li>Key idea #3 with a tip or caution.</li>
        </ul>
      </section>

      <section>
        <h2>Walkthrough</h2>
        <ol>
          <li>Enter your inputs into the calculator.</li>
          <li>Adjust settings to match your scenario.</li>
          <li>Review outputs and compare alternatives.</li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul>
          <li>Avoid misinterpreting the base numbers or time horizon.</li>
          <li>Make sure rates/percentages are entered correctly.</li>
          <li>Remember taxes/fees or edge-case assumptions if applicable.</li>
        </ul>
      </section>

      <section>
        <CTAButton href="/?calc=interest">
          👉 Open the calculator again
        </CTAButton>
      </section>

      <section>
        <h2>Related Guides</h2>
        <ul>
          <li>
            <Link href="/guide/roi-vs-annualized-roi">
              ROI vs Annualized ROI
            </Link>
          </li>
          <li>
            <Link href="/guide/break-even-made-simple">
              Break-Even Made Simple
            </Link>
          </li>
        </ul>
      </section>

      <div className="not-prose mt-6">
        <SocialShare
          url={pageUrl}
          title="Simple vs Compound Interest—Which One Grows Your Money Faster? Try Our Calculator"
        />
      </div>

      <GuideNav
        prev={{
          href: "/guide/mortgage-payment-breakdown",
          title: "Mortgage Payment Breakdown",
        }}
        next={{
          href: "/guide/set-your-freelancer-rate-right",
          title: "Set Your Freelancer Rate Right",
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
