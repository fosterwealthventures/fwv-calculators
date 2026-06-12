import Breadcrumb from "@/components/Breadcrumb";
import GuideNav from "@/components/GuideNav";
import { CTAButton, GuideHero, SocialShare } from "@/components/GuideParts";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title:
        "Interest Calculator Guide – Simple & Compound Interest (Step-by-Step)",
    description:
        "Learn how to use the interest calculator to compare simple vs compound interest, estimate future value, and see how interest builds over time.",
};

export default function GuidePage() {
    const pageUrl = "https://fosterwealthventures.store/guide/interest";
    const shareTitle = String(metadata.title ?? "");

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: shareTitle,
        description:
            "Learn how to use the interest calculator to compare simple vs compound interest, estimate future value, and see how interest builds over time.",
        mainEntityOfPage: pageUrl,
        dateModified: "2025-10-21T00:00:00Z",
        publisher: { "@type": "Organization", name: "Foster Wealth Ventures" },
    };

    return (
        <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
            <Breadcrumb
                trail={[
                    { href: "/guide", label: "Guides" },
                    { href: "/guide/interest", label: "Interest" },
                ]}
            />

            <GuideHero
                title="Interest Calculator Guide"
                subtitle="Learn how to use the interest calculator to compare simple vs compound interest, estimate future value, and see how much of your balance is contributions vs growth."
                icon={null}
            />

            <p className="mt-3 text-sm text-gray-600">
                Estimated reading time: 2–3 minutes
            </p>

            <section>
                <h2>What this guide covers</h2>
                <p>
                    This guide walks you through how to use the interest calculator to
                    answer questions like:
                </p>
                <ul>
                    <li>How much interest will I earn on my savings over time?</li>
                    <li>What&apos;s the difference between simple and compound interest?</li>
                    <li>How does compounding frequency change my final balance?</li>
                    <li>
                        How much of my ending balance is money I put in vs. interest earned?
                    </li>
                </ul>
                <p>
                    It&apos;s useful for savings goals, debt comparisons, and basic
                    investing scenarios where you want to see how interest actually adds
                    up.
                </p>
            </section>

            <section>
                <h2>Simple vs. compound interest (quick overview)</h2>
                <p>
                    The calculator lets you switch between{" "}
                    <strong>simple interest</strong> and{" "}
                    <strong>compound interest</strong> so you can see how each one works.
                </p>

                <h3>Simple interest</h3>
                <p>
                    Simple interest only applies to your original principal. Interest
                    doesn&apos;t earn more interest.
                </p>
                <p>
                    A common simple interest formula looks like this:
                </p>
                <p>
                    <code>Amount = Principal × (1 + r × t)</code>
                </p>
                <ul>
                    <li>
                        <strong>Principal</strong> = starting amount
                    </li>
                    <li>
                        <strong>r</strong> = annual interest rate (as a decimal, e.g. 0.05
                        for 5%)
                    </li>
                    <li>
                        <strong>t</strong> = time in years
                    </li>
                </ul>

                <h3>Compound interest</h3>
                <p>
                    Compound interest means you earn interest on your principal{" "}
                    <em>and</em> on the interest that&apos;s already been added.
                </p>
                <p>A simplified compound interest formula looks like:</p>
                <p>
                    <code>
                        Future Value = Principal × (1 + r / n)<sup>n × t</sup>
                    </code>
                </p>
                <ul>
                    <li>
                        <strong>r</strong> = annual interest rate
                    </li>
                    <li>
                        <strong>n</strong> = number of compounding periods per year
                    </li>
                    <li>
                        <strong>t</strong> = time in years
                    </li>
                </ul>
                <p>
                    The calculator uses these ideas behind the scenes so you can focus on
                    the results instead of the math.
                </p>
            </section>

            <section>
                <h2>Inputs you&apos;ll enter</h2>
                <ul>
                    <li>
                        <strong>Principal (starting amount)</strong> – how much you&apos;re
                        beginning with.
                    </li>
                    <li>
                        <strong>Interest rate</strong> – the annual rate you expect to earn
                        or be charged (for example, 5% or 12%).
                    </li>
                    <li>
                        <strong>Time period</strong> – how long you&apos;ll save or owe the
                        money (usually in years).
                    </li>
                    <li>
                        <strong>Interest type</strong> – choose{" "}
                        <em>Simple</em> or <em>Compound</em> to compare both.
                    </li>
                    <li>
                        <strong>Compounding frequency</strong> (for compound interest) –
                        yearly, quarterly, monthly, etc., if your calculator supports it.
                    </li>
                    <li>
                        <strong>Additional contributions</strong> (optional) – extra money
                        you plan to add over time, if available in your version of the
                        calculator.
                    </li>
                </ul>
                <p>
                    Small changes in time, rate, or compounding can make a big difference
                    in the final result—especially with compound interest.
                </p>
            </section>

            <section>
                <h2>What the interest calculator shows you</h2>
                <ul>
                    <li>
                        <strong>Final amount / future value</strong> – how much you&apos;ll
                        have at the end of the period.
                    </li>
                    <li>
                        <strong>Total interest</strong> – how much the money earned (or how
                        much you paid in interest).
                    </li>
                    <li>
                        <strong>Total contributions</strong> – how much of the final amount
                        came from your own deposits (if contributions are used).
                    </li>
                    <li>
                        <strong>Simple vs compound comparison</strong> – how the final
                        amount changes when you switch interest types or compounding
                        frequency.
                    </li>
                </ul>
                <p>
                    This makes it easy to see how powerful compounding is compared to a
                    simple interest setup.
                </p>
            </section>

            <section>
                <h2>Example: Simple vs compound interest on the same money</h2>
                <p>
                    Let&apos;s say you have <strong>$5,000</strong> and want to see what
                    happens over 5 years at <strong>5%</strong> interest:
                </p>

                <h3>Simple interest example</h3>
                <ul>
                    <li>Principal: $5,000</li>
                    <li>Rate: 5% simple interest</li>
                    <li>Time: 5 years</li>
                </ul>
                <p>
                    Interest = $5,000 × 0.05 × 5 = <strong>$1,250</strong>
                    <br />
                    Final amount = $5,000 + $1,250 = <strong>$6,250</strong>
                </p>

                <h3>Compound interest example</h3>
                <ul>
                    <li>Principal: $5,000</li>
                    <li>Rate: 5% compounded annually</li>
                    <li>Time: 5 years</li>
                </ul>
                <p>
                    Using the compound interest formula, your final amount is closer to{" "}
                    <strong>$6,381</strong>.
                </p>
                <p>
                    That&apos;s a small difference over 5 years, but over 10, 20, or 30
                    years, compound interest can create a much bigger gap. Use the
                    calculator to test longer time frames and different compounding
                    schedules.
                </p>
            </section>

            <section>
                <h2>Tips for using the interest calculator wisely</h2>
                <ul>
                    <li>
                        <strong>Use simple interest</strong> when interest only applies to
                        the original balance (some loans or short-term deals).
                    </li>
                    <li>
                        <strong>Use compound interest</strong> for most savings, investing,
                        and long-term growth scenarios.
                    </li>
                    <li>
                        <strong>Compare different rates</strong> to see how much more you
                        earn at 4%, 6%, or 8% over the same time period.
                    </li>
                    <li>
                        <strong>Play with time</strong> – extending your time horizon often
                        has a bigger impact on compound interest than increasing your
                        contributions a little.
                    </li>
                </ul>
            </section>

            <section>
                <h2>When to use this interest calculator</h2>
                <ul>
                    <li>Comparing savings account or CD options.</li>
                    <li>Seeing how fast a debt grows if left unpaid.</li>
                    <li>
                        Estimating future value of a one-time deposit or ongoing savings
                        plan.
                    </li>
                    <li>
                        Teaching yourself or others the real difference between simple and
                        compound interest.
                    </li>
                </ul>
                <p>
                    Any time you want to see how interest changes your balance over time,
                    this calculator gives you a quick, visual way to test scenarios.
                </p>
            </section>

            <section>
                <CTAButton
                    href="/calculators/compound-interest"
                    data-testid="try-matching-calc"
                >
                    Open the Interest calculator
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
