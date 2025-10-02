import type { Metadata } from "next";
import Link from "next/link";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";

export const metadata: Metadata = {
  title: "Simple vs Compound Interest — Guide",
  description:
    "Compare simple and compound interest with plain-language examples. Learn which grows faster and why frequency matters.",
};

function Breadcrumb() {
  return (
    <nav className="mb-4 text-sm text-gray-600">
      <Link href="/" className="text-brand-green hover:underline">Home</Link> ›{" "}
      <Link href="/guide" className="text-brand-green hover:underline">Guides</Link> ›{" "}
      <span>Simple vs Compound Interest</span>
    </nav>
  );
}

export default function GuidePage() {
  const pageUrl =
    "https://www.fosterwealthventures.com/guide/simple-vs-compound-interest";

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />

      <GuideHero
        title="Simple vs Compound Interest"
        subtitle="See how compounding accelerates growth and when a simple calculation is good enough."
        minTier="free"
      />

      <p className="mt-3 text-sm text-gray-600">Estimated reading time: 3–4 minutes</p>

      <section>
        <h2>Quick Summary</h2>
        <ul>
          <li><strong>Simple interest</strong> = Principal × Rate × Time</li>
          <li><strong>Compound interest</strong> grows on the original principal <em>and</em> accumulated interest.</li>
          <li>More frequent compounding ⇒ slightly faster growth at the same APR.</li>
        </ul>
      </section>

      <section>
        <CTAButton href="/?calc=interest">👉 Try the matching calculator</CTAButton>
      </section>

      <section>
        <h2>Inputs</h2>
        <ul>
          <li><strong>Principal</strong> — starting amount.</li>
          <li><strong>Rate (APR)</strong> — yearly percentage rate.</li>
          <li><strong>Time</strong> — years or months.</li>
          <li><strong>Compounding frequency</strong> — yearly, quarterly, monthly, daily; or “simple”.</li>
          <li>Optional recurring contribution for compound scenarios.</li>
        </ul>
      </section>

      <section>
        <h2>Outputs</h2>
        <ul>
          <li><strong>Total interest</strong> and <strong>ending balance</strong> for each method.</li>
          <li>Side-by-side comparison and growth chart.</li>
        </ul>
      </section>

      <section>
        <h2>Example</h2>
        <p>
          $5,000 for 3 years at 6% APR.
          Simple interest = 5,000 × 0.06 × 3 = <strong>$900</strong>.
          Yearly compounding ≈ $5,000 × (1.06)^3 − 5,000 ≈ <strong>$955</strong> interest.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul>
          <li>Confusing APR with APY (APY includes compounding).</li>
          <li>Mixing months and years inconsistently.</li>
          <li>Ignoring fees that reduce the real return.</li>
        </ul>
      </section>

      <section>
        <CTAButton href="/?calc=interest">👉 Open the calculator again</CTAButton>
      </section>

      <section>
        <h2>Related Guides</h2>
        <ul>
          <li><Link href="/guide/savings-growth">Savings Growth</Link></li>
          <li><Link href="/guide/roi-vs-annualized-roi">ROI vs Annualized ROI</Link></li>
        </ul>
      </section>

      <div className="not-prose mt-6">
        <SocialShare url={pageUrl} title="Simple vs Compound Interest — Guide" />
      </div>

      <GuideNav
        prev={{ href: "/guide/mortgage-payment-breakdown", title: "Mortgage Payment Breakdown" }}
        next={{ href: "/guide/set-your-freelance-rate-right", title: "Set Your Freelancer Rate Right" }}
      />
    </main>
  );
}
