export const isProd = process.env.NODE_ENV === 'production';
export const ADS_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';
export const ADS_ADTEST = process.env.NEXT_PUBLIC_ADSENSE_ADTEST === 'on';