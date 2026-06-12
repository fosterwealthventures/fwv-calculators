import Image from "next/image";
import Link from "next/link";

function LockedProCalculatorPreview({
    imageSrc,
    title,
}: {
    imageSrc: string;
    title: string;
}) {
    return (
        <section
            id="calculator"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-4"
        >
            <div>
                <h2 className="text-2xl font-semibold">{title}</h2>
                <p className="text-gray-600">
                    This is a premium FWV PRO calculator. Preview it below, then unlock
                    full version with FWV PRO access.
                </p>
            </div>

            <div data-nosnippet className="relative mt-4">
                <div className="overflow-hidden rounded-xl">
                    <Image
                        src={imageSrc}
                        alt={`${title} preview`}
                        width={1400}
                        height={900}
                        className="w-full rounded-xl blur-md opacity-70"
                    />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-md bg-white/95 backdrop-blur-md border border-purple-200 rounded-2xl px-6 py-5 text-center shadow-lg">
                        <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide">
                            FWV PRO Exclusive
                        </p>
                        <h3 className="mt-2 text-lg md:text-xl font-bold">
                            Unlock {title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-700">
                            Upgrade to FWV PRO for instant access to advanced business and
                            financial calculators.
                        </p>
                        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/pricing"
                                className="px-5 py-2.5 rounded-xl bg-purple-700 text-white text-sm font-semibold"
                            >
                                View PRO Plans
                            </Link>
                            <Link
                                href="/"
                                className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-700 bg-white"
                            >
                                Explore Free Tools
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LockedProCalculatorPreview;