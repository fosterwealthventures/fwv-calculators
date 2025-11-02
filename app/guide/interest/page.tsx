import GuideNav from "@/components/GuideNav";
import { CTAButton, GuideHero, SocialShare } from "@/components/GuideParts";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Interest (Simple/Compound) Guide",
    description: "Compare simple vs. compound interest over time.",
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
            &rsaquo; <span>Interest (Simple/Compound)</span>
        </nav>
    );
}

export default function GuidePage() {
    const pageUrl =
        "https://fosterwealthventures.store/guide/interest";
    const shareTitle = String(metadata.title ?? "");

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: shareTitle,
        description: "Compare simple vs. compound interest over time.",
        mainEntityOfPage: pageUrl,
        dateModified: "2025-10-21T00:00:00Z",
        publisher: { "@type": "Organization", name: "Foster Wealth Ventures" },
    };

    return (
        <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
            <Breadcrumb />

            <GuideHero
                title="Interest (Simple/Compound) — Guide"
                subtitle="Compare simple vs. compound interest over time."
                icon={null}
            />

            <p className="mt-3 text-sm text-gray-600">Estimated reading time: 2 minutes</p>

            <section>
                <h2>What it does</h2>
                <p>
                    Shows how money grows with simple vs. compound interest, helping you understand the power of compounding.
                </p>
            </section>

            <section>
                <h2>Inputs</h2>
                <ul>
                    <li>Principal (initial amount)</li>
                    <li>Interest Rate (annual)</li>
                    <li>Time period</li>
                    <li>Compounding frequency</li>
                </ul>
            </section>

            <section>
                <h2>Output</h2>
                <ul>
                    <li>Interest earned</li>
                    <li>Total balance</li>
                    <li>Comparison chart</li>
                </ul>
            </section>

            <section>
                <h2>Example</h2>
                <p>$10,000 at 5% for 10 years → Simple: $15,000, Compound: $16,289</p>
            </section>

            <section>
                <h2>Tip</h2>
                <p>Start early to maximize compound interest - even small differences in rates matter over time.</p>
            </section>

            <section>
                <CTAButton href="/calculators/interest" data-testid="try-matching-calc">
                    Open the Interest calculator
                </CTAButton>
            </section>

            <div className="mt-6 not-prose">
                <SocialShare url={pageUrl} title={shareTitle} />
            </div>

            <GuideNav
                prev={{
                    href: "/guide/mortgage",
                    title: "Mortgage",
                }}
                next={{
                    href: "/guide/freelancer-rate",
                    title: "Freelancer Rate",
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
        </main>
    );
}
