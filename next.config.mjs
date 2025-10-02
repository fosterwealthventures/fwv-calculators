// next.config.mjs

const AD_HOSTS = [
  // Google Ads / Analytics / Tag Manager image & tracking hosts
  "pagead2.googlesyndication.com",
  "tpc.googlesyndication.com",
  "googleads.g.doubleclick.net",
  "www.googletagmanager.com",
  "www.google-analytics.com",
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- Core ---
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,
  productionBrowserSourceMaps: false,
  staticPageGenerationTimeout: 180,

  // --- Build-time checks ---
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },

  // --- Webpack tweaks ---
  webpack(config, { dev }) {
    if (dev) config.devtool = "source-map";
    return config;
  },

  // --- HTTP headers ---
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },

  // --- Redirects (keep/add here as needed) ---
  async redirects() {
    return [
      // Guides plural → singular
      { source: "/guides", destination: "/guide", permanent: true },
      { source: "/guides/:path*", destination: "/guide/:path*", permanent: true },

      // Short/legacy guide slugs → canonical slugs
      { source: "/guide/roi", destination: "/guide/roi-vs-annualized-roi", permanent: true },

      // ✅ NEW: fix the three broken legacy links
      { source: "/guide/break-even", destination: "/guide/break-even-made-simple", permanent: true },
      { source: "/guide/mortgage-payment", destination: "/guide/mortgage-payment-breakdown", permanent: true },
      { source: "/guide/freelancer-rate", destination: "/guide/set-your-freelance-rate-right", permanent: true },

      // Restaurant variants you already normalize
      { source: "/guide/restaurant-tip-tab-split", destination: "/guide/restaurant-tips-tabs-split", permanent: true },
      { source: "/guide/restaurant-tips-tab-split", destination: "/guide/restaurant-tips-tabs-split", permanent: true },
      { source: "/guide/restaurant-tip-tabs-split", destination: "/guide/restaurant-tips-tabs-split", permanent: true },

      // Trailing slash cleanups (harmless; keeps URLs consistent)
      { source: "/guide/mortgage-payment-breakdown/", destination: "/guide/mortgage-payment-breakdown", permanent: true },
      { source: "/guide/simple-vs-compound-interest/", destination: "/guide/simple-vs-compound-interest", permanent: true },
    ];
  },

  // --- Images ---
  images: {
    remotePatterns: [
      ...AD_HOSTS.map((hostname) => ({ protocol: "https", hostname })),
      // Add any other image domains you need
    ],
  },
};

export default nextConfig;
