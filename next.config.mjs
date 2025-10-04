/* eslint-env node */
// filepath: c:\fwv-calculators\next.config.mjs

// next.config.mjs
const isDev = process.env.NODE_ENV !== "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Ignore ESLint during builds (re-enable later if you want)
  eslint: { ignoreDuringBuilds: true },

  // Nicer source maps in dev only
  webpack: (config, { dev }) => {
    if (dev) config.devtool = "source-map";
    return config;
  },

  // ✅ Combined redirects: /guides → /guide + guide slug fixes + old calculators
  async redirects() {
    return [
      // Guides plural → singular
      { source: "/guides", destination: "/guide", permanent: true },
      {
        source: "/guides/:path*",
        destination: "/guide/:path*",
        permanent: true,
      },

      // Guide slug fixes (misspellings and legacy names)
      {
        source: "/guide/mortage-payment-breakdown",
        destination: "/guide/mortgage-payment-breakdown",
        permanent: true,
      },
      {
        source: "/guide/mortgage-payment",
        destination: "/guide/mortgage-payment-breakdown",
        permanent: true,
      },
      {
        source: "/guide/freelancer-rate",
        destination: "/guide/set-your-freelance-rate-right",
        permanent: true,
      },
      {
        source: "/guide/roi",
        destination: "/guide/roi-vs-annualized-roi",
        permanent: true,
      },
      {
        source: "/guide/restaurant-tip-tab-split",
        destination: "/guide/restaurant-tips-tabs-split",
        permanent: true,
      },

      // Old calculators page → Dashboard
      {
        source: "/calculators",
        destination: "/dashboard",
        permanent: true,
      },

      // Debt planner → payoff
      {
        source: "/guide/debt-planner",
        destination: "/guide/debt-payoff",
        permanent: true,
      },
    ];
  },

  async headers() {
    if (isDev) return [];

    // Works-first CSP for GA + AdSense (tighten later if needed)
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net",
      "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.youtube.com",
      "media-src 'self' blob: data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pagead2.googlesyndication.com" },
      { protocol: "https", hostname: "tpc.googlesyndication.com" },
      { protocol: "https", hostname: "www.google-analytics.com" },
      { protocol: "https", hostname: "googleads.g.doubleclick.net" },
      { protocol: "https", hostname: "www.googletagmanager.com" },
    ],
  },
};

export default nextConfig;
