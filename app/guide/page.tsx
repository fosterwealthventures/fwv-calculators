import Link from "next/link";

export const metadata = {
  title: "Guides | Foster Wealth Ventures",
  description: "All calculator walkthroughs and best-practice tips.",
};

const guides = [
  { slug: "savings-growth", title: "Savings Growth" },
  { slug: "debt-payoff", title: "Debt Payoff" },
  { slug: "mortgage-payment-breakdown", title: "Mortgage Payment" },
  { slug: "break-even-made-simple", title: "Break-Even" },
  { slug: "employee-cost", title: "Employee Cost" },
  { slug: "expense-split-deluxe", title: "Expense Split Deluxe" },
  // add others here as you add pages
];

export default function GuideIndex() {
  return (
    <main className="mx-auto max-w-7xl px-6 md:px-10 py-10">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Guides</h1>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {guides.map((g) => (
          <li key={g.slug} className="rounded-xl border p-4 hover:shadow">
            <Link href={`/guide/${g.slug}`} className="underline hover:no-underline">
              {g.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
