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

  webpack: (config, { dev }) => {
    if (dev) config.devtool = 'source-map';
    return config;
  },

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
    // Keep CSP off in dev or when explicitly skipped
    if (isDev || skipCsp) return [];

    const allowVercelLive = isPreview ? ' https://vercel.live' : '';

    // Final unified CSP for Ads/CMP + Analytics with wildcard for adtrafficquality
    const csp = [
      "default-src 'self'",
      // Important: include wildcard for ad traffic quality endpoints (ep1/ep2/etc)
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://adservice.google.com https://tpc.googlesyndication.com https://fundingchoicesmessages.google.com https://consent.google.com https://gads-gpt-private.googlesyndication.com https://*.adtrafficquality.google" + allowVercelLive,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://www.google-analytics.com https://stats.g.doubleclick.net https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://googleads.g.doubleclick.net",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://adservice.google.com https://fundingchoicesmessages.google.com https://consent.google.com https://*.adtrafficquality.google",
      "frame-src 'self' https://www.googletagmanager.com https://www.google.com https://fundingchoicesmessages.google.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://consent.google.com https://*.adtrafficquality.google",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "base-uri 'self'",
      "form-action 'self' https://www.google.com"
    ].join('; ');

    return [
      // HTML & data routes (always fresh)
      {
        source: "/((?!_next/static|.*\\.(?:js|css|png|jpg|jpeg|gif|webp|svg|ico)).*)",
        headers: [
          { key: "Cache-Control", value: "no-store" }
        ]
      },

      // Next hashed assets (immutable)
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      },

      // Fonts (immutable if hashed)
      {
        source: "/(.*)\\.(woff2?|ttf|otf)$",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      },

      // Public assets (images, etc.) — long cache but not immutable (filenames aren't hashed)
      {
        source: "/(.*)\\.(png|jpg|jpeg|gif|webp|svg|ico)$",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, must-revalidate" }
        ]
      },

      // Apply security headers to all routes
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
      // Allow all remote images for blog content
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
