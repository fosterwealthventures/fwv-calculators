// app/page.tsx
// redeploy test
// test lint-staged
"use client";

import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";
import Link from "next/link";
// app/guide/page.tsx

export default function Home() {
  return (
    <main className="fwv-container py-6">
      {/* Heading + intro */}
      <section className="space-y-2">
        <h1 className="text-4xl font-extrabold text-purple-title">Foster Wealth Calculators</h1>
        <p className="mt-2 text-plum-900 dark:text-plum-100/80 max-w-2xl">
          Start with the free calculators below. Upgrade any time to unlock
          Savings, Debt Payoff, Employee Cost, and Expense Split Deluxe.
        </p>

        {/* 👇 Add a button that goes to your existing "Calculators" tab */}
        <div className="mt-4 flex gap-3">
          <Link
            href="/dashboard" // <-- if your Calculators tab uses a different route, change this href
            className="btn-regal"
          >
            See all calculators
          </Link>
          <Link
            href="/guide"
            className="btn-ghost-regal"
          >
            Learn more
          </Link>
        </div>
      </section>

      {/* Scripture */}
      <section className="mt-4">
        <div className="card-regal p-5 shadow-md">
          <blockquote className="text-base md:text-lg font-semibold italic text-plum-800 dark:text-plum-100">
            "The plans of the diligent lead surely to abundance, but everyone who
            is hasty comes only to poverty."
          </blockquote>
          <div className="mt-2 text-base font-bold text-aure-600 dark:text-aure-400">— Proverbs 21:5</div>
        </div>
      </section>

      {/* Free-only on Home */}
      <section className="mt-3">
        <FosterWealthCalculators freeOnly />
      </section>
    </main>
  );
}
// test husky
// husky-hook-test
// hook check
