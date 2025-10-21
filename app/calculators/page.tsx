// app/calculators/page.tsx
import { CALCULATORS, tierLabel } from "@/lib/calculators";
import Link from "next/link";

export const metadata = {
    title: "Calculators",
    description: "All Foster Wealth calculators — plan, price, and split fast.",
};

export default function CalculatorsIndex() {
    return (
        <main id="main" className="mx-auto max-w-6xl px-4 py-8">
            <nav aria-label="Breadcrumb" className="mb-4 text-sm">
                <Link href="/" className="text-brand-green hover:underline">Home</Link> <span>›</span>{" "}
                <span className="text-neutral-500">Calculators</span>
            </nav>

            <h1 className="mb-2 text-3xl font-bold text-purple-title">Calculators</h1>
            <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-300">
                Open a calculator below. Items marked PLUS/PRO may require an upgrade.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {CALCULATORS.map((c) => (
                    <article key={c.slug} className="rounded-2xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <h2 className="text-base font-semibold">{c.title}</h2>
                        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{tierLabel(c.tier)}</p>
                        {c.summary ? (
                            <p className="mt-2 line-clamp-3 text-sm text-neutral-700 dark:text-neutral-300">
                                {c.summary}
                            </p>
                        ) : null}
                        <div className="mt-3 flex gap-2">
                            <Link href={c.path} className="rounded-lg bg-purple-700 px-3 py-1.5 text-sm text-white hover:bg-purple-800">
                                Open
                            </Link>
                            {c.guide && (
                                <Link href={c.guide} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
                                    Guide
                                </Link>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </main>
    );
}
