// components/ExpenseSplitDeluxeGate.tsx
"use client";

import ProChoiceGate from "@/components/ProChoiceGate";
import type { Plan, ProChoice } from "@/lib/plan";

/**
 * Wrapper for Expense Split Deluxe shown on /pro.
 * - Free block remains visible for everyone.
 * - The Deluxe features are unlocked if:
 *    • userPlan === "premium", OR
 *    • userPlan === "pro" AND proChoice === "deluxe"
 */
export default function ExpenseSplitDeluxeGate({
  userPlan = "free",
  proChoice = null,
}: {
  userPlan?: Plan;
  proChoice?: ProChoice;
}) {
  return (
    <section className="space-y-6">
      {/* Always-free basics (swap in your actual basic split UI if you like) */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold">Basic Expense Split (Free)</h3>
        <p className="mt-2 text-sm text-gray-600">
          Replace this with your free/basic split form or a link to it.
        </p>
      </div>

      {/* Pro-choice gate: Pro must pick "deluxe"; Premium bypasses choice */}
      <ProChoiceGate want="expense_split" redirect="/pro?calc=expense-split-deluxe">
        {/* Everything inside here is the Deluxe (Pro-choice) content */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold">
            Travel Split (Itineraries) — Pro Choice
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Wire your real Travel Split UI here.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold">
            Couples & Roommate Templates — Pro Choice
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Wire your real templates UI here.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold">
            Child-Related Allocations & Notes — Pro Choice
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Wire your real child allocation UI here.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold">
            Downloadable Report (PDF/CSV) — Pro Choice
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Wire your real download/export here.
          </p>
        </div>
      </ProChoiceGate>
    </section>
  );
}
