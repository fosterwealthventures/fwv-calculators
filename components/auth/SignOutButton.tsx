"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export function SignOutButton() {
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();

    if (!session) {
        return null; // Don't show sign-out button if user is not signed in
    }

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            await signOut({ redirect: false });
            // Clear local storage for backward compatibility
            if (typeof window !== "undefined") {
                localStorage.removeItem("fwv-plan");
            }
            // Reload the page to ensure all state is reset
            window.location.reload();
        } catch (error) {
            console.error("Sign out error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
            {isLoading ? "Signing out..." : "Sign Out"}
        </button>
    );
}