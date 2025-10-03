// types/global.d.ts
export {}

declare global {
  interface Window {
    // must be optional to match existing ambient declaration
    adsbygoogle?: unknown[];
    __fwvPushed?: boolean;
  }
}
