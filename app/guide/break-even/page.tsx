import GuideNav from "@/components/GuideNav";
import { CTAButton, GuideHero, SocialShare } from "@/components/GuideParts";
import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Break-Even Guide",
    description: "Determine your sales volume to cover fixed and variable costs.",
};

// Use shared Breadcrumb for consistency

export default function GuidePage() {
    const pageUrl =
        "https://fosterwealthventures.store/guide/break-even";
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
                subtitle="Find the sales volume needed to cover fixed and variable costs."
                icon={null}
            />

            <p className="mt-3 text-sm text-gray-600">Estimated reading time: 2 minutes</p>

            {/* In-content ad removed; footer banner handles ads */}

            <section>
                <h2>What it does</h2>
                <p>
                    Calculates the point where your total revenue equals total costs, helping you understand minimum sales needed to avoid losses.
                </p>
            </section>

            <section>
                <h2>Inputs</h2>
                <ul>
                    <li>Fixed Costs (rent, salaries, insurance)</li>
                    <li>Variable Cost per Unit (materials, labor)</li>
                    <li>Price per Unit (selling price)</li>
                </ul>
            </section>

            <section>
                <h2>Output</h2>
                <ul>
                    <li>Break-even units</li>
                    <li>Break-even revenue</li>
                </ul>
            </section>

            <section>
                <h2>Example</h2>
                <p>Fixed costs: $10,000/month, Variable cost: $20/unit, Price: $50/unit → Need to sell 334 units to break even.</p>
            </section>

            <section>
                <h2>Tip</h2>
                <p>Use this calculator to pricing decisions and set realistic sales targets.</p>
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
