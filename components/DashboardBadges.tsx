// components/DashboardBadges.tsx
"use client";

import { ENTITLEMENTS } from "@/lib/planConfig";
import { usePlan } from "@/lib/usePlan";

export default function DashboardBadges() {
  // usePlan() returns { plan, gte }, so destructure:
  const { plan } = usePlan();
  const ent = ENTITLEMENTS[plan];

  const items: Array<[string, boolean]> = [
    ["Savings Growth", ent.calculators.savings],
    ["Debt Payoff", ent.calculators.debt],
    ["Employee Cost", ent.calculators.employee],
    ["Expense Split Deluxe", ent.calculators.expenseSplitDeluxe],
  ];

  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(([name, ok]) => (
        <div
          key={name}
          className={`rounded-md border px-3 py-2 text-sm ${
            ok ? "bg-green-50 border-green-200" : "bg-gray-50"
          }`}
        >
          <span className="font-medium">{name}</span>
          <span
            className={`ml-2 inline-block rounded-full px-2 py-0.5 text-xs ${
              ok ? "bg-green-600 text-white" : "bg-gray-400 text-white"
            }`}
          >
            {ok ? "Unlocked" : "Locked"}
          </span>
        </div>
      ))}
    </div>
  );
}
