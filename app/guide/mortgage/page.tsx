import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mortgage Help – Start Here",
  description: "We’ve moved our detailed mortgage payment guide. Click through to view the complete step-by-step instructions.",
  robots: { index: false, follow: true },
};

export default function GuidePage() {
  return (
    <main className="prose prose-brand mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
        Looking for the Mortgage Payment Calculator Guide?
      </h1>
      <p className="mt-4">
        We’ve moved everything into one complete guide with examples, FAQs, and clear steps for using the monthly mortgage payment calculator.
      </p>
      <div className="mt-6">
        <Link
          href="/guide/mortgage-payment-breakdown"
          className="inline-flex items-center rounded-md bg-brand-green px-4 py-2 text-white font-semibold hover:bg-brand-green/90"
        >
          Open the Mortgage Payment Calculator Guide
        </Link>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        If you bookmarked this page, please update your bookmark to the consolidated guide.
      </p>
    </main>
  );
}
