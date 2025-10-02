// components/GuideNav.tsx
"use client";

import Link from "next/link";
import { getAllGuides, tierChip } from "@/lib/guides";

type NavLink = { href: string; title: string };

function Chip({ label }: { label: string }) {
  // Simple color logic: Free = neutral, Plus = emerald, Pro/Premium = amber (gold-ish)
  const cls =
    label.startsWith("Free")
      ? "bg-gray-50 text-gray-700 border-gray-300"
      : label.startsWith("Plus")
      ? "bg-emerald-50 text-emerald-700 border-emerald-600"
      : "bg-amber-50 text-amber-700 border-amber-600"; // "Pro / Premium"
  return (
    <span
      className={`ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}

export default function GuideNav({
  className = "",
  prev,
  next,
}: {
  className?: string;
  /** Optional “previous article” link */
  prev?: NavLink;
  /** Optional “next article” link */
  next?: NavLink;
}) {
  const guides = getAllGuides();

  return (
    <nav className={className}>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Guides
      </h2>

      {/* Guide list with plan chip */}
      <ul className="space-y-2">
        {guides.map((g) => {
          const chip = tierChip(g.minTier);
          return (
            <li key={g.slug} className="flex items-center justify-between">
              <Link
                href={`/guide/${g.slug}`}
                className="text-sm text-brand-green hover:underline"
              >
                {g.title}
              </Link>
              <Chip label={chip} />
            </li>
          );
        })}
      </ul>

      {/* Divider */}
      <div className="my-4 h-px bg-gray-200" />

      {/* Prev/Next pager (renders only if provided) */}
      {(prev || next) && (
        <div className="flex items-center justify-between gap-2">
          <div>
            {prev ? (
              <Link
                href={prev.href}
                className="inline-flex items-center rounded-md border border-gray-300 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
              >
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
          </div>
          <div>
            {next ? (
              <Link
                href={next.href}
                className="inline-flex items-center rounded-md border border-gray-300 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
              >
                {next.title} →
              </Link>
            ) : null}
          </div>
        </div>
      )}

      {/* Quick jump to the calculators hub */}
      <div className="mt-4">
        <Link
          href="/calculators"
          className="inline-flex items-center rounded-md border border-emerald-600 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
        >
          All Calculators
        </Link>
      </div>
    </nav>
  );
}
