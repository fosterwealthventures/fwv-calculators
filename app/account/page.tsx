"use client";

import { BillingPortalButton } from "@/components/auth/BillingPortalButton";
import { SignInButton } from "@/components/auth/SignInButton";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { usePlan } from "@/lib/usePlan";
import { useSession } from "next-auth/react";

export default function AccountPage() {
    const { data: session, status } = useSession();
    const { plan, isAuthenticated } = usePlan();

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Account</h1>

                    {isAuthenticated ? (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-2">Account Information</h2>
                                <div className="bg-gray-50 rounded-md p-4">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Email:</span> {session?.user?.email}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <span className="font-medium">Plan:</span> {plan.charAt(0).toUpperCase() + plan.slice(1)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-2">Subscription Management</h2>
                                <div className="space-y-3">
                                    <BillingPortalButton />
                                    <p className="text-xs text-gray-500">
                                        Manage your subscription, payment methods, and billing information.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-2">Account Actions</h2>
                                <div className="space-y-3">
                                    <SignOutButton />
                                    <p className="text-xs text-gray-500">
                                        Sign out of your account on this device.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-2">Sign In to Your Account</h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    Sign in to access your subscription across all devices and manage your account.
                                </p>
                                <SignInButton />
                            </div>

                            <div>
                                <h2 className="text-lg font-medium text-gray-900 mb-2">Benefits of Creating an Account</h2>
                                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                                    <li>Access your subscription on any device</li>
                                    <li>Manage your subscription and billing</li>
                                    <li>Cancel your subscription at any time</li>
                                    <li>Never lose access to your paid features</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}