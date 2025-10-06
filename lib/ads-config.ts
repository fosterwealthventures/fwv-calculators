// lib/ads-config.ts
export const VERCEL_ENV =
  process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';

export const IS_PROD = VERCEL_ENV === 'production';

// Public (safe) values
export const ADS_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-7798339637698835';

// Enable ads everywhere unless explicitly disabled
export const ADS_ENABLED =
  (process.env.NEXT_PUBLIC_ADSENSE_ENABLED ?? 'true') === 'true';

// Turn ad test ON for non-prod by default
export const ADS_ADTEST =
  process.env.NEXT_PUBLIC_ADSENSE_ADTEST || (IS_PROD ? 'off' : 'on');
