"use client";
import { useEffect, useState } from "react";

export default function TOC() {
    const [items, setItems] = useState<{ id: string; text: string; level: number }[]>([]);

    useEffect(() => {
        const nodes = Array.from(document.querySelectorAll(".article h2, .article h3"));
        setItems(nodes.map((n) => {
            if (!n.id) n.id = (n.textContent || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return { id: n.id, text: n.textContent || "", level: n.tagName === "H2" ? 2 : 3 };
        }));
    }, []);

    if (!items.length) return null;

    return (
        <nav aria-label="Table of contents" className="toc-enhanced">
            <ul>
                {items.map(i => (
                    <li key={i.id}>
                        <a href={`#${i.id}`}>
                            {i.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}