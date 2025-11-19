"use client";

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

function Button({ children, disabled, className, type = "button" }: {
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
}) {
    return (
        <button
            type={type}
            disabled={disabled}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 ${className || ""}`}
        >
            {children}
        </button>
    );
}

export function SignInButton() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { data: session } = useSession();

    if (session) {
        return null; // Don't show sign-in button if user is already signed in
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setErrorMessage(null);
        setIsLoading(true);
        try {
            const result = await signIn("email", { email, redirect: false });

            if (result?.error) {
                const normalizedError = result.error.toString().toUpperCase();
                if (
                    normalizedError.includes("TOO_MANY_MAGIC_LINK_REQUESTS") ||
                    normalizedError.includes("MAGICLINKRATELIMITERROR") ||
                    normalizedError === "CONFIGURATION" ||
                    normalizedError === "ACCESSDENIED"
                ) {
                    setErrorMessage("Too many sign-in requests. Try again in a few minutes.");
                } else {
                    setErrorMessage("We couldn't send the sign-in link. Please try again.");
                }
                return;
            }

            setIsSent(true);
        } catch (error) {
            console.error("Sign in error:", error);
            setErrorMessage("We couldn't send the sign-in link. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="p-4 bg-green-50 text-green-800 rounded-md">
                <p>Check your email for a sign-in link!</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"
                    placeholder="you@example.com"
                />
            </div>
            {errorMessage && (
                <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {errorMessage}
                </div>
            )}
            <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full"
            >
                {isLoading ? "Sending link..." : "Sign in with Email"}
            </Button>
        </form>
    );
}
