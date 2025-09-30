// app/upgrade/page.tsx
import UpgradeClientWrapper from "./client-wrapper";

type Search = Record<string, string | string[] | undefined>;

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Search>;
}) {
  // Since this is an async function and searchParams is a Promise in Next.js App Router,
  // we can directly await it
  const sp = await searchParams;

  const calc = (sp?.calc as string | undefined) ?? null;
  const redirect = (sp?.redirect as string | undefined) ?? "/dashboard";

  return <UpgradeClientWrapper calc={calc} redirect={redirect} />;
}