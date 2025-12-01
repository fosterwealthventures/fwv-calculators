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
    const formattedDate = date ? new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : undefined;
    const preview = excerpt ? excerpt.trim() : "";
    const displayImage = image && !/fwv-logo/i.test(image) ? image : "";

    return (
        <div className="card-regal p-0 hover:shadow-regalGlow transition overflow-hidden">
            <Link href={`/blog/${slug}`} className="block">
                {displayImage ? (
                    <div className="relative aspect-[16/9] overflow-hidden bg-plum-100 dark:bg-plum-900">
                        <img src={displayImage} alt={title} className="h-full w-full object-cover" />
                    </div>
                ) : (
                    <div className="aspect-[16/9] bg-gradient-to-br from-plum-50 via-white to-plum-100 dark:from-plum-900/40 dark:via-plum-900/20 dark:to-plum-800/40" />
                )}

                <div className="p-5 space-y-2">
                    {category && (
                        <span className="inline-block text-[11px] px-2 py-0.5 rounded-full border border-plum-300/50 text-plum-800/80 dark:text-plum-100/80">
                            {category}
                        </span>
                    )}
                    <h3 className="text-lg font-semibold leading-snug text-plum-900 dark:text-plum-100 hover:underline">
                        {title}
                    </h3>
                    {preview && (
                        <p className="text-plum-900/80 dark:text-plum-100/80 line-clamp-3">
                            {preview}
                        </p>
                    )}
                    {formattedDate && (
                        <p className="pt-1 text-xs text-plum-800/70 dark:text-plum-200/70">
                            {formattedDate}
                        </p>
                    )}
                    {Array.isArray(tags) && tags.length > 0 && (
                        <p className="pt-1 flex flex-wrap gap-1">
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
