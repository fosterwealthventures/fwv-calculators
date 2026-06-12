// lib/ads-config.ts
export const VERCEL_ENV =
  process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';

export const IS_PROD = VERCEL_ENV === 'production';

// Public (safe) values
export const ADS_CLIENT =
  process.env.NEXT_PUBLIC_AD_CLIENT || '';

// Enable ads everywhere unless explicitly disabled
export const ADS_ENABLED =
  (process.env.NEXT_PUBLIC_ADS_ENABLED ?? 'false') === 'true';

// Turn ad test OFF by default until new network is configured
export const ADS_ADTEST =
  process.env.NEXT_PUBLIC_ADS_ADTEST || 'off';
