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
        <nav aria-label="Table of contents" className="card-regal p-4 text-sm sticky top-24">
            <h3 className="text-sm font-semibold mb-2">On this page</h3>
            <ul className="space-y-2">
                {items.map(i => (
                    <li key={i.id} className={i.level === 3 ? "pl-3" : ""}>
                        <a className="link-regal" href={`#${i.id}`}>{i.text}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}