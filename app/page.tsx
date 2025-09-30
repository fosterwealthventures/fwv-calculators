// app/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";

export default function Home() {
  return (
    <main className="fwv-container py-6">
      {/* Heading + intro */}
      <section className="space-y-2">
        <h1 className="heading-hero">Foster Wealth Calculators</h1>
        <p className="text-gray-700">
          Start with the free calculators below. Upgrade any time to unlock
          Savings, Debt Payoff, Employee Cost, and Expense Split Deluxe.
        </p>

        {/* 👇 Add a button that goes to your existing "Calculators" tab */}
        <div className="mt-3">
          <Link
            href="/dashboard" // <-- if your Calculators tab uses a different route, change this href
            className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            See all calculators
          </Link>
        </div>
      </section>

      {/* Scripture */}
      <section
        className="rounded-xl border p-4 bg-white mt-4"
        style={{ borderColor: "#E5E7EB" }}
      >
        <blockquote className="italic text-gray-700">
          “The plans of the diligent lead surely to abundance, but everyone who
          is hasty comes only to poverty.”
        </blockquote>
        <div className="mt-1 text-emerald-700 font-medium">— Proverbs 21:5</div>
      </section>

      {/* Free-only on Home */}
      <section className="mt-3">
        <FosterWealthCalculators freeOnly />
      </section>
    </main>
  );
}
