// next.config.js
const isDev = process.env.NODE_ENV !== "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Ignore ESLint errors in Vercel builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Avoid unsafe eval in dev so CSP is simpler
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = "source-map"; // better debugging in dev
    }
    return config;
  },

  // ✅ Send CSP headers only in production
  async headers() {
    if (isDev) return []; // no CSP in dev, easier debugging

    const cspProd = [
      "default-src 'self'",
      "script-src 'self' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
      "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
      "media-src 'self' blob: data:",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspProd,
          },
        ],
      },
    ];
  },

  // ✅ Allow external images (ads, analytics, etc.)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pagead2.googlesyndication.com" },
      { protocol: "https", hostname: "tpc.googlesyndication.com" },
      { protocol: "https", hostname: "www.google-analytics.com" },
    ],
  },
};

module.exports = nextConfig;
