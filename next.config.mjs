/* eslint-env node */
// filepath: next.config.mjs

const isDev = process.env.NODE_ENV !== 'production';
const isPreview = process.env.VERCEL_ENV === 'preview'; // 'preview' | 'production' | undefined locally
const skipCsp = process.env.SKIP_CSP === 'true';        // handy bypass for targeted testing

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  eslint: { ignoreDuringBuilds: true },

  // Do NOT set config.devtool in dev; Next handles this for speed.
  webpack: (config, { /* dev, isServer */ }) => {
    return config;
  },

  // Enable this only if you truly need client-side source maps in prod
  // (slightly larger bundles):
  // productionBrowserSourceMaps: true,

  async redirects() {
    return [
      { source: '/guides', destination: '/guide', permanent: true },
      { source: '/guides/:path*', destination: '/guide/:path*', permanent: true },

      { source: '/guide/mortage-payment-breakdown', destination: '/guide/mortgage-payment-breakdown', permanent: true },
      { source: '/guide/mortgage-payment', destination: '/guide/mortgage-payment-breakdown', permanent: true },
      { source: '/guide/freelancer-rate', destination: '/guide/set-your-freelance-rate-right', permanent: true },
      { source: '/guide/roi', destination: '/guide/roi-vs-annualized-roi', permanent: true },
      { source: '/guide/restaurant-tip-tab-split', destination: '/guide/restaurant-tips-tabs-split', permanent: true },

      { source: '/calculators', destination: '/dashboard', permanent: true },
      { source: '/guide/debt-planner', destination: '/guide/debt-payoff', permanent: true },
    ];
  },

  async headers() {
    if (isDev || skipCsp) return [];

    const allowVercelLive = isPreview ? ' https://vercel.live' : '';

    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",

      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://www.googletagservices.com https://www.googletagmanager.com https://googleads.g.doubleclick.net https://securepubads.g.doubleclick.net https://www.google-analytics.com https://www.gstatic.com https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google https://*.adservice.google.com https://fundingchoicesmessages.google.com https://fcmp.fundingchoicesmessages.google.com" + allowVercelLive,
      "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://www.googletagservices.com https://www.googletagmanager.com https://googleads.g.doubleclick.net https://securepubads.g.doubleclick.net https://www.google-analytics.com https://www.gstatic.com https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google https://*.adservice.google.com https://fundingchoicesmessages.google.com https://fcmp.fundingchoicesmessages.google.com" + allowVercelLive,

      "connect-src 'self' https://*.googlesyndication.com https://*.doubleclick.net https://*.g.doubleclick.net https://*.google.com https://*.google-analytics.com https://region1.google-analytics.com https://*.analytics.google.com https://*.adservice.google.com https://*.adtrafficquality.google https://fundingchoicesmessages.google.com https://fcmp.fundingchoicesmessages.google.com",

      "img-src 'self' data: blob: https://*.googlesyndication.com https://*.doubleclick.net https://*.g.doubleclick.net https://*.google.com https://www.google-analytics.com https://www.googletagmanager.com",

      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",

      "frame-src 'self' https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://googleads.g.doubleclick.net https://securepubads.g.doubleclick.net https://fundingchoicesmessages.google.com",

      "worker-src 'self' blob:",
      "media-src 'self' blob: data:",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'pagead2.googlesyndication.com' },
      { protocol: 'https', hostname: 'tpc.googlesyndication.com' },
      { protocol: 'https', hostname: 'securepubads.g.doubleclick.net' },
      { protocol: 'https', hostname: 'googleads.g.doubleclick.net' },
      { protocol: 'https', hostname: '*.googlesyndication.com' },
      { protocol: 'https', hostname: '*.doubleclick.net' },
      { protocol: 'https', hostname: '*.g.doubleclick.net' },
      { protocol: 'https', hostname: '*.google.com' },
      { protocol: 'https', hostname: 'www.googletagmanager.com' },
      { protocol: 'https', hostname: '*.google-analytics.com' },
    ],
  },
};

export default nextConfig;
