import GuideNav from "@/components/GuideNav";
import { CTAButton, GuideHero, SocialShare } from "@/components/GuideParts";
import type { Metadata } from "next";
import Link from "next/link";

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

            {/* In-content ad removed; footer banner handles ads */}

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
                    <li>Time horizon with a Years/Months toggle; you can enter 1.5 years or flip to months for short projects.</li>
                    <li>Optional mid-period cash-flow if you put more money in or pulled some out halfway through.</li>
                </ul>
            </section>

            <section>
                <h2>Output</h2>
                <ul>
                    <li>Final amount and net profit (net profit reflects the midpoint cash-flow if used).</li>
                    <li>Total ROI calculated on average invested capital whenever the advanced cash-flow is on.</li>
                    <li>Annualized ROI that uses decimal years so 6- or 18-month holds compare fairly.</li>
                    <li>A collapsible “Target ROI” card that tells you what final value you need to hit a chosen percentage.</li>
                </ul>
            </section>

            <section>
                <h2>Advanced cash-flow insight</h2>
                <p>
                    Turning on the advanced toggle treats midpoint cash as being invested for half the period. The calculator uses that average invested capital to keep ROI fair without forcing you into an IRR worksheet.
                </p>
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
