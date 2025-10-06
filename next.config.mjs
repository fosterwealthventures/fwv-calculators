/* eslint-env node */
// filepath: next.config.mjs

const isDev = process.env.NODE_ENV !== "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Allow builds to pass even if ESLint has warnings; re-enable when ready
  eslint: { ignoreDuringBuilds: true },

  webpack: (config, { dev }) => {
    if (dev) config.devtool = "source-map";
    return config;
  },

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

  async headers() {
    if (isDev) return [];

    // ✅ CSP that allows AdSense while staying strict elsewhere
    const csp = [
      "default-src 'self'",
      // Scripts: AdSense, DoubleClick, Tag Manager, GA
      "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google https://*.adservice.google.com https://*.google.com https://www.googletagmanager.com https://*.google-analytics.com",
      "script-src-elem 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google https://*.adservice.google.com https://*.google.com https://www.googletagmanager.com https://*.google-analytics.com",
      // Styles (inline needed for ads)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Images from self + Google/DoubleClick + data/blob
      "img-src 'self' data: blob: https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google https://*.adservice.google.com https://*.google.com https://*.google-analytics.com https://www.googletagmanager.com",
      // Connections/XHR/beacons used by AdSense & GA
      "connect-src 'self' https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google https://*.adservice.google.com https://*.google.com https://*.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net",
      // Iframes (ads)
      "frame-src https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google https://*.adservice.google.com https://*.google.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com data:",
      // Media/workers (safe defaults)
      "media-src 'self' blob: data:",
      "worker-src 'self' blob:",
      // Lockdowns
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'"
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

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pagead2.googlesyndication.com" },
      { protocol: "https", hostname: "*.googlesyndication.com" },
      { protocol: "https", hostname: "*.doubleclick.net" },
      { protocol: "https", hostname: "*.google.com" },
      { protocol: "https", hostname: "www.googletagmanager.com" },
      { protocol: "https", hostname: "*.google-analytics.com" },
    ],
  },
};

export default nextConfig;
