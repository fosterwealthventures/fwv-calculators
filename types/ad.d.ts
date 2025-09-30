// Single source of truth for AdSense typing
export {};

declare global {
  interface Window {
    adsbygoogle: unknown[] | undefined;
  }
}
