// components/Breadcrumb.tsx
import Link from "next/link";

type Crumb = { href: string; label: string };

export default function Breadcrumb({ trail = [] as Crumb[] }) {
  const items: Crumb[] = [{ href: "/", label: "Home" }, ...trail];
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-600">
      {items.map((it, i) => (
        <span key={i}>
          <Link className="underline hover:text-brand-green" href={it.href}>
            {it.label}
          </Link>
          {i < items.length - 1 ? " › " : null}
        </span>
      ))}
    </nav>
  );
}
