// app/(marketing)/terms/page.tsx
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Terms — Foster Wealth Calculators",
  description: "Terms of Service for Foster Wealth Calculators.",
};
<p className="mt-8">
  <a href="/" className="underline text-brand-green">
    Home
  </a>
</p>;

const EFFECTIVE_DATE = new Date().toISOString().slice(0, 10);

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* Keep this identical to Disclaimer for uniform nav */}
      <Breadcrumb trail={[{ href: "/terms", label: "Terms" }]} />

      <h1 className="text-3xl font-bold text-brand-green">Terms of Service</h1>

      <p className="mt-6 leading-7">
        Welcome to Foster Wealth Calculators. By accessing or using our website,
        calculators, guides, and related content (the “Service”), you agree to
        these Terms of Service.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">1) Educational Use Only</h2>
      <p className="mt-4 leading-7">
        The Service is provided for informational and educational purposes. We
        do not provide legal, tax, investment, or accounting advice. Always
        consult a qualified professional for advice specific to your situation.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">
        2) Accounts &amp; Subscriptions
      </h2>
      <p className="mt-4 leading-7">
        Some features require a paid plan (e.g., Pro or Premium). Plan access is
        personal and non-transferable. We may modify plans and pricing from time
        to time; changes will be posted on our site and apply going forward.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">3) Acceptable Use</h2>
      <p className="mt-4 leading-7">
        Do not abuse, interfere with, or reverse engineer the Service. We may
        suspend or terminate access for violations of these Terms or for
        activity that disrupts or harms the Service or other users.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">4) Third-Party Services</h2>
      <p className="mt-4 leading-7">
        We may link to or integrate third-party tools (e.g., ad networks,
        analytics). Their content and policies are their own. Your use of
        third-party services is governed by their terms and privacy policies.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">
        5) Ads &amp; Affiliate Links
      </h2>
      <p className="mt-4 leading-7">
        The site may display ads and/or use affiliate links. We may earn a
        commission if you click or purchase through those links, at no extra
        cost to you. Sponsorships and affiliate relationships do not influence
        our calculator formulas or outputs.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">
        6) Disclaimers &amp; Limitation of Liability
      </h2>
      <p className="mt-4 leading-7">
        The Service is provided “as is,” without warranties of any kind. To the
        fullest extent permitted by law, Foster Wealth Ventures and its
        contributors are not liable for any losses or damages arising from use
        of the Service.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">
        7) Changes to These Terms
      </h2>
      <p className="mt-4 leading-7">
        We may update these Terms periodically. Your continued use of the
        Service after changes become effective constitutes acceptance of the
        updated Terms.
      </p>

      <p className="mt-10 text-sm text-gray-600">
        Effective date: {EFFECTIVE_DATE}
      </p>
    </main>
  );
}
