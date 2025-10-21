"use client";

import { ReactNode, useState } from "react";
import TOC from "./TOC";

/**
 * Blog/Article container
 * - Centers the article like Guides
 * - Right-side sticky TOC on desktop, collapsible TOC on mobile
 * - No hero box; headings are styled purple via global .article rules
 * - Keeps your readable line length & type sizes
 */
export default function PostContainer({ children }: { children: ReactNode }) {
    const [tocOpen, setTocOpen] = useState(false);

    return (
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Grid: [left spacer] [article] [right TOC] */}
            <main className="
        mx-auto grid max-w-6xl grid-cols-1 gap-6 md:gap-8
        lg:grid-cols-[minmax(0,1fr)_minmax(0,720px)_minmax(260px,320px)]
      ">
                {/* left spacer keeps the article visually centered on large screens */}
                <div className="hidden lg:block" aria-hidden />

                {/* ARTICLE */}
                <article
                    className="
            article prose max-w-none
            text-[18px] md:text-[19px] lg:text-[20px] leading-[1.85]
            prose-neutral dark:prose-invert
          "
                >
                    {children}
                </article>

                {/* DESKTOP TOC (sticky on the right) */}
                <aside className="hidden lg:block">
                    <div className="sticky top-[calc(var(--header-h,72px)+24px)] p-3 toc-enhanced">
                        <TOC />
                    </div>
                </aside>
            </main>

            {/* MOBILE TOC (collapsible) */}
            <div className="lg:hidden mx-auto max-w-3xl pt-2 pb-6">
                <details
                    open={tocOpen}
                    onToggle={(e) => setTocOpen((e.target as HTMLDetailsElement).open)}
                    className="rounded-2xl border bg-white/95 p-0 shadow-sm dark:border-plum-800 dark:bg-plum-900/40"
                >
                    <summary className="cursor-pointer list-none px-4 py-2 text-sm font-medium text-plum-900 dark:text-plum-100">
                        {tocOpen ? "Hide" : "Show"} Table of contents
                    </summary>
                    <div className="px-3 pb-3">
                        <TOC />
                    </div>
                </details>
            </div>
        </div>
    );
}
