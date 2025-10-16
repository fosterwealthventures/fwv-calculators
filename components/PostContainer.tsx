import { ReactNode } from "react";

export default function PostContainer({ children }: { children: ReactNode }) {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Centered, wide, and readable */}
            <div className="mx-auto w-full max-w-[120ch] lg:max-w-[140ch] text-[18px] md:text-[19px] lg:text-[20px] leading-[1.85]">
                {children}
            </div>
        </div>
    );
}