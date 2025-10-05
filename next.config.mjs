/* eslint-env node */
// filepath: next.config.mjs

const isDev = process.env.NODE_ENV !== "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Ignore ESLint during builds (you can re-enable later)
  eslint: { ignoreDuringBuilds: true },

  // Nicer source maps in dev
  webpack: (config, { dev }) => {
    if (dev) config.devtool = "source-map";
    return config;
  },

  // ✅ Redirects (unchanged)
  async redirects() {
    return [
      { source: "/guides", destination: "/guide", permanent: true },
      { source: "/guides/:path*", destination: "/guide/:path*", permanent: true },

      { source: "/guide/mortage-payment-breakdown", destination: "/guide/mortgage-payment-breakdown", permanent: true },
      { source: "/guide/mortgage-payment", destination: "/guide/mortgage-payment-breakdown", permanent: true },
      { source: "/guide/freelancer-rate", destination: "/guide/set-your-freelance-rate-right", permanent: true },
      { source: "/guide/roi", destination: "/guide/roi-vs-annualized-roi", permanent: true },
      { source: "/guide/restaurant-tip-tab-split", destination: "/guide/restaurant-tips-tabs-split", permanent: true },

      { source: "/calculators", destination: "/dashboard", permanent: true },

      { source: "/guide/debt-planner", destination: "/guide/debt-payoff", permanent: true },
    ];
  },

  // ✅ Security headers incl. CSP for AdSense + GA
  async headers() {
    if (isDev) return [];

    // Allow the AdSense script and its ad iframes/XHRs while keeping a tight policy elsewhere.
    const csp = [
      "default-src 'self'",
      // AdSense + GA: allow their script hosts (include 'unsafe-inline' for inlined bootstraps; add 'unsafe-eval' if you load 3rd libs that need it)
      "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://googleads.g.doubleclick.net https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      // Images from anywhere over https plus data/blob; explicitly allow common AdSense/GA hosts
      "img-src 'self' data: blob: https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://googleads.g.doubleclick.net https://www.google-analytics.com https://www.googletagmanager.com",
      "font-src 'self' data:",
      // 👇 This was the blocker: allow AdSense/XHR endpoints
      "connect-src 'self' https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://googleads.g.doubleclick.net https://www.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net",
      // Ad iframes
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
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  // ✅ Remote images (unchanged)
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
