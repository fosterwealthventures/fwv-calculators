// app/guide/shopping-budget/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { AdInContent } from "@/components/ads";

import { RelatedLink, RelatedSection } from "@/components/GuideLinks";
import GuideNav from "@/components/GuideNav";
import { OpenCalculatorButton, SocialShare } from "@/components/GuideParts";
import {
    CTAWrap,
    H1,
    H2,
    HelperText,
    NavText,
    Section,
} from "@/components/GuideTypography";

export const metadata: Metadata = {
    title: "Shopping Budget Calculator — Plan Your Cart, Stay Under Budget",
    description:
        "A practical guide to planning your cart, including tax, and tracking what you have left. Add items, edit inline, and see remaining vs budget in real time.",
};

// Use shared breadcrumb component

export default function ShoppingBudgetGuide() {
    const pageUrl = "https://fosterwealthventures.store/guide/shopping-budget";
    const shareTitle = String(metadata.title ?? "");

    // FAQ / How-to for schema
    const faq = [
        {
            q: "Does this include sales tax?",
            a: "Yes. Enter your local tax rate (%) and the calculator adds tax on your subtotal automatically.",
        },
        {
            q: "Can I edit items after adding them?",
            a: "Yes. Click the price or quantity in the table to edit inline, then save or cancel.",
        },
        {
            q: "Does it save my list?",
            a: "Your budget, tax, and items are saved in your browser using localStorage on this device.",
        },
        {
            q: "Can I export my list?",
            a: "Exports are not in the free version. We may add CSV export to a future Plus/Pro plan based on demand.",
        },
    ];

    const howToSteps = [
        "Enter your total budget and local tax rate (%)",
        "Add items with name, price, and quantity",
        "Adjust items inline by clicking price or quantity",
        "Watch Remaining update as you tweak your list",
        "Use Clear All to start over",
    ];

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: shareTitle,
        description: metadata.description,
        mainEntityOfPage: pageUrl,
        dateModified: "2025-10-19T00:00:00Z",
        publisher: { "@type": "Organization", name: "Foster Wealth Ventures" },
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
        })),
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to plan your shopping with a budget",
        step: howToSteps.map((name, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name,
        })),
    };

    return (
        <main>
            {/* Navigation */}
            <Breadcrumb trail={[{ href: "/guide", label: "Guides" }, { href: "/guide/shopping-budget", label: "Shopping Budget" }]} />

            {/* Page Title */}
            <H1>Shopping Budget — Plan Your Cart & Stay Under Budget</H1>

            {/* Reading time */}
            <p className="mt-2 text-sm text-gray-600">
                Estimated reading time: 3–4 minutes
            </p>

            {/* Main content sections */}
            <Section>
                <div>
                    <H2>What this calculator does (Free)</H2>
                    <p>
                        Build a quick shopping plan and avoid checkout surprises. Add items
                        to a simple table, include your tax rate, and see{" "}
                        <b>Subtotal</b>, <b>Tax</b>, <b>Total</b>, and <b>Remaining</b> update
                        live against your budget. A progress bar warns you at 90% and turns
                        red if you go over.
                    </p>
                </div>

                <div>
                    <H2>How to use it</H2>
                    <p>
                        Start with your <b>Budget</b> (e.g., 150.00) and local <b>Tax (%)</b>{" "}
                        (e.g., 8.5). Add each item’s name, price, and quantity, then press{" "}
                        <b>Add</b> (or hit Enter). To correct a row later, click the{" "}
                        <b>Price</b> or <b>Qty</b>, edit inline, and save. Use <b>Clear All</b> to
                        reset the list.
                    </p>
                    <p>
                        Your budget, tax, and items are stored locally in your browser so
                        they’re there next time on the same device.
                    </p>
                </div>

                <div>
                    <H2>Tips & common pitfalls</H2>
                    <ul className="list-disc pl-6">
                        <li>
                            Tax should be a percentage (e.g., <code>8.5</code>), not decimal{" "}
                            (<code>0.085</code>).
                        </li>
                        <li>
                            For bundles (3-packs, etc.), set <b>Qty</b> = 1 and use the bundle
                            price.
                        </li>
                        <li>
                            For price-per-unit planning, include the unit in the item name
                            (e.g., “Chicken (per lb)”).
                        </li>
                    </ul>
                </div>

                <div>
                    <H2>What’s next</H2>
                    <p>
                        If there’s demand, we’ll add <b>CSV export/import</b>,{" "}
                        <b>category totals</b>, and cross-device sync in a Plus/Pro version.
                    </p>
                </div>
            </Section>

            {/* CTA */}
            {/* In-content ad moved lower to avoid large gap under the title */}
            <div className="not-prose my-6">
                <AdInContent />
            </div>

            <CTAWrap>
                <OpenCalculatorButton slug="shopping-budget" className="mt-2" />
                <HelperText>
                    Free to use — open the calculator and try your own numbers.
                </HelperText>
            </CTAWrap>

            {/* Related */}
            <RelatedSection title="Related">
                <RelatedLink href="/guide/restaurant-tips-tabs-split" tag="Guide">
                    Restaurant Tip &amp; Tab Split
                </RelatedLink>
                <RelatedLink href="/guide/restaurant-split-by-order">
                    Split by Order (+ Shared Appetizers)
                </RelatedLink>
                <RelatedLink href="/guide/roi-vs-annualized-roi">
                    ROI vs Annualized ROI
                </RelatedLink>
            </RelatedSection>

            {/* Share */}
            <div className="mt-6">
                <SocialShare url={pageUrl} title={shareTitle} />
            </div>

            {/* Bottom nav */}
            <GuideNav
                prev={{
                    href: "/guide/5-costly-calculator-mistakes",
                    title: "5 Costly Calculator Mistakes",
                }}
            />

            {/* SEO schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
        </main>
    );
}
