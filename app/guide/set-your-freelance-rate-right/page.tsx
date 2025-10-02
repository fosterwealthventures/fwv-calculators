import type { Metadata } from "next";
import Link from "next/link";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";

export const metadata: Metadata = {
  title: "Set Your Freelancer Rate Right — Guide",
  description:
    "Turn income goals and real costs into a confident hourly/day/project rate. Avoid undercharging.",
};

function Breadcrumb() {
  return (
    <nav className="mb-4 text-sm text-gray-600">
      <Link href="/" className="text-brand-green hover:underline">Home</Link> ›{" "}
      <Link href="/guide" className="text-brand-green hover:underline">Guides</Link> ›{" "}
      <span>Set Your Freelancer Rate Right</span>
    </nav>
  );
}

export default function GuidePage() {
  const pageUrl =
    "https://www.fosterwealthventures.com/guide/set-your-freelance-rate-right";

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />

      <GuideHero
        title="Set Your Freelancer Rate Right"
        subtitle="Back into your minimum rate using billable hours, overhead, taxes, and profit."
        minTier="free"
      />

      <p className="mt-3 text-sm text-gray-600">Estimated reading time: 3–4 minutes</p>

      <section>
        <h2>Quick Summary</h2>
        <p>
          Your sustainable rate = <strong>(Target take-home + Taxes + Overhead + Profit)</strong> ÷ <strong>Billable hours</strong>.
          The calculator turns those into hourly, day, and baseline project rates.
        </p>
      </section>

      <section>
        <CTAButton href="/?calc=freelancer-rate">👉 Try the matching calculator</CTAButton>
      </section>

      <section>
        <h2>Inputs</h2>
        <ul>
          <li><strong>Target annual take-home</strong> (what you want to pay yourself).</li>
          <li><strong>Estimated tax %</strong> (income + self-employment).</li>
          <li><strong>Overhead</strong> (software, gear, office, insurance, marketing).</li>
          <li><strong>Billable hours</strong> per year (actual hours you can invoice—not total hours worked).</li>
          <li>Optional desired <strong>profit margin</strong> to grow or buffer slow months.</li>
        </ul>
      </section>

      <section>
        <h2>Outputs</h2>
        <ul>
          <li><strong>Baseline hourly rate</strong> (break-even + margin).</li>
          <li><strong>Day rate</strong> and a suggested <strong>minimum project price</strong>.</li>
          <li>Rate ranges for retainers or value-priced proposals.</li>
        </ul>
      </section>

      <section>
        <h2>Step-by-Step</h2>
        <ol>
          <li>Enter take-home goal, tax %, overhead, and billable hours.</li>
          <li>Add a profit margin (e.g., 10–20%) for growth and risk.</li>
          <li>Review the hourly/day/project outputs; sanity-check vs. your market.</li>
          <li>Use scenarios (more/less billable hours, raising prices) to see impact.</li>
        </ol>
      </section>

      <section>
        <h2>Example</h2>
        <p>
          Take-home $80k, taxes 25%, overhead $12k, billable 1,000 hrs, profit 10%.
          Required revenue ≈ $80k / (1 − 0.25) = $106,667. Add overhead + profit → ≈ $129,333.
          Hourly = 129,333 ÷ 1,000 = <strong>$129/hr</strong>. Day rate ≈ <strong>$1,000</strong>.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul>
          <li>Using total hours instead of <em>billable</em> hours.</li>
          <li>Forgetting to include taxes or enough profit cushion.</li>
          <li>Underpricing projects that include significant non-billable work.</li>
        </ul>
      </section>

      <section>
        <CTAButton href="/?calc=freelancer-rate">👉 Open the calculator again</CTAButton>
      </section>

      <section>
        <h2>Related Guides</h2>
        <ul>
          <li><Link href="/guide/break-even-made-simple">Break-Even Made Simple</Link></li>
          <li><Link href="/guide/roi-vs-annualized-roi">ROI vs Annualized ROI</Link></li>
        </ul>
      </section>

      <div className="not-prose mt-6">
        <SocialShare url={pageUrl} title="Set Your Freelancer Rate Right — Guide" />
      </div>

      <GuideNav
        prev={{ href: "/guide/simple-vs-compound-interest", title: "Simple vs Compound Interest" }}
        next={{ href: "/guide/roi-vs-annualized-roi", title: "ROI vs Annualized ROI" }}
      />
    </main>
  );
}
