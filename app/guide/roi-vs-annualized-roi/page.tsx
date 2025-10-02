import type { Metadata } from "next";
import Link from "next/link";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";

export const metadata: Metadata = {
  title: "ROI vs Annualized ROI — Guide",
  description:
    "Understand ROI vs Annualized ROI, the calculator inputs/outputs, step-by-step usage, examples, and pitfalls to avoid.",
};

function Breadcrumb() {
  return (
    <nav className="mb-4 text-sm text-gray-600">
      <Link href="/" className="text-brand-green hover:underline">Home</Link> ›{" "}
      <Link href="/guide" className="text-brand-green hover:underline">Guides</Link> ›{" "}
      <span>ROI vs Annualized ROI</span>
    </nav>
  );
}

export default function GuidePage() {
  const pageUrl =
    "https://www.fosterwealthventures.com/guide/roi-vs-annualized-roi";

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />

      <GuideHero
        title="ROI vs Annualized ROI"
        subtitle="What the calculator needs, what it returns, and how to compare opportunities fairly."
        minTier="free"
      />

      <p className="mt-3 text-sm text-gray-600">Estimated reading time: 4–5 minutes</p>

      <section>
        <h2>Quick Summary</h2>
        <p>
          <strong>ROI</strong> measures your total percentage gain/loss vs. what you paid.
          <strong> Annualized ROI</strong> converts that result into a yearly rate so different
          holding periods are comparable. Use ROI when time frames match; use Annualized ROI when they don’t.
        </p>
      </section>

      <section>
        <CTAButton href="/?calc=roi">👉 Try the matching calculator</CTAButton>
      </section>

      <section>
        <h2>Inputs</h2>
        <ul>
          <li><strong>Initial Cost</strong> — purchase price + fees.</li>
          <li><strong>Ending/Current Value</strong> — sale proceeds or current value.</li>
          <li><strong>Holding Period</strong> — start & end dates (or months/years).</li>
          <li>Optional: recurring fees or one-time costs that affect net return.</li>
        </ul>
      </section>

      <section>
        <h2>Outputs</h2>
        <ul>
          <li><strong>ROI (%)</strong> = (Ending − Cost) ÷ Cost.</li>
          <li><strong>Annualized ROI (%/yr)</strong> ≈ (Ending ÷ Cost)^(1/Years) − 1.</li>
          <li><strong>Gain / Loss ($)</strong> and exact <strong>time held</strong>.</li>
        </ul>
      </section>

      <section>
        <h2>Step-by-Step</h2>
        <ol>
          <li>Enter cost and ending value (include fees).</li>
          <li>Select the precise dates to capture the true time held.</li>
          <li>Read ROI and Annualized ROI; compare scenarios (fees, timing).</li>
          <li>Use Annualized ROI to compare opportunities with different durations.</li>
        </ol>
      </section>

      <section>
        <h2>Example</h2>
        <p>
          Pay <strong>$8,000</strong>; sell later for <strong>$9,560</strong> after ~1.5 years.
          ROI = (9,560 − 8,000) ÷ 8,000 = <strong>19.5%</strong>. Annualized ROI ≈
          (9,560 ÷ 8,000)^(1/1.5) − 1 ≈ <strong>12.1%/yr</strong>.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul>
          <li>Ignoring fees/taxes that shrink real returns.</li>
          <li>Comparing a short ROI to a long ROI without annualizing the short one.</li>
          <li>Treating ROI as a forecast—it’s a <em>measurement</em>, not a prediction.</li>
        </ul>
      </section>

      <section>
        <CTAButton href="/?calc=roi">👉 Open the calculator again</CTAButton>

      </section>

      <section>
        <h2>Related Guides</h2>
        <ul>
          <li><Link href="/guide/break-even-made-simple">Break-Even Made Simple</Link></li>
          <li><Link href="/guide/mortgage-payment-breakdown">Mortgage Payment Breakdown</Link></li>
        </ul>
      </section>

      <div className="not-prose mt-6">
        <SocialShare url={pageUrl} title="ROI vs Annualized ROI — Guide" />
      </div>

      <GuideNav
        prev={{ href: "/guide/set-your-freelance-rate-right", title: "Set Your Freelancer Rate Right" }}
        next={{ href: "/guide/break-even-made-simple", title: "Break-Even Made Simple" }}
      />
    </main>
  );
}
