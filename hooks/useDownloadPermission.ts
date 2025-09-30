// hooks/useDownloadPermission.ts
"use client";

// Update the import path to a relative path if entitlement-client.ts is in lib folder at project root
import { useEntitlements } from "@/lib/entitlements-client";

export function useDownloadPermission(calculatorKey?: string) {
  const { planId, proChoice } = useEntitlements();

  // Premium always gets downloads
  if (planId === "premium") return { canDownload: true };

  // Pro gets downloads for their chosen calculator
  if (planId === "pro") {
    if (!calculatorKey) return { canDownload: true };

    // Check if this is their chosen calculator
    const isChosenCalculator =
      (calculatorKey === "employee-cost" && proChoice === "employee") ||
      (calculatorKey === "expense-split-deluxe" &&
        proChoice === "expense_split");

    return { canDownload: isChosenCalculator };
  }

  // Plus and Free cannot download
  return { canDownload: false };
}
