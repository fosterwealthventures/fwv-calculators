import GuideNav from "@/components/GuideNav";
import { CTAButton, GuideHero, SocialShare } from "@/components/GuideParts";
import type { Metadata } from "next";
import Link from "next/link";
import { AdInContent } from "@/components/ads";

export const metadata: Metadata = {
    title: "ROI Calculator Guide",
    description: "Learn how to use the ROI calculator with examples and tips.",
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
            &rsaquo; <span>ROI Calculator</span>
        </nav>
    );
}

export default function GuidePage() {
    const pageUrl =
        "https://fosterwealthventures.store/guide/roi";
    const shareTitle = String(metadata.title ?? "");

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: shareTitle,
        description: "Learn how to use the ROI calculator with examples and tips.",
        mainEntityOfPage: pageUrl,
        dateModified: "2025-10-21T00:00:00Z",
        publisher: { "@type": "Organization", name: "Foster Wealth Ventures" },
    };

    return (
        <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
            <Breadcrumb />

            <GuideHero
                title="ROI Calculator — Guide"
                subtitle="Quick return on investment math with optional annualization."
                icon={null}
            />

            <p className="mt-3 text-sm text-gray-600">Estimated reading time: 2 minutes</p>

            {/* In-content ad (auto-gated to free contexts) */}
            <div className="not-prose my-4">
                <AdInContent />
            </div>

            <section>
                <h2>What it does</h2>
                <p>
                    Shows two views of an investment. Simple ROI is total gain; annualized ROI spreads that gain per year so you can compare things held for different lengths.
                </p>
            </section>

            <section>
                <h2>Inputs</h2>
                <ul>
                    <li>Initial Investment</li>
                    <li>Final Value (today or sale)</li>
                    <li>Time (years, can be decimal)</li>
                </ul>
            </section>

            <section>
                <h2>Output</h2>
                <ul>
                    <li>ROI (%)</li>
                    <li>Annualized ROI (optional)</li>
                </ul>
            </section>

            <section>
                <h2>Example</h2>
                <p>10000 → 15000 in 2 years ≈ 50% ROI, lower annualized rate.</p>
            </section>

            <section>
                <h2>Tip</h2>
                <p>Pair this with your budget numbers for clearer decisions.</p>
            </section>

            <section>
                <CTAButton href="/calculators/roi" data-testid="try-matching-calc">
                    Open the ROI calculator
                </CTAButton>
            </section>

            <div className="mt-6 not-prose">
                <SocialShare url={pageUrl} title={shareTitle} />
            </div>

            <GuideNav
                next={{
                    href: "/guide/break-even",
                    title: "Break-Even",
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
        </main>
    );
}
