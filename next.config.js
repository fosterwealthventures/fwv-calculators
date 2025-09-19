/* eslint-env node */
// next.config.js
const isDev = process.env.NODE_ENV !== "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fail builds on lint errors (keep CI honest)
  eslint: { ignoreDuringBuilds: false },

  reactStrictMode: true,

  // Avoid eval in dev so your CSP doesn't need 'unsafe-eval'
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = "source-map"; // no eval in dev
    }
    return config;
  },

  // Send CSP headers only in production
  async headers() {
    if (isDev) return []; // no CSP in dev for easier DX

    const cspProd = [
      "default-src 'self'",
      // no 'unsafe-eval' in production
      "script-src 'self' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
      "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
      "media-src 'self' blob: data:",
      "object-src 'none'",
      "base-uri 'self'"
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspProd }
        ]
      }
    ];
  },

  // (optional) allow images from Google ad/analytics CDNs if you ever use next/image
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pagead2.googlesyndication.com" },
      { protocol: "https", hostname: "tpc.googlesyndication.com" },
      { protocol: "https", hostname: "www.google-analytics.com" }
    ]
  }
};

export default nextConfig;
