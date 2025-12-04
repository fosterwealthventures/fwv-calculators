import type { Metadata } from "next";
import Link from "next/link";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";

export const metadata: Metadata = {
  title: "Freelance Rate Calculator Guide: Price Hourly, Day Rates, and Retainers",
  description:
    "Set profitable freelance rates with taxes, overhead, and billable hours baked in. Get hourly, day-rate, and retainer pricing you can defend.",
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
      &rsaquo; <span>Freelance Rate Calculator Guide</span>
    </nav>
  );
}

export default function GuidePage() {
  const pageUrl = "https://fosterwealthventures.store/guide/set-your-freelance-rate-right";
  const shareTitle = String(metadata.title ?? "");

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />
      <GuideHero
        title="Freelance Rate Calculator Guide"
        subtitle="Price hourly, day-rate, and retainer work with taxes, overhead, and realistic billable hours."
        icon={null}
      />

      <p className="mt-3 text-sm text-gray-600">Estimated reading time: 3-4 minutes</p>

      <section>
        <h2>Why this calculator works</h2>
        <p>
          It gross-ups your desired take-home income for taxes, adds business overhead, and divides by realistic billable hours. You get hourly, day-rate, and monthly retainer pricing that protects your margins.
        </p>
      </section>

      <section>
        <h2>Quick setup</h2>
        <ul>
          <li>Desired annual take-home income</li>
          <li>Tax rate (federal, state, self-employment)</li>
          <li>Overhead % (software, insurance, marketing, gear, office)</li>
          <li>Working hours per week + billable % to cover admin/marketing time</li>
          <li>Weeks off for vacation and holidays</li>
        </ul>
        <p className="text-sm text-gray-600">
          Example: $120k take-home, 30% tax, 20% overhead, 30 hrs/week, 4 weeks off, 65% billable → ~$150–$160/hr.
        </p>
      </section>

      <section>
        <h2>Tips to keep rates sustainable</h2>
        <ul>
          <li>Billable hours over ~35/week are hard to sustain long-term.</li>
          <li>Include benefits and equipment refresh in overhead.</li>
          <li>Use retainers or packages to reduce scope creep and context switching.</li>
          <li>Revisit quarterly as taxes, overhead, and demand change.</li>
        </ul>
      </section>

      <section>
        <CTAButton href="/freelancer-rate" data-testid="try-matching-calc">
          Open the Freelancer Rate Calculator
        </CTAButton>
        <p className="text-sm text-gray-600 mt-2">
          No sign-up required. See hourly, day-rate, and retainer pricing instantly.
        </p>
      </section>

      <div className="mt-6 not-prose">
        <SocialShare url={pageUrl} title={shareTitle} />
      </div>

      <GuideNav
        prev={{
          href: "/guide/interest",
          title: "Interest (Simple/Compound)",
        }}
        next={{
          href: "/guide/tip-and-tab-split",
          title: "Tip Split Calculator Guide",
        }}
      />
    </main>
  );
}
