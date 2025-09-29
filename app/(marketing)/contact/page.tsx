// app/(marketing)/contact/page.tsx
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact — Foster Wealth Ventures" };

export default function ContactPage() {
  return (
    <>
      {/* Simple breadcrumb to avoid prop/type mismatch */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
        <a href="/" className="hover:underline">Home</a>
        <span className="mx-2">›</span>
        <span className="text-gray-500">Contact</span>
      </nav>

      <h1 className="heading-hero">Contact</h1>
      <p className="lead mt-2">
        Have a question, found a bug, or want to suggest a new calculator? We’d love to hear from you.
      </p>

      <div className="mt-6 rounded-2xl border bg-white p-6">
        <ContactForm />
      </div>
    </>
  );
}
