// app/blog/[slug]/page.tsx
import { AdInContentSafe as AdInContent } from "@/components/ads";
import PostContainer from "@/components/PostContainer";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
// dynamic marked import at render time
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";

export const revalidate = 60;

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const { slug } = params;
    const parsed = getPostBySlug(slug);
    if (!parsed) return {};
    const { meta } = parsed;
    const title = meta.title;
    const metaDescription =
      meta.meta_description || meta.excerpt || "A practical financial guide from Foster Wealth Ventures";

    return {
      title,
      description: metaDescription,
      openGraph: { title, description: metaDescription, type: "article" },
      twitter: { card: "summary_large_image", title, description: metaDescription },
    };
  } catch (e) {
    console.error("[blog] generateMetadata error:", e);
    return {};
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const parsed = getPostBySlug(slug);
  if (!parsed) return notFound();
  const { meta, body } = parsed;
  const title = meta.title;
  const date = meta.date;
  const metaDescription = meta.meta_description || meta.excerpt || "A practical financial guide from Foster Wealth Ventures";

  // strip leading H1 if present to avoid duplicate titles
  const cleanBody = (body || "").replace(/^\s*#\s+.+?\n+/, "");

  // server-safe sanitizer (lazy require DOMPurify; fallback to minimal scrub)
  function sanitizeHtml(html: string): string {
    try {
      const req: any = (eval as any)("require");
      const DOMPurify = req("isomorphic-dompurify");
      return DOMPurify.sanitize(html ?? "", { USE_PROFILES: { html: true } });
    } catch (e) {
      try {
        let out = html || "";
        out = out.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
        out = out.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
        out = out.replace(/<(?:iframe|object|embed)[\s\S]*?>[\s\S]*?<\/(?:iframe|object|embed)>/gi, "");
        out = out.replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"');
        out = out.replace(/\son[a-z]+\s*=\s*(["']).*?\1/gi, "");
        return out;
      } catch {}
      console.error("sanitizeHtml failed", e);
      return html;
    }
  }

  // Markdown to HTML with guards
  let html = "" as string;
  try {
    const mod: any = await import("marked");
    const m: any = mod.marked || mod.default || mod;
    const parse = typeof m.parse === "function" ? m.parse.bind(m) : m;
    html = parse(cleanBody, { breaks: true, gfm: true }) as string;
  } catch (e) {
    console.error("marked.parse failed for slug:", slug, e);
    html = "<p>Sorry, this article could not be rendered.</p>";
  }

  // light KaTeX hook then sanitize (avoid lookbehind for compatibility)
  let processedHtml = "";
  try {
    const withBlocks = (html || "").replace(/\$\$([^$]+)\$\$/g, '<div data-katex-display>$1</div>');
    const withInline = withBlocks.replace(/(^|[^\\])\$([^$]+)\$/g, (_m, p1, p2) => `${p1}<span data-katex-inline>${p2}</span>`);
    processedHtml = sanitizeHtml(withInline);
  } catch (e) {
    console.error("[blog] postprocess failed for slug:", slug, e);
    processedHtml = sanitizeHtml(html || "");
  }

  return (
    <>
      <Script id="katex-config" strategy="afterInteractive">
        {`
          document.addEventListener('DOMContentLoaded', function() {
            if (typeof katex !== 'undefined') {
              document.querySelectorAll('[data-katex-display]').forEach(function(el) {
                try { el.innerHTML = katex.renderToString(el.textContent, { displayMode: true, throwOnError: false }); } catch {}
              });
              document.querySelectorAll('[data-katex-inline]').forEach(function(el) {
                try { el.innerHTML = katex.renderToString(el.textContent, { displayMode: false, throwOnError: false }); } catch {}
              });
            }
          });
        `}
      </Script>

      {/* JSON-LD Structured Data */}
      <Script id="article-json-ld" strategy="beforeInteractive" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description: metaDescription,
          author: { "@type": "Organization", name: "Foster Wealth Ventures" },
          datePublished: date,
          dateModified: date,
          image: "/fwv-logo-gold.svg",
        })}
      </Script>

      {/* HERO */}
      <section className="bg-gradient-to-b from-[#2b1a3d] to-[#3b2a55] py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <nav className="hero-breadcrumbs mb-3 text-sm text-white/70" aria-label="Breadcrumb">
            <Link href="/" className="text-white/90 hover:text-white underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-sm">Home</Link>
            <span className="mx-2">&gt;</span>
            <Link href="/blog" className="text-white/90 hover:text-white underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-sm">Blog</Link>
          </nav>

          <p className="text-sm mb-2 text-plum-200/90">{new Date(date).toLocaleDateString()}</p>

          <h1
            className="font-extrabold leading-tight drop-shadow-sm text-plum-200 md:text-plum-100"
            style={{ fontSize: "clamp(34px,6vw,48px)" }}
          >
            {title}
          </h1>
        </div>
      </section>

      {/* ARTICLE + TOC are fully handled inside PostContainer */}
      <div className="mx-auto max-w-3xl px-4 py-4">
        <AdInContent />
      </div>
      <PostContainer>
        <div
          className="article prose lg:prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
      </PostContainer>
    </>
  );
}
