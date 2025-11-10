"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
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
    const rootRef = useRef<HTMLDivElement | null>(null);

    // Client-side KaTeX rendering for inline ($...$) and block ($$...$$) math.
    useEffect(() => {
        let cancelled = false;

        function renderKatexIn(el: HTMLElement) {
            try {
                // @ts-ignore
                const k = (window as any).katex;
                if (!k) return false;
                // First pass: if raw math is still present (e.g., $$...$$ or \frac without $),
                // wrap it so it can be rendered below.
                try {
                    autoWrapMath(el);
                } catch {}
                el.querySelectorAll('[data-katex-display]').forEach((n) => {
                    try {
                        const t = (n as HTMLElement).textContent || "";
                        (n as HTMLElement).innerHTML = k.renderToString(t, {
                            displayMode: true,
                            throwOnError: false,
                        });
                    } catch {}
                });
                el.querySelectorAll('[data-katex-inline]').forEach((n) => {
                    try {
                        const t = (n as HTMLElement).textContent || "";
                        (n as HTMLElement).innerHTML = k.renderToString(t, {
                            displayMode: false,
                            throwOnError: false,
                        });
                    } catch {}
                });
                return true;
            } catch {
                return false;
            }
        }

        // Convert raw "$$...$$" or "$...$" or bare LaTeX tokens (\frac, \sqrt, \times, etc.) into
        // elements with data-katex-* markers so they can be rendered by KaTeX.
        function autoWrapMath(root: HTMLElement) {
            const skip = new Set(["CODE", "PRE", "SCRIPT", "STYLE", "KBD", "SAMP"]);
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
                acceptNode(node) {
                    const p = node.parentElement;
                    if (!p || skip.has(p.tagName)) return NodeFilter.FILTER_REJECT;
                    const s = node.nodeValue || "";
                    return /\$|\\(frac|sqrt|times|div|cdot|pm|le|ge|neq|approx|alpha|beta|gamma|delta|theta|lambda|mu|sigma|omega)/.test(s)
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT;
                }
            } as any);

            const toProcess: Text[] = [];
            let n: any;
            while ((n = walker.nextNode())) toProcess.push(n as Text);

            for (const textNode of toProcess) {
                const s = textNode.nodeValue || "";
                let replaced = false;

                // Display blocks $$...$$
                if (/\$\$[^$]+\$\$/.test(s)) {
                    const html = s.replace(/\$\$([^$]+)\$\$/g, (_m, p1) => `<div data-katex-display>${p1}</div>`);
                    replaceTextNodeWithHTML(textNode, html);
                    replaced = true;
                }

                // Inline $...$
                if (!replaced && /\$[^$]+\$/.test(s)) {
                    const html = s.replace(/\$([^$]+)\$/g, (_m, p1) => `<span data-katex-inline>${p1}</span>`);
                    replaceTextNodeWithHTML(textNode, html);
                    replaced = true;
                }

                // Bare LaTeX tokens (no $ wrappers)
                if (!replaced && /\\(frac|sqrt|times|div|cdot|pm|le|ge|neq|approx)/.test(s)) {
                    const html = `<span data-katex-inline>${s}</span>`;
                    replaceTextNodeWithHTML(textNode, html);
                }
            }

            function replaceTextNodeWithHTML(node: Text, html: string) {
                const frag = document.createElement('span');
                frag.innerHTML = html;
                const parent = node.parentNode as Node;
                parent.replaceChild(frag, node);
                // unwrap helper span (keep its children)
                while (frag.firstChild) parent.insertBefore(frag.firstChild, frag);
                parent.removeChild(frag);
            }
        }

        const container = rootRef.current || document.body;

        // Try immediately, then poll briefly until KaTeX is available
        let done = renderKatexIn(container);
        let tries = 0;
        const timer = done
            ? undefined
            : setInterval(() => {
                  if (cancelled) return;
                  tries++;
                  if (renderKatexIn(container) || tries > 40) {
                      if (timer) clearInterval(timer);
                  }
              }, 100);

        // Observe new content (client navigations or dynamic updates)
        const mo = new MutationObserver((muts) => {
            for (const m of muts) {
                if (m.addedNodes && m.addedNodes.length) {
                    renderKatexIn(container);
                    break;
                }
            }
        });
        try {
            mo.observe(container, { childList: true, subtree: true });
        } catch {}

        return () => {
            cancelled = true;
            if (timer) clearInterval(timer);
            try { mo.disconnect(); } catch {}
        };
    }, []);

    return (
        <div ref={rootRef} className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
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
