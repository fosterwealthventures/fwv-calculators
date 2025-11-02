import GuideNav from "@/components/GuideNav";
import { CTAButton, GuideHero, SocialShare } from "@/components/GuideParts";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Freelancer Rate Guide",
    description: "Back into an hourly/day rate that covers costs and target income.",
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
            &rsaquo; <span>Freelancer Rate</span>
        </nav>
    );
}

export default function GuidePage() {
    const pageUrl =
        "https://fosterwealthventures.store/guide/freelancer-rate";
    const shareTitle = String(metadata.title ?? "");

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: shareTitle,
        description: "Back into an hourly/day rate that covers costs and target income.",
        mainEntityOfPage: pageUrl,
        dateModified: "2025-10-21T00:00:00Z",
        publisher: { "@type": "Organization", name: "Foster Wealth Ventures" },
    };

    return (
        <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
            <Breadcrumb />

            <GuideHero
                title="Freelancer Rate — Guide"
                subtitle="Back into an hourly/day rate that covers costs and target income."
                icon={null}
            />

            <p className="mt-3 text-sm text-gray-600">Estimated reading time: 2 minutes</p>

            <section>
                <h2>What it does</h2>
                <p>
                    Helps freelancers calculate their ideal hourly or daily rate based on desired income, expenses, and work hours.
                </p>
            </section>

            <section>
                <h2>Inputs</h2>
                <ul>
                    <li>Desired Annual Income</li>
                    <li>Business Expenses</li>
                    <li>Billable Hours per Week</li>
                    <li>Weeks Worked per Year</li>
                </ul>
            </section>

            <section>
                <h2>Output</h2>
                <ul>
                    <li>Target hourly rate</li>
                    <li>Target daily rate</li>
                </ul>
            </section>

            <section>
                <h2>Example</h2>
                <p>$80,000 target income, $10,000 expenses, 30 hours/week → $58/hour</p>
            </section>

            <section>
                <h2>Tip</h2>
                <p>Don't forget to account for non-billable time like admin, marketing, and professional development.</p>
            </section>

            <section>
                <CTAButton href="/calculators/freelancer-rate" data-testid="try-matching-calc">
                    Open the Freelancer Rate calculator
                </CTAButton>
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
                    title: "Tip & Tab Split",
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
        </main>
    );
}
