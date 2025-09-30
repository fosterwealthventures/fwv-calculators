import type { Metadata } from "next";
import Link from "next/link";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";

export const metadata: Metadata = {
  title:
    "Break-Even Made Simple—Use Our Calculator to Master Costs & Profit Margins",
  description:
    "Understand break-even analysis and how to calculate the units needed to cover costs and reach profitability.",
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
      &rsaquo; <span>Break-Even Made Simple</span>
    </nav>
  );
}

export default function GuidePage() {
  const pageUrl =
    "https://www.fosterwealthventures.com/guide/break-even-made-simple";

  // … (faq, howToSteps, schema definitions unchanged)

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />

      <GuideHero
        title="Break-Even Made Simple"
        subtitle="A concise walkthrough with examples, pitfalls, and the matching calculator."
        icon={null}
      />

      <p className="mt-3 text-sm text-gray-600">
        Estimated reading time: 3–4 minutes
      </p>

      <section>
        <h2>Quick Summary</h2>
        <p>
          Understand break-even analysis and how to calculate the units needed
          to cover costs and reach profitability.
        </p>
      </section>

      <section>
        <CTAButton href="/?calc=break-even">
          👉 Try the matching calculator
        </CTAButton>
      </section>

      {/* … core content unchanged … */}

      <section>
        <h2>Related Guides</h2>
        <ul>
          <li>
            <Link href="/guide/roi-vs-annualized-roi">
              ROI vs Annualized ROI
            </Link>
          </li>
          <li>
            <Link href="/guide/mortgage-payment-breakdown">
              Mortgage Payment Breakdown
            </Link>
          </li>
        </ul>
      </section>

      <div className="mt-6 not-prose">
        <SocialShare url={pageUrl} title={String(metadata.title ?? "")} />
        <title>
          Break-Even Made Simple—Use Our Calculator to Master Costs & Profit
          Margins
        </title>
      </div>

      <GuideNav
        prev={{
          href: "/guide/roi-vs-annualized-roi",
          title: "ROI vs Annualized ROI",
        }}
        next={{
          href: "/guide/mortgage-payment-breakdown",
          title: "Mortgage Payment Breakdown",
        }}
      />

      {/* JSON-LD scripts unchanged */}
    </main>
  );
}
