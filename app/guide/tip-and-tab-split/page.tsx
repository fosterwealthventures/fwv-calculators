import Breadcrumb from "@/components/Breadcrumb";
import GuideNav from "@/components/GuideNav";
import { CTAButton, GuideHero, SocialShare } from "@/components/GuideParts";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Tip Calculator & Bill Splitter Guide – Free Even Split Tool",
    description:
        "Learn how to use the free Tip & Tab Split calculator to split a restaurant bill, tax, and tip evenly across diners. Perfect for nights out with friends, coworkers, or family.",
};

export default function GuidePage() {
    const pageUrl =
        "https://fosterwealthventures.store/guide/tip-and-tab-split";
    const shareTitle = String(metadata.title ?? "");

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: shareTitle,
        description:
            "Learn how to use the free Tip & Tab Split calculator to split a restaurant bill, tax, and tip evenly across diners.",
        mainEntityOfPage: pageUrl,
        dateModified: "2025-10-21T00:00:00Z",
        publisher: { "@type": "Organization", name: "Foster Wealth Ventures" },
    };

    return (
        <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
            <Breadcrumb
                trail={[
                    { href: "/guide", label: "Guides" },
                    { href: "/guide/tip-and-tab-split", label: "Tip & Tab Split" },
                ]}
            />

            <GuideHero
                title="Tip & Tab Split Calculator Guide (Free)"
                subtitle="Use this free tip calculator and bill splitter to divide the check, tax, and tip evenly across everyone at the table."
                icon={null}
            />

            <p className="mt-3 text-sm text-gray-600">
                Estimated reading time: 2 minutes
            </p>

            <section>
                <h2>What this free calculator does</h2>
                <p>
                    The Tip &amp; Tab Split calculator is a simple{" "}
                    <strong>even-split tip calculator</strong>. It takes your restaurant
                    bill, applies tax and tip, and then divides the total evenly across
                    everyone in the group.
                </p>
                <p>
                    It&apos;s perfect when you just want to say, “Let&apos;s split it
                    evenly,” and move on with your night—no arguing over napkin math.
                </p>
            </section>

            <section>
                <h2>Inputs you&apos;ll enter</h2>
                <ul>
                    <li>
                        <strong>Total bill amount</strong> – the check amount from the
                        restaurant.
                    </li>
                    <li>
                        <strong>Tax rate</strong> – your local sales tax percentage (for
                        example, 8.5%).
                    </li>
                    <li>
                        <strong>Tip percentage</strong> – the tip you want to leave (for
                        example, 18%, 20%, or 25%).
                    </li>
                    <li>
                        <strong>Number of people</strong> – how many diners are splitting
                        the bill evenly.
                    </li>
                </ul>
                <p>
                    Once you plug these in, the calculator handles all the math in one
                    click.
                </p>
            </section>

            <section>
                <h2>What the free Tip &amp; Tab Split shows you</h2>
                <ul>
                    <li>
                        <strong>Per-person amount</strong> – how much each person should
                        pay, including their share of tax and tip.
                    </li>
                    <li>
                        <strong>Subtotal</strong> – the pre-tax amount of the bill.
                    </li>
                    <li>
                        <strong>Tax amount</strong> – how much sales tax is added.
                    </li>
                    <li>
                        <strong>Tip amount</strong> – how much tip is added at your chosen
                        percentage.
                    </li>
                    <li>
                        <strong>Grand total</strong> – the full bill with tax and tip
                        included.
                    </li>
                </ul>
                <p>
                    This makes it easy to double-check that the total feels right before
                    everyone sends money.
                </p>
            </section>

            <section>
                <h2>Example: splitting a dinner tab evenly</h2>
                <p>
                    Imagine a group dinner with this check:
                </p>
                <ul>
                    <li>Total bill: $200</li>
                    <li>Tax rate: 8%</li>
                    <li>Tip: 20%</li>
                    <li>Number of people: 4</li>
                </ul>
                <p>
                    Using the Tip &amp; Tab Split calculator, you&apos;ll see something
                    like:
                </p>
                <ul>
                    <li>Subtotal: $200.00</li>
                    <li>Tax: $16.00</li>
                    <li>Tip: about $43.00</li>
                    <li>Grand total: around $259.00</li>
                    <li>
                        Per-person amount: about <strong>$64.75</strong> each (your exact
                        result may round slightly).
                    </li>
                </ul>
                <p>
                    Everyone can just pay their share and move on—no one gets stuck doing
                    math at the table.
                </p>
            </section>

            <section>
                <h2>Even split vs. Split by Order (Plus)</h2>
                <p>
                    This free Tip &amp; Tab Split calculator is designed for{" "}
                    <strong>even splits</strong> when everyone agrees to share the bill
                    equally.
                </p>
                <p>
                    If you want each person to only pay for what they actually ordered,
                    plus their share of tax and tip, that&apos;s where our{" "}
                    <strong>Split by Order</strong> calculator (available on{" "}
                    <strong>FWV Plus</strong>) comes in. It lets you assign menu items to
                    each person for a precise, itemized split.
                </p>
                <p>
                    To keep this guide honest to the free tool, remember:{" "}
                    <strong>Tip &amp; Tab Split = even split only</strong>. For detailed,
                    per-person splits, upgrade and use{" "}
                    <Link
                        href="/calculators/split-by-order"
                        className="underline text-emerald-700"
                    >
                        Split by Order (Plus)
                    </Link>
                    .
                </p>
            </section>

            <section>
                <h2>Tips for smooth bill splitting with the free tool</h2>
                <ul>
                    <li>
                        Decide on the tip percentage <em>before</em> running the
                        calculator so everyone is on the same page.
                    </li>
                    <li>
                        Round to a simple per-person number if you prefer clean amounts
                        (for example, $65 instead of $64.75).
                    </li>
                    <li>
                        Have one person pay the full bill, then share the per-person
                        amount in a group text so everyone can send money quickly.
                    </li>
                    <li>
                        If the group&apos;s orders are very uneven and people care about
                        paying only for what they had, consider using{" "}
                        <Link
                            href="/calculators/split-by-order"
                            className="underline text-emerald-700"
                        >
                            Split by Order (Plus)
                        </Link>{" "}
                        next time.
                    </li>
                </ul>
            </section>

            <section>
                <CTAButton
                    href="/calculators/tip-and-tab-split"
                    data-testid="try-matching-calc"
                >
                    Open the Free Tip &amp; Tab Split calculator
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
