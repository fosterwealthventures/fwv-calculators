import { getAllPosts } from "@/lib/blog";
import { buildCalculatorSitemap } from "@/lib/calculators";
import { getAllGuides } from "@/lib/guides";
import { MetadataRoute } from "next";

const base =
  process.env.SITE_URL?.replace(/\/+$/, "") ||
  "https://fosterwealthventures.store";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/calculators`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const calculatorRoutes = buildCalculatorSitemap(base, false).map((entry) => ({
    url: entry.url,
    lastModified: new Date(entry.lastModified),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  })) satisfies MetadataRoute.Sitemap;

  const guideRoutes: MetadataRoute.Sitemap = getAllGuides().map((guide) => ({
    url: `${base}/guide/${guide.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.55,
  }));

  const posts = getAllPosts();
  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date || now),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...calculatorRoutes, ...guideRoutes, ...blogRoutes];
}
