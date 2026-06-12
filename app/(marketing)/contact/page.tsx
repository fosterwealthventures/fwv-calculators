// app/(marketing)/contact/page.tsx
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact — Foster Wealth Ventures" };

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto p-6">
      {/* Simple breadcrumb to avoid prop/type mismatch */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
        <a href="/" className="hover:underline">
          Home
        </a>
        <span className="mx-2">›</span>
        <span className="text-gray-500">Contact</span>
      </nav>

      <h1 className="text-2xl font-bold mb-4 text-emerald-700">Contact Foster Wealth Ventures</h1>
      <p className="mb-4 text-gray-600">
        We'd love to hear from you. For questions about our calculators, business inquiries, or support, please fill out the form below or reach us by mail.
      </p>

      <div className="flex flex-col gap-3 bg-white/5 p-4 rounded-lg border border-emerald-200">
        <ContactForm />
      </div>

      <div className="mt-6 text-sm text-gray-500 border-t border-gray-200 pt-4">
        <p><strong>Mailing Address:</strong></p>
        <p>Foster Wealth Ventures LLC</p>
        <p>P.O. Box 540784</p>
        <p>Miami, FL 33054</p>
      </div>
    </div>
  );
}
