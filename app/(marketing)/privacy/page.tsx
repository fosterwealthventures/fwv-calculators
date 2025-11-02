import Breadcrumb from "@/components/Breadcrumb";

export const metadata = { title: "Privacy Policy – Foster Wealth Ventures" };

const EFFECTIVE_DATE = new Date().toISOString().slice(0, 10);

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <Breadcrumb trail={[{ href: "/privacy", label: "Privacy" }]} />
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-purple-title">Privacy Policy</h1>
      <p className="text-sm text-gray-500">Effective date: {EFFECTIVE_DATE}</p>

      <section className="space-y-3 text-gray-700">
        <p>
          We respect your privacy. This Policy explains what information we collect, how we use it, and your choices.
          By using our site you agree to this Policy.
        </p>

        <h2 className="text-xl font-semibold text-brand-green">Information We Collect</h2>
        <ul className="list-disc ml-6">
          <li>Usage data (pages viewed, approximate location by IP, device/browser info)</li>
          <li>Contact information you voluntarily submit (e.g., email)</li>
          <li>Advertising and analytics cookies, if you consent</li>
        </ul>

        <h2 className="text-xl font-semibold text-brand-green">How We Use Information</h2>
        <ul className="list-disc ml-6">
          <li>Operate and improve our calculators and website</li>
          <li>Respond to inquiries and provide support</li>
          <li>Show ads and measure their performance (if enabled)</li>
        </ul>

        <h2 className="text-xl font-semibold text-brand-green">Cookies & Google AdSense</h2>
        <p>
          We may show ads served by Google. Google and its partners use cookies to serve and measure ads based on
          your visits to this and other sites. You can manage your choices via our consent banner, and learn more
          about how Google uses data here: {" "}
          <a className="underline text-brand-green" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
            How Google uses information from sites or apps that use its services
          </a>
          . You can also control ad personalization at {" "}
          <a className="underline text-brand-green" href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-brand-green">Your Choices</h2>
        <ul className="list-disc ml-6">
          <li>Use the on-site consent banner to accept or reject analytics and advertising cookies</li>
          <li>Block or clear cookies in your browser settings</li>
          <li>Contact us to access or delete personal information you have shared</li>
        </ul>

        <h2 className="text-xl font-semibold text-brand-green">Contact</h2>
        <p>
          Email: <a className="underline text-brand-green" href="mailto:privacy@fosterwealthventures.store">privacy@fosterwealthventures.store</a>
        </p>
      </section>
    </main>
  );
}

