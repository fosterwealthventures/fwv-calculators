import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Disclaimer — Foster Wealth Calculators",
  description:
    "Educational-use disclaimer for Foster Wealth Ventures calculators and guides.",
};

const EFFECTIVE_DATE = new Date().toISOString().slice(0, 10);

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumb trail={[{ href: "/disclaimer", label: "Disclaimer" }]} />
      <h1 className="text-3xl font-bold text-brand-green">Disclaimer</h1>

      <p className="mt-6 leading-7">
        The calculators, guides, and content on this site are provided for{" "}
        <strong>informational and educational purposes only</strong>. They are
        not financial, legal, investment, tax, or accounting advice, and they do
        not create a client relationship with Foster Wealth Ventures (FWV).
        Please consult a qualified professional for advice specific to your
        situation.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">
        Accuracy &amp; Assumptions
      </h2>
      <p className="mt-4 leading-7">
        Results depend on the inputs you provide and simplified assumptions in
        our models. Calculations may not reflect your exact circumstances. FWV
        makes no warranties—express or implied—regarding completeness, fitness
        for a particular purpose, or non-infringement.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Third-Party Services</h2>
      <p className="mt-4 leading-7">
        We may link to or integrate third-party services (e.g., ad networks,
        analytics). We are not responsible for their content, policies, or
        availability. Your use of third-party services is governed by their
        terms and privacy policies.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">
        Ads &amp; Affiliate Links
      </h2>
      <p className="mt-4 leading-7">
        This site may display ads and/or use affiliate links. We may earn a
        commission if you click or purchase through those links, at no extra
        cost to you. Sponsorships and affiliate relationships do not influence
        our calculator formulas or outputs.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Limitation of Liability</h2>
      <p className="mt-4 leading-7">
        To the fullest extent permitted by law, FWV and its contributors will
        not be liable for any loss or damages arising from your use of this
        site, its tools, or its content. Use the calculators at your own risk.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Changes</h2>
      <p className="mt-4 leading-7">
        We may update this Disclaimer from time to time. Your continued use of
        the site means you accept the current version.
      </p>

      <p className="mt-10 text-sm text-gray-600">
        Effective date: {EFFECTIVE_DATE}
      </p>
    </main>
  );
}
