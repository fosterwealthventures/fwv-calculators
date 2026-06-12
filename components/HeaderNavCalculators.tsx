"use client";

import { CALCULATORS, PILLAR_LABELS, type CalcPillar } from "@/lib/calculators";
import Link from "next/link";

const pillarOrder: CalcPillar[] = ["credit", "real-estate", "utility"];

export default function HeaderNavCalculators() {
  return (
    <div className="min-w-[280px] max-h-[70vh] overflow-y-auto p-2">
      {pillarOrder.map((pillar) => {
        const items = CALCULATORS.filter((c) => c.pillar === pillar);
        if (!items.length) return null;
        return (
          <div key={pillar} className="mb-2 last:mb-0">
            <div className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-plum-500">
              {PILLAR_LABELS[pillar]}
            </div>
            {items.map((c) => (
              <Link
                key={c.slug}
                href={c.path}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-900 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <span className="truncate">{c.title}</span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                  Free
                </span>
              </Link>
            ))}
          </div>
        );
      })}
      <div className="mt-2 border-t border-neutral-200 pt-2">
        <Link
          href="/calculators"
          className="block rounded-lg px-3 py-2 text-sm font-medium text-brand-green hover:bg-emerald-50"
        >
          View all calculators →
        </Link>
      </div>
    </div>
  );
}
