// app/guide/employee-cost/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Employee Cost Calculator Guide | Foster Wealth Ventures",
  description:
    "See the full cost of labor — wages, taxes, benefits, insurance, and overhead — before you hire.",
};

export default function EmployeeCostGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm">
        <Link href="/guide" className="underline hover:no-underline">
          ← Back to Guides
        </Link>
      </nav>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
        Employee Cost Calculator: How to Estimate True Cost of Hiring
      </h1>

      {/* Subheading */}
      <p className="mt-3 text-gray-600">
        Salary is just the start. This guide shows what goes into your total
        cost of labor — benefits, payroll tax, unemployment insurance, workers’
        comp, and other overhead — so you can budget with confidence.
      </p>

      {/* Scripture (Premium pages styling) */}
      <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-4 shadow-soft">
        <p className="text-sm italic text-gray-700">
          <span className="font-semibold">Proverbs 21:5</span> — “The plans of
          the diligent lead surely to abundance, but everyone who is hasty comes
          only to poverty.”
        </p>
      </div>

      {/* What it does */}
      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          What the Calculator Includes
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Base pay (annual salary or hourly × hours/week × weeks/year)</li>
          <li>Benefits load (health, dental, vision, retirement, PTO, etc.)</li>
          <li>Payroll taxes (FICA / Medicare)</li>
          <li>Unemployment insurance (FUTA/SUTA)</li>
          <li>Workers’ compensation insurance</li>
          <li>Additional expenses (equipment, software, office, training)</li>
        </ul>
      </section>

      {/* How to use */}
      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">How to Use It</h2>
        <ol className="list-decimal pl-6 text-gray-700 space-y-2">
          <li>Choose salary or hourly pay and enter your numbers.</li>
          <li>Set your benefits percentage and tax/insurance assumptions.</li>
          <li>Add any additional recurring or one-time expenses.</li>
          <li>
            View the breakdown and total by annual, quarterly, monthly,
            bi-weekly, weekly, or daily.
          </li>
          <li>Download a quick text report for your records.</li>
        </ol>
      </section>

      {/* CTA Card */}
      <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft">
        <h3 className="text-xl font-semibold text-gray-900">
          Ready to calculate your true cost?
        </h3>
        <p className="mt-2 text-gray-700">
          The Employee Cost Calculator is included with the{" "}
          <span className="font-semibold">Pro</span> plan (choose one: Employee
          Cost or Expense Split Deluxe). Upgrade to unlock.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {/* Unlock with Pro */}
          <Link
            href="/pro?calc=employee-cost"
            className="rounded-xl bg-brand-green px-4 py-2 font-semibold text-white hover:opacity-90"
          >
            Unlock with Pro ($29.99/mo)
          </Link>

          {/* Open Calculator — Home route */}
          <Link
            href="/?calc=employee-cost"
            className="rounded-xl border border-brand-green px-4 py-2 font-semibold text-brand-green hover:bg-brand-green/5"
          >
            Open on Home
          </Link>

          {/* Open Calculator — /calculators route */}
          <Link
            href="/calculators?calc=employee-cost"
            className="rounded-xl border border-brand-green px-4 py-2 font-semibold text-brand-green hover:bg-brand-green/5"
          >
            Open on /calculators
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <section className="mt-10 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Frequently Asked
        </h2>

        <div>
          <h4 className="font-semibold text-gray-900">
            What’s a good benefits % to use?
          </h4>
          <p className="text-gray-700">
            Small businesses often start between 15–30% depending on coverage.
            If you contribute to retirement, offer rich health plans, or provide
            significant PTO, your percentage may be higher.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900">
            Is this a quote or legal advice?
          </h4>
          <p className="text-gray-700">
            No. This calculator is for planning and education. Always confirm
            your actual tax rates and insurance costs with a payroll provider,
            accountant, or insurer.
          </p>
        </div>
      </section>

      <div className="mt-10">
        <Link href="/guide" className="underline hover:no-underline">
          ← Back to Guides
        </Link>
      </div>

      <footer className="mt-8 text-xs text-gray-500">
        Powered by <span className="font-semibold">Foster Wealth Ventures</span>
      </footer>
    </main>
  );
}
