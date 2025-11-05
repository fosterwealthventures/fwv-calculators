/* eslint-env node */
// Next.js config with basic CSP (ready for ad network configuration)

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
      // Allow Adsterra ads
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://pl27994832.effectivegatecpm.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https: https://pl27994832.effectivegatecpm.com",
      "font-src 'self' data: https:",
      "connect-src 'self' https://pl27994832.effectivegatecpm.com",
      "frame-src 'self' https://pl27994832.effectivegatecpm.com",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "base-uri 'self'",
      "form-action 'self'"
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
