import GuideNav from "@/components/GuideNav";
import { CTAButton, GuideHero, SocialShare } from "@/components/GuideParts";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Tip & Tab Split Guide",
    description: "Split a bill and tips fairly across diners.",
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
            &rsaquo; <span>Tip & Tab Split</span>
        </nav>
    );
}

export default function GuidePage() {
    const pageUrl =
        "https://www.fosterwealthventures.com/guide/tip-and-tab-split";
    const shareTitle = String(metadata.title ?? "");

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: shareTitle,
        description: "Split a bill and tips fairly across diners.",
        mainEntityOfPage: pageUrl,
        dateModified: "2025-10-21T00:00:00Z",
        publisher: { "@type": "Organization", name: "Foster Wealth Ventures" },
    };

    return (
        <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
            <Breadcrumb />

            <GuideHero
                title="Tip & Tab Split — Guide"
                subtitle="Split a restaurant bill and tips fairly across diners."
                icon={null}
            />

            <p className="mt-3 text-sm text-gray-600">Estimated reading time: 2 minutes</p>

            <section>
                <h2>What it does</h2>
                <p>
                    Calculates how much each person should pay when splitting a restaurant bill, including tax and tip.
                </p>
            </section>

            <section>
                <h2>Inputs</h2>
                <ul>
                    <li>Total Bill Amount</li>
                    <li>Tax Rate</li>
                    <li>Tip Percentage</li>
                    <li>Number of People</li>
                </ul>
            </section>

            <section>
                <h2>Output</h2>
                <ul>
                    <li>Per-person totals</li>
                    <li>Subtotal, tax, and tip breakdowns</li>
                </ul>
            </section>

            <section>
                <h2>Example</h2>
                <p>$200 bill, 8% tax, 20% tip, 4 people → $67.50 per person</p>
            </section>

            <section>
                <h2>Tip</h2>
                <p>For uneven splits, consider using the Split by Order calculator for more precise calculations.</p>
            </section>

            <section>
                <CTAButton href="/calculators/tip-and-tab-split" data-testid="try-matching-calc">
                    Open the Tip & Tab Split calculator
                </CTAButton>
            </section>

            <div className="mt-6 not-prose">
                <SocialShare url={pageUrl} title={shareTitle} />
            </div>

            <GuideNav
                prev={{
                    href: "/guide/freelancer-rate",
                    title: "Freelancer Rate",
                }}
                next={{
                    href: "/guide/shopping-budget",
                    title: "Shopping Budget",
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
        </main>
    );
}