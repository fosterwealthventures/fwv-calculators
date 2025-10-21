// components/HeaderNavCalculators.tsx
"use client";

import { CALCULATORS } from "@/lib/calculators";
import Link from "next/link";

function TierBadge({ tier }: { tier: "free" | "plus" | "pro" }) {
    const styles: Record<string, string> = {
        free: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        plus: "bg-amber-50 text-amber-800 border border-amber-200",
        pro: "bg-violet-50 text-violet-800 border border-violet-200",
    };
    return (
        <span className={`ml-auto text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full ${styles[tier]}`}>
            {tier.toUpperCase()}
        </span>
    );
}

export default function HeaderNavCalculators() {
    return (
        <div className="min-w-[280px] max-h-[70vh] overflow-y-auto p-2">
            {CALCULATORS.map((c) => (
                <Link
                    key={c.slug}
                    href={c.path}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 text-sm text-neutral-900"
                >
                    <span className="truncate">{c.title}</span>
                    <TierBadge tier={c.tier} />
                </Link>
            ))}
            <div className="mt-2 border-t border-neutral-200 pt-2">
                <Link
                    href="/calculators"
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-900 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                >
                    View all calculators →
                </Link>
            </div>
        </div>
    );
}
