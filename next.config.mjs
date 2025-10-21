/* eslint-env node */
// Final Next.js config with unified CSP for Google Ads/CMP + Analytics (ESM)

const isDev = process.env.NODE_ENV !== 'production';
const isPreview = process.env.VERCEL_ENV === 'preview';
const skipCsp = process.env.SKIP_CSP === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },

  async headers() {
    if (skipCsp) return [];

    const csp = [
      "default-src 'self'",
      // Allow Google Ads/CMP/Analytics and ad traffic quality endpoints
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://*.googlesyndication.com https://*.doubleclick.net https://adservice.google.com https://*.adtrafficquality.google",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://www.google-analytics.com https://stats.g.doubleclick.net https://*.googlesyndication.com https://*.doubleclick.net",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.adtrafficquality.google",
      "frame-src 'self' https://www.googletagmanager.com https://*.google.com https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "base-uri 'self'",
      "form-action 'self' https://www.google.com"
    ].join('; ');

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" }
        ],
      },
    ];
  },
};

export default nextConfig;
