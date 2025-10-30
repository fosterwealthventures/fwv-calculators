"use client";

import * as React from "react";

type Consent = { ads: boolean; analytics: boolean };

const STORAGE_KEY = "fwv_cmp_v1";

function readStoredConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.ads === "boolean" && typeof parsed?.analytics === "boolean") {
      return parsed as Consent;
    }
  } catch {}
  return null;
}

function persistConsent(c: Consent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  } catch {}
  try {
    document.cookie = `fwv_cmp_ads=${c.ads ? 1 : 0}; path=/; max-age=31536000; SameSite=Lax`;
    document.cookie = `fwv_cmp_analytics=${c.analytics ? 1 : 0}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {}
  try {
    // Notify Consent Mode bridge in layout
    // @ts-ignore
    window.onCmpConsentUpdate && window.onCmpConsentUpdate(c);
  } catch {}
}

export default function CmpBanner() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const existing = readStoredConsent();
    if (existing) {
      // Ensure bridge receives consent on reloads
      persistConsent(existing);
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, []);

  function acceptAll() {
    persistConsent({ ads: true, analytics: true });
    setOpen(false);
  }

  function rejectAll() {
    persistConsent({ ads: false, analytics: false });
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur px-4 py-4 shadow-xl"
    >
      <div className="mx-auto max-w-5xl flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-gray-800 md:max-w-3xl">
          We use cookies for essential site functionality, analytics and ads. You can accept or reject these uses. You
          can change your choice at any time.
        </div>
        <div className="flex gap-2 self-end md:self-auto">
          <button
            onClick={rejectAll}
            className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Reject all
          </button>
          <button
            onClick={acceptAll}
            className="rounded bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}

