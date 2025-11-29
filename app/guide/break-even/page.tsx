import GuideNav from "@/components/GuideNav";
import { CTAButton, GuideHero, SocialShare } from "@/components/GuideParts";
import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Break-Even Guide",
    description: "Determine your sales volume to cover fixed and variable costs.",
};

export default function GuidePage() {
    const pageUrl = "https://fosterwealthventures.store/guide/break-even";
    const shareTitle = String(metadata.title ?? "");

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: shareTitle,
        description: "Determine your sales volume to cover fixed and variable costs.",
        mainEntityOfPage: pageUrl,
        dateModified: "2025-10-21T00:00:00Z",
        publisher: { "@type": "Organization", name: "Foster Wealth Ventures" },
    };

    return (
        <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
            <Breadcrumb trail={[{ href: "/guide", label: "Guides" }, { href: "/guide/break-even", label: "Break-Even" }]} />

            <GuideHero
                title="Break-Even — Guide"
                subtitle="Find the sales volume needed to cover fixed and variable costs, plus profit targets, safety margin, and time-to-break-even."
                icon={null}
            />

            <p className="mt-3 text-sm text-gray-600">Estimated reading time: 2 minutes</p>

            <section>
                <h2>What it does</h2>
                <p>
                    Calculates the point where your total revenue equals total costs, shows revenue to break even, contribution margin, units/revenue to hit a profit target, safety margin vs current sales, and rough time-to-break-even when you enter expected monthly units.
                </p>
            </section>

            <section>
                <h2>Inputs</h2>
                <ul>
                    <li>Fixed Costs (rent, salaries, insurance)</li>
                    <li>Variable Cost per Unit (materials, labor)</li>
                    <li>Price per Unit (selling price)</li>
                    <li>Target Profit (optional — see units/revenue to hit a goal)</li>
                    <li>Current Sales (units, optional — safety margin vs break-even)</li>
                    <li>Expected Monthly Units (optional — months to break-even)</li>
                </ul>
            </section>

            <section>
                <h2>Output</h2>
                <ul>
                    <li>Break-even units and revenue</li>
                    <li>Contribution margin ($ and %)</li>
                    <li>Units/revenue for your profit target</li>
                    <li>Safety margin vs current sales</li>
                    <li>Approximate months to break-even (with monthly units)</li>
                </ul>
            </section>

            <section>
                <h2>Example</h2>
                <ul>
                    <li>Fixed costs: $10,000/month</li>
                    <li>Variable cost: $20/unit</li>
                    <li>Price: $50/unit ? Contribution margin: $30 (60%)</li>
                    <li>Break-even: 334 units (about $16,700 revenue)</li>
                    <li>Profit target $5,000: 500 units (about $25,000 revenue)</li>
                    <li>Current sales 400 units ? Safety margin ~17% above break-even</li>
                    <li>Expected monthly units 150 ? ~3 months to break-even</li>
                </ul>
            </section>

            <section>
                <h2>Tips</h2>
                <ul>
                    <li>If price is near or below variable cost, raise price or cut variable cost—otherwise break-even is impossible.</li>
                    <li>Use target profit to set minimum viable sales goals for launches.</li>
                    <li>Safety margin helps monitor risk; negative means you’re below break-even.</li>
                    <li>Use months-to-break-even to sanity-check monthly volume assumptions.</li>
                </ul>
            </section>

            <section>
                <CTAButton href="/calculators/break-even" data-testid="try-matching-calc">
                    Open the Break-Even calculator
                </CTAButton>
            </section>

            <div className="mt-6 not-prose">
                <SocialShare url={pageUrl} title={shareTitle} />
            </div>

            <GuideNav
                prev={{
                    href: "/guide/roi",
                    title: "ROI Calculator",
                }}
                next={{
                    href: "/guide/mortgage",
                    title: "Mortgage",
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
        </main>
    );
}
