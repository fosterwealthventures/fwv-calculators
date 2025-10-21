// components/HeaderNavCalculators.tsx
"use client";

import { CALCULATORS } from "@/lib/calculators";
import Link from "next/link";

function TierBadge({ tier }: { tier: "free" | "plus" | "pro" }) {
    const styles: Record<string, string> = {
        free: "bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-white",
        plus: "bg-amber-500/20 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
        pro: "bg-emerald-600/15 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    };
    return (
        <span className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-semibold ${styles[tier]}`}>
            {tier.toUpperCase()}
        </span>
    );
}

export default function HeaderNavCalculators() {
    return (
        <div className="w-72 max-w-full p-2">
            {CALCULATORS.map((c) => (
                <Link
                    key={c.slug}
                    href={c.path}
                    className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
                >
                    <span className="truncate">{c.title}</span>
                    <TierBadge tier={c.tier} />
                </Link>
            ))}
            <div className="mt-2 border-t pt-2">
                <Link
                    href="/calculators"
                    className="block rounded-md px-3 py-2 text-sm font-medium text-brand-green hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                    View all calculators →
                </Link>
            </div>
        </div>
    );
}
