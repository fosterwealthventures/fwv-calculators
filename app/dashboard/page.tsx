"use client";
import { EntitlementsProvider } from "@/lib/entitlements-client";
import FosterWealthCalculators from "@/components/foster_wealth_calculators_suites";

export default function DashboardPage() {
  return (
    <EntitlementsProvider>
      <main className="fwv-container py-6">
        <FosterWealthCalculators />
      </main>
    </EntitlementsProvider>
  );
}
