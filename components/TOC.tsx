"use client";
import { useEffect, useState } from "react";

type TItem = { id: string; text: string; level: number };

export default function TOC() {
    const [items, setItems] = useState<TItem[]>([]);

    useEffect(() => {
        const nodes = Array.from(
            document.querySelectorAll(".article h2, .article h3")
        ) as HTMLElement[];

        const mapped = nodes.map((n) => {
            if (!n.id)
                n.id = (n.textContent || "")
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");
            // keep headings visible under a fixed header
            n.style.scrollMarginTop = "6rem";

            return {
                id: n.id,
                text: n.textContent || "",
                level: n.tagName === "H2" ? 2 : 3,
            };
        });

        setItems(mapped);
    }, []);

    if (!items.length) return null;

    return (
        <nav aria-label="Table of contents">
            <div className="mb-3 text-xs uppercase tracking-wide text-plum-700/90 dark:text-plum-200/90">
                Steps
            </div>
            <ul className="space-y-1 text-sm">
                {items.map((i) => (
                    <li key={i.id} className={i.level === 3 ? "pl-4" : ""}>
                        <a
                            href={`#${i.id}`}
                            className="block rounded px-2 py-1 text-plum-800 hover:bg-plum-50 dark:text-plum-100 dark:hover:bg-white/10"
                        >
                            {i.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
