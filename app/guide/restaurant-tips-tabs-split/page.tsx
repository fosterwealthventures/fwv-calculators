import type { Metadata } from "next";
import Link from "next/link";
import { GuideHero, CTAButton, SocialShare } from "@/components/GuideParts";
import GuideNav from "@/components/GuideNav";

export const metadata: Metadata = {
  title: "Restaurant Tips & Tabs Split — Guide",
  description:
    "Split a restaurant bill fairly: subtotal, tax, tip, and per-person totals—by equal shares or by items.",
};

function Breadcrumb() {
  return (
    <nav className="mb-4 text-sm text-gray-600">
      <Link href="/" className="text-brand-green hover:underline">Home</Link> ›{" "}
      <Link href="/guide" className="text-brand-green hover:underline">Guides</Link> ›{" "}
      <span>Restaurant Tips & Tabs Split</span>
    </nav>
  );
}

export default function GuidePage() {
  const pageUrl =
    "https://www.fosterwealthventures.com/guide/restaurant-tips-tabs-split";

  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb />

      <GuideHero
        title="Restaurant Tips & Tabs Split"
        subtitle="Divide the check (and the tip) the fair way—either evenly or by what each person ordered."
        minTier="free"
      />

      <p className="mt-3 text-sm text-gray-600">Estimated reading time: 3–4 minutes</p>

      <section>
        <h2>Quick Summary</h2>
        <p>
          The calculator lets you split the bill <strong>equally</strong> or
          <strong> by items</strong>. Tip and tax are allocated either evenly or in proportion to each
          person’s pre-tip subtotal—your choice for fairness.
        </p>
      </section>

      <section>
        <CTAButton href="/?calc=restaurant-tips-tabs-split">
          👉 Try the matching calculator
        </CTAButton>
      </section>

      <section>
        <h2>Inputs</h2>
        <ul>
          <li><strong>Subtotal</strong> (before tax/tip) or individual <strong>items</strong> with prices.</li>
          <li><strong>Tax %</strong> (or tax amount, if known).</li>
          <li><strong>Tip %</strong> (or choose a fixed tip amount).</li>
          <li><strong>People</strong> — names or seat numbers.</li>
          <li><strong>Split method</strong> — Equal shares, or By items per person.</li>
          <li>Options: round each share to cents, exclude non-drinkers from alcohol items, etc.</li>
        </ul>
      </section>

      <section>
        <h2>Outputs</h2>
        <ul>
          <li><strong>Per-person total</strong> with their share of tip & tax.</li>
          <li>Breakdown for each person: items + proportional tax + tip.</li>
          <li>Table total check for sanity (matches receipt).</li>
        </ul>
      </section>

      <section>
        <h2>Step-by-Step</h2>
        <ol>
          <li>Enter subtotal (or add items to each person).</li>
          <li>Add tax % and tip % (or fixed amounts).</li>
          <li>Choose split method and allocation rule (even vs. proportional).</li>
          <li>Review each person’s total; enable rounding if desired.</li>
          <li>Share totals or copy the per-person receipts to messages.</li>
        </ol>
      </section>

      <section>
        <h2>Example</h2>
        <p>
          Subtotal $120, tax 8.5%, tip 18%, 3 people. Equal split allocates tax/tip evenly,
          giving each person ≈ <strong>$46.96</strong>. If you split by items (Alice $30, Ben $50, Cara $40),
          the calculator assigns tip/tax proportionally to each person’s items.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul>
          <li>Forgetting to include the tax when calculating the tip (or double-tipping).</li>
          <li>Splitting evenly when some ordered large extras—use “by items” instead.</li>
          <li>Not rounding shares leads to awkward cents; toggle “round shares”.</li>
        </ul>
      </section>

      <section>
        <CTAButton href="/?calc=restaurant-tips-tabs-split">
          👉 Open the calculator again
        </CTAButton>
      </section>

      <section>
        <h2>Related Guides</h2>
        <ul>
          <li><Link href="/guide/expense-split-deluxe">Expense Split Deluxe</Link></li>
          <li><Link href="/guide/simple-vs-compound-interest">Simple vs Compound Interest</Link></li>
        </ul>
      </section>

      <div className="not-prose mt-6">
        <SocialShare url={pageUrl} title="Restaurant Tips & Tabs Split — Guide" />
      </div>

      <GuideNav
        prev={{ href: "/guide/mortgage-payment-breakdown", title: "Mortgage Payment Breakdown" }}
        next={{ href: "/guide/simple-vs-compound-interest", title: "Simple vs Compound Interest" }}
      />
    </main>
  );
}
