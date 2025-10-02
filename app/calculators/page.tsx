// app/calculators/page.tsx
import { redirect } from 'next/navigation';

export default function CalculatorsAlias({
  searchParams,
}: { searchParams?: { calc?: string } }) {
  const calc = searchParams?.calc;
  if (calc) redirect(`/_/redirect?to=/dashboard?calc=${encodeURIComponent(calc)}`);
  // Fallback: just show the dashboard if no calc provided
  redirect('/dashboard');
}
