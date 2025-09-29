import type { Metadata } from "next";
import Link from "next/link";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";

export const metadata: Metadata = {
  title:
    "ROI vs Annualized ROI—How to Read Them & Boost Your Investment Strategy",
  description:
    "Learn the difference between ROI and annualized ROI and how to use both to evaluate investments effectively.",
};

function Breadcrumb() {
  return (
    <nav className="mb-4 text-sm text-gray-600">
      <Link href="/" className="text-brand-green hover:underline">Home</Link>{" "}
      &rsaquo;{" "}
      <Link href="/guide" className="text-brand-green hover:underline">Guides</Link>{" "}
      &rsaquo; <span>ROI vs Annualized ROI</span>
    </nav>
  );
}

export default function GuidePage() {
  const pageUrl =
    "https://www.fosterwealthventures.com/guide/roi-vs-annualized-roi";
  const shareTitle = String(metadata.title ?? "");

  const faq = [
    {
      q: "What’s the main takeaway from ROI vs Annualized ROI?",
      a: "Use the paired calculator to apply concepts and avoid pitfalls we list in this guide.",
    },
    {
      q: "How do I apply this in real life?",
      a: "Follow the walkthrough below and then try the calculator with your own numbers.",
    },
  ];

  const howToSteps = [
    "Skim the Quick Summary.",
    "Review formulas.",
    "Follow walkthrough.",
    "Click the calculator.",
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: shareTitle,
    description:
      "Learn the difference between ROI and annualized ROI and how to use both to evaluate investments effectively.",
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
    name: "How to apply ROI vs Annualized ROI",
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
        title="ROI vs Annualized ROI"
        subtitle="A concise walkthrough with examples, pitfalls, and the matching calculator."
        icon={null}
      />

      <p className="mt-3 text-sm text-gray-600">Estimated reading time: 3–4 minutes</p>

      <section>
        <CTAButton href="/?calc=roi">👉 Try the matching calculator</CTAButton>
      </section>

      <section>
        <h2>Related Guides</h2>
        <ul>
          <li><Link href="/guide/break-even-made-simple">Break-Even Made Simple</Link></li>
          <li><Link href="/guide/mortgage-payment-breakdown">Mortgage Payment Breakdown</Link></li>
        </ul>
      </section>

      <div className="mt-6 not-prose">
        <SocialShare url={pageUrl} title={shareTitle} />
      </div>

      <GuideNav
        next={{ href: "/guide/break-even-made-simple", title: "Break-Even Made Simple" }}
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
