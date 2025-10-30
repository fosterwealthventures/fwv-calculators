// app/sitemap.ts (or root-level sitemap.ts depending on your setup)
import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

// Prefer env, fall back to your .store domain
const base =
  process.env.SITE_URL?.replace(/\/+$/, "") ||
  "https://www.fosterwealthventures.store";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/guide`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Guide detail pages (Free + Paid)
  const guideRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/guide/roi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/guide/break-even`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/guide/mortgage-payment`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/guide/simple-vs-compound-interest`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/guide/freelancer-rate`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },

    // Paid (Plus)
    {
      url: `${base}/guide/savings-growth`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/guide/debt-payoff`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const posts = getAllPosts();
  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date || now),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...guideRoutes, ...blogRoutes];
}
