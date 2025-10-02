// app/calculators/[calc]/page.tsx
import { redirect } from 'next/navigation';

export default function CalculatorsSlug({
  params,
}: { params: { calc: string } }) {
  redirect(`/_/redirect?to=/dashboard?calc=${encodeURIComponent(params.calc)}`);
}
