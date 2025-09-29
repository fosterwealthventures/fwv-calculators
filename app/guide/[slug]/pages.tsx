import Link from "next/link";
import Script from "next/script";

import GuideNav from "@/components/GuideNav";
import AdInSidebar from "@/components/ads/AdInSidebar";
import AdBannerTop from "@/components/ads/AdBannerTop";
import HtmlWithAutoAd from "@/components/ads/HtmlWithAutoAd";
import AutoToc from "@/components/toc/AutoToc";

export const revalidate = 60;

export default function GuidePage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // TODO: replace with your real guide loader
  const title = slug.replace(/-/g, " ");
  const html = "<h2>Overview</h2><p>Guide content…</p>"; // <-- define html

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "/guide" },
      { "@type": "ListItem", position: 3, name: title, item: `/guide/${slug}` },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    author: { "@type": "Organization", name: "Foster Wealth Ventures" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `/guide/${slug}` },
  };

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[1fr_320px]">
      {/* JSON-LD (SEO) */}
      <Script id="breadcrumb-jsonld" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script id="article-jsonld" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Main */}
      <div>
        <nav className="mb-6 text-sm text-gray-600" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/guide" className="hover:underline">Guides</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-500">{title}</span>
        </nav>

        {/* Above-the-fold banner for long guides */}
        <AdBannerTop />

        <h1 className="mt-4 text-3xl font-bold text-brand-green">{title}</h1>

        {/* ToC on the left column for guides */}
        <div className="mt-6">
          <AutoToc html={html} title="Guide sections" />
        </div>

        <div className="prose mt-4 max-w-none">
          {/* Auto insert in-content ad after first H2, fallback after first P */}
          <HtmlWithAutoAd html={html} />
        </div>

        {/* Related */}
        <section className="mt-12 border-t pt-6">
          <h2 className="text-xl font-semibold text-brand-green">Related</h2>
          <ul className="mt-4 list-disc list-inside text-gray-700">
            <li><Link href="/guide/roi-vs-annualized-roi">Guide: ROI vs Annualized ROI</Link></li>
            <li><Link href="/guide/mortgage-payment-breakdown">Guide: Mortgage Payment Breakdown</Link></li>
            <li><Link href="/dashboard">Explore All Calculators</Link></li>
          </ul>
        </section>
      </div>

      {/* Right rail */}
      <aside className="sticky top-6 h-fit space-y-8">
        <GuideNav className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" />
        <AdInSidebar width={300} height={600} />
      </aside>
    </div>
  );
}
