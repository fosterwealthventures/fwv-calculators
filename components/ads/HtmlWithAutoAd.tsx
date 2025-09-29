"use client";

import React from "react";
import AdInContent from "@/components/ads/AdInContent";

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

function addHeadingIds(html: string) {
  html = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_m, attrs, inner) => {
    const id = slugify(inner);
    if (/\sid=/.test(attrs)) return `<h2${attrs}>${inner}</h2>`;
    return `<h2 id="${id}"${attrs}>${inner}</h2>`;
  });
  html = html.replace(/<h3([^>]*)>([\s\S]*?)<\/h3>/gi, (_m, attrs, inner) => {
    const id = slugify(inner);
    if (/\sid=/.test(attrs)) return `<h3${attrs}>${inner}</h3>`;
    return `<h3 id="${id}"${attrs}>${inner}</h3>`;
  });
  return html;
}

/** Injects <AdInContent /> after first </h2>, fallback after first </p>. */
export default function HtmlWithAutoAd({
  html,
  slot = process.env.NEXT_PUBLIC_ADSENSE_INCONTENT_SLOT,
}: {
  html: string;
  slot?: string;
}) {
  if (!html) return null;
  const withIds = addHeadingIds(html);

  const closeH2 = /<\/h2>/i;
  if (closeH2.test(withIds)) {
    const [head, ...restParts] = withIds.split(closeH2);
    const rest = restParts.join("</h2>");
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: head + "</h2>" }} />
        <div className="my-10"><AdInContent slot={slot} /></div>
        <div dangerouslySetInnerHTML={{ __html: rest }} />
      </>
    );
  }

  const closeP = /<\/p>/i;
  if (closeP.test(withIds)) {
    const [head, ...restParts] = withIds.split(closeP);
    const rest = restParts.join("</p>");
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: head + "</p>" }} />
        <div className="my-10"><AdInContent slot={slot} /></div>
        <div dangerouslySetInnerHTML={{ __html: rest }} />
      </>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: withIds }} />;
}
