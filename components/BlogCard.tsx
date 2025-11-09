// components/BlogCard.tsx
import Link from "next/link";

interface BlogCardProps {
    slug: string;
    title: string;
    date?: string;
    excerpt?: string;
    tags?: string[];
    category?: string;
    image?: string;
}

export default function BlogCard({ slug, title, date, excerpt, tags, category, image }: BlogCardProps) {
    return (
        <div className="card-regal p-0 hover:shadow-regalGlow transition overflow-hidden">
            <Link href={`/blog/${slug}`} className="block">
                {image && (
                    <div className="w-full bg-plum-50 dark:bg-plum-900/40">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-[160px] object-cover border-b border-plum-200/50 dark:border-plum-800/50"
                            loading="lazy"
                        />
                    </div>
                )}
                <div className="p-5">
                {category && (
                    <span className="inline-block text-[11px] px-2 py-0.5 rounded-full border border-plum-300/50 text-plum-800/80 dark:text-plum-100/80">
                        {category}
                    </span>
                )}
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
                {Array.isArray(tags) && tags.length > 0 && (
                    <p className="mt-2 flex flex-wrap gap-1">
                        {tags.slice(0, 4).map((t) => (
                            <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-plum-100/70 dark:bg-plum-800/50 text-plum-900 dark:text-plum-50">
                                {t}
                            </span>
                        ))}
                        {tags.length > 4 && (
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-plum-100/70 dark:bg-plum-800/50 text-plum-900 dark:text-plum-50">
                                +{tags.length - 4}
                            </span>
                        )}
                    </p>
                )}
                </div>
            </Link>
        </div>
    );
}
