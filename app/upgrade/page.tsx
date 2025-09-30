// app/upgrade/page.tsx
import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Upgrade – Foster Wealth Calculators",
  description: "Choose a plan to unlock Plus, Pro, or Premium calculators.",
};

// Client-only wrapper for the interactive UI
const UpgradeClient = dynamic(() => import("./upgrade-client"), { ssr: false });

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function UpgradePage({ searchParams }: PageProps) {
  const calc =
    typeof searchParams?.calc === "string" ? searchParams.calc : null;
  const redirect =
    typeof searchParams?.redirect === "string" ? searchParams.redirect : "/";

  return <UpgradeClient calc={calc} redirect={redirect} />;
}
