// app/guide/restaurant-split-by-order/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

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
    title: "Split by Order (with Shared Appetizers) — Precise Bill Splitting",
    description:
        "Learn to split a restaurant bill by each person’s actual order, including shared appetizers. Tax and tip are allocated fairly and proportionally. (Plus feature)",
};

function Breadcrumb() {
    return (
        <NavText>
            <Link href="/" className="text-brand-green hover:underline">Home</Link> &rsaquo;{" "}
            <Link href="/guide" className="text-brand-green hover:underline">Guides</Link> &rsaquo;{" "}
            <span>Split by Order (+ Shared Appetizers)</span>
        </NavText>
    );
}

export default function SplitByOrderGuide() {
    const pageUrl =
        "https://fosterwealthventures.store/guide/restaurant-split-by-order";
    const shareTitle = String(metadata.title ?? "");

    // FAQ / How-to (also used for schema)
    const faq = [
        {
            q: "Who gets access to Split by Order?",
            a: "This is a Plus feature (available on Plus, Pro, and Premium). The basic Tip & Tab Split remains free."
        },
        {
            q: "How are shared appetizers handled?",
            a: "Enter the shared subtotal and the number of people who ate them. That amount is divided evenly among sharers, then tax and tip are allocated proportionally from the final bill."
        },
        {
            q: "Do I enter pre-tax prices?",
            a: "Yes. Enter each person’s pre-tax order amounts. The calculator distributes tax and tip proportionally based on those totals."
        },
        {
            q: "Can we include auto-gratuity/service charge?",
            a: "Yes. If your receipt includes a service charge or auto-gratuity, set Tip to 0% (or only tip the extra you wish to add)."
        },
    ];

    const howToSteps = [
        "Open the Tip & Tab Split calculator and switch to “Split by Order.”",
        "Enter your order (pre-tax) and add rows for other diners’ orders.",
        "Add a shared items subtotal (e.g., appetizers/bottle) and the number of sharers.",
        "Set Discount (% or $), choose where Tax applies, and set Tip preferences above.",
        "Review your personal amount owed—tax & tip are allocated proportionally from the final bill.",
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
        name: "How to split a restaurant bill by order with shared items",
        step: howToSteps.map((name, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name,
        })),
    };

    return (
        <main>
            {/* Breadcrumb */}
            <Breadcrumb />

            {/* Title */}
            <H1>
                Split by Order (+ Shared Appetizers)
                <span className="ml-3 align-middle rounded-md border px-1.5 py-0.5 text-[11px]">Plus</span>
            </H1>

            {/* Reading time */}
            <p className="mt-2 text-sm text-gray-600">Estimated reading time: 3–4 minutes</p>

            <Section>
                <div>
                    <H2>Why use Split by Order?</H2>
                    <p>
                        When everyone orders different things—or only some people shared appetizers—an even split isn’t fair.
                        Split by Order lets each person pay their exact share. You enter pre-tax order amounts and any shared
                        subtotal (with number of sharers). The calculator then allocates the <i>final bill</i> (after discount,
                        tax, and tip) proportionally.
                    </p>
                </div>

                <div>
                    <H2>How it works (formula)</H2>
                    <p>
                        We first add each sharer’s equal portion of the shared subtotal to their personal order:
                    </p>
                    <p className="mt-1">
                        <code>YourPre = YourOrder + (SharedSubtotal ÷ Sharers)</code>
                    </p>
                    <p className="mt-2">
                        Then we compute a ratio against everyone’s adjusted pre-tax totals and apply it to the final bill:
                    </p>
                    <p className="mt-1">
                        <code>Your Share = (YourPre ÷ Sum(AllOrders + Shared)) × FinalBill</code>
                    </p>
                </div>

                <div>
                    <H2>Quick example</H2>
                    <p>
                        Final bill: $128.40. Orders: You $22, Alex $30, Sam $18. Shared appetizers: $18 shared by 3.
                        Your adjusted pre-tax = 22 + (18/3) = 28. Total pre-tax = (22+30+18) + 18 = 88.
                        Ratio = 28/88 ≈ 0.3182 ⇒ You owe ≈ <b>$40.86</b>.
                    </p>
                </div>

                <div>
                    <H2>Tips & common pitfalls</H2>
                    <ul className="ml-5 list-disc">
                        <li>Enter pre-tax order amounts—tax & tip are distributed for you.</li>
                        <li>Set the sharers count correctly so only those who ate shared items pay for them.</li>
                        <li>If auto-gratuity/service charge exists, set Tip to 0% (or only add what you want to tip extra).</li>
                        <li>Use the basic Tip & Tab Split for simple, even splits (free, up to 4 people).</li>
                    </ul>
                </div>
            </Section>

            {/* CTA */}
            <CTAWrap>
                <OpenCalculatorButton slug="tip-split" className="mt-2" />
                <HelperText>Use “Split by Order” inside the Tip & Tab Split calculator.</HelperText>
            </CTAWrap>

            {/* Related */}
            <RelatedSection title="Related">
                <RelatedLink href="/guide/restaurant-tips-tabs-split" tag="Guide">
                    Restaurant Tip & Tab Split (Free)
                </RelatedLink>
                <RelatedLink href="/guide/simple-vs-compound-interest" tag="Guide">
                    Simple vs. Compound Interest
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
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
        </main>
    );
}
