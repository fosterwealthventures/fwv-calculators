// components/BlogCard.tsx
import Link from "next/link";

interface BlogCardProps {
    slug: string;
    title: string;
    date?: string;
    excerpt?: string;
}

export default function BlogCard({ slug, title, date, excerpt }: BlogCardProps) {
    return (
        <div className="card-regal p-5 hover:shadow-regalGlow transition">
            <Link href={`/blog/${slug}`} className="block">
                <h3 className="text-lg font-semibold leading-snug text-plum-900 dark:text-plum-100 hover:underline">
                    {title}
                </h3>
                {excerpt && (
                    <p className="mt-2 text-plum-900/80 dark:text-plum-100/80">
                        {excerpt}
                    </p>
                )}
                {date && (
                    <p className="mt-3 text-xs text-plum-800/70 dark:text-plum-200/70">
                        {date}
                    </p>
                )}
            </Link>
        </div>
    );
}