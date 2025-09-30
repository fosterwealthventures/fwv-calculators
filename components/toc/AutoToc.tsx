"use client";

import React, { useMemo } from "react";

// mirror slugify used in HtmlWithAutoAd so anchors match
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

// extracts h2/h3 from raw HTML and returns [{level:2|3, text, id}]
function extractHeadings(html: string) {
  const results: { level: 2 | 3; text: string; id: string }[] = [];
  if (!html) return results;

  const h2 = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
  const h3 = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)];

  for (const m of h2) {
    const text = m[1].replace(/<[^>]+>/g, "").trim();
    if (text) results.push({ level: 2, text, id: slugify(text) });
  }
  for (const m of h3) {
    const text = m[1].replace(/<[^>]+>/g, "").trim();
    if (text) results.push({ level: 3, text, id: slugify(text) });
  }
  return results;
}

export default function AutoToc({
  html,
  title = "On this page",
}: {
  html: string;
  title?: string;
}) {
  const items = useMemo(() => extractHeadings(html), [html]);
  if (!items.length) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((h, idx) => (
          <li key={idx} className={h.level === 3 ? "ml-4" : ""}>
            <a
              className="text-gray-700 hover:text-brand-green hover:underline"
              href={`#${h.id}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
