export function getAdsClient(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT ||
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT ||
    undefined
  );
}

export function getInContentSlot(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_ADSENSE_INCONTENT_SLOT ||
    process.env.NEXT_PUBLIC_GOOGLE_ADS_INCONTENT_SLOT ||
    undefined
  );
}

export function getFooterSlot(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_ADSENSE_FOOTER_SLOT ||
    process.env.NEXT_PUBLIC_GOOGLE_ADS_FOOTER_SLOT ||
    undefined
  );
}
