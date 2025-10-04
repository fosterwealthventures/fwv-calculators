// app/guide/layout.tsx
// Keep width only; no global typography so /guide doesn't balloon.
import type { ReactNode } from "react";

export default function GuideLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl px-6">{children}</div>;
}
