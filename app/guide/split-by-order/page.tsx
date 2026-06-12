import GuideNav from "@/components/GuideNav";
import { CTAButton, GuideHero, SocialShare } from "@/components/GuideParts";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Split by Order Guide",
    description: "Split the restaurant bill exactly by what each person ordered.",
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
            &rsaquo; <span>Split by Order</span>
        </nav>
    );
}

export default function GuidePage() {
    const pageUrl =
        "https://fosterwealthventures.store/guide/split-by-order";
    const shareTitle = String(metadata.title ?? "");

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: shareTitle,
        description: "Split the restaurant bill exactly by what each person ordered.",
        mainEntityOfPage: pageUrl,
        dateModified: "2025-10-21T00:00:00Z",
        publisher: { "@type": "Organization", name: "Foster Wealth Ventures" },
    };

    return (
        <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
            <Breadcrumb />

            <GuideHero
                title="Split by Order — Guide"
                subtitle="Split the restaurant bill exactly by what each person ordered."
                icon={null}
            />

            <p className="mt-3 text-sm text-gray-600">Estimated reading time: 2 minutes</p>

            <section>
                <h2>What it does</h2>
                <p>
                    Calculates exact per-person totals based on what each person ordered, including shared appetizers and proper tax/tip distribution.
                </p>
            </section>

            <section>
                <h2>Inputs</h2>
                <ul>
                    <li>Items assigned to each person</li>
                    <li>Shared items (appetizers, etc.)</li>
                    <li>Tax Rate</li>
                    <li>Tip Percentage</li>
                </ul>
            </section>

            <section>
                <h2>Output</h2>
                <ul>
                    <li>Exact per-person total</li>
                    <li>Shared item distribution</li>
                    <li>Tax and tip breakdowns</li>
                </ul>
            </section>

            <section>
                <h2>Example</h2>
                <p>Person A: $25, Person B: $35, Shared apps: $20, 8% tax, 20% tip → Person A pays $42, Person B pays $52</p>
            </section>

            <section>
                <h2>Tip</h2>
                <p>Perfect for groups with different ordering habits or when someone ordered more expensive items.</p>
            </section>

            <section>
                <CTAButton href="/calculators/split-by-order" data-testid="try-matching-calc">
                    Open the Split by Order calculator
                </CTAButton>
            </section>

            <div className="mt-6 not-prose">
                <SocialShare url={pageUrl} title={shareTitle} />
            </div>

            <GuideNav
                prev={{
                    href: "/guide/shopping-budget",
                    title: "Shopping Budget",
                }}
                next={{
                    href: "/guide/savings-growth",
                    title: "Savings Growth",
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
        </main>
    );
}
