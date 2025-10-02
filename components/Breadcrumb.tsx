import Link from "next/link";

type Item = { href: string; label: string };

export default function Breadcrumb({ trail }: { trail: Item[] }) {
  if (!trail?.length) return null;
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-600">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        {trail.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span aria-hidden>›</span>
            <Link href={item.href} className="hover:underline">
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
