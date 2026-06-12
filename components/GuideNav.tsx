// components/GuideNav.tsx
"use client";

import Link from "next/link";
import { getAllGuides } from "@/lib/guides";

type NavLink = { href: string; title: string };

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

      {/* Guide list */}
      <ul className="space-y-2">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guide/${g.slug}`}
              className="text-sm text-brand-green hover:underline"
            >
              {g.title}
            </Link>
          </li>
        ))}
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
          href="/dashboard" /* change if your calculators page uses a different route */
          className="inline-flex items-center rounded-md border border-emerald-600 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
        >
          All Calculators
        </Link>
      </div>
    </nav>
  );
}
