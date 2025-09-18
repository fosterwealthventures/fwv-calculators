// next.config.js
const isDev = process.env.NODE_ENV !== "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Avoid eval in dev so CSP doesn't need 'unsafe-eval'
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = "source-map"; // no eval in dev
    }
    return config;
  },

  // Send CSP headers only in production
  async headers() {
    if (isDev) return []; // no CSP in dev

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
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join("; ");

    const securityHeaders = [
      { key: "Content-Security-Policy", value: cspProd },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];

    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

module.exports = nextConfig;
