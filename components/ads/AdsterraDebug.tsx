"use client";

import { useIsPaidContext } from "@/adHooks";
import { useEntitlements } from "@/lib/entitlements-client";
import * as React from "react";

const AD_CLIENT = process.env.NEXT_PUBLIC_AD_CLIENT;
const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
const ADSTERRA_SITE_ID = process.env.NEXT_PUBLIC_ADSTERRA_SITE_ID;

function hasAdsConsentCookie() {
    if (typeof document === "undefined") return false;
    try {
        return /(?:^|; )fwv_cmp_ads=1(?:;|$)/.test(document.cookie);
    } catch {
        return false;
    }
}

export default function AdsterraDebug() {
    const isPaidContext = useIsPaidContext();
    const { planId, hydrated } = useEntitlements();
    const [scriptLoaded, setScriptLoaded] = React.useState(false);
    const [adContainerContent, setAdContainerContent] = React.useState("");
    const [adContainerChildren, setAdContainerChildren] = React.useState(0);

    // Check if script is loaded
    React.useEffect(() => {
        const checkScript = () => {
            const scripts = document.querySelectorAll('script[src*="effectivegatecpm.com"]');
            setScriptLoaded(scripts.length > 0);
        };

        // Initial check
        checkScript();

        // Check every second for 10 seconds
        const interval = setInterval(checkScript, 1000);
        setTimeout(() => clearInterval(interval), 10000);

        return () => clearInterval(interval);
    }, []);

    // Check container content
    React.useEffect(() => {
        const checkContainer = () => {
            const container = document.getElementById('container-1ae6deb893d2fba7115c6c32ef705246');
            if (container) {
                setAdContainerContent(container.innerHTML);
                setAdContainerChildren(container.children.length);
            }
        };

        // Initial check
        checkContainer();

        // Check every second for 10 seconds
        const interval = setInterval(checkContainer, 1000);
        setTimeout(() => clearInterval(interval), 10000);

        return () => clearInterval(interval);
    }, []);

    // Debug information
    const debugInfo = {
        hydrated,
        planId,
        isPaidContext,
        ADS_ENABLED,
        AD_CLIENT,
        ADSTERRA_SITE_ID,
        hasAdsConsent: hasAdsConsentCookie(),
        scriptLoaded,
        adContainerContent,
        adContainerChildren,
        cookies: typeof document !== "undefined" ? document.cookie : "N/A",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "N/A",
        url: typeof window !== "undefined" ? window.location.href : "N/A"
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Adsterra Debug Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-gray-100 rounded">
                    <h3 className="font-medium mb-2">Basic Info</h3>
                    <p><strong>Hydrated:</strong> {hydrated ? "Yes" : "No"}</p>
                    <p><strong>Plan:</strong> {planId}</p>
                    <p><strong>Paid Context:</strong> {isPaidContext ? "Yes" : "No"}</p>
                    <p><strong>Ads Enabled:</strong> {ADS_ENABLED ? "Yes" : "No"}</p>
                    <p><strong>Ad Client:</strong> {AD_CLIENT || "Not set"}</p>
                    <p><strong>Adsterra Site ID:</strong> {ADSTERRA_SITE_ID || "Not set"}</p>
                </div>

                <div className="p-3 bg-gray-100 rounded">
                    <h3 className="font-medium mb-2">Ad Status</h3>
                    <p><strong>Has Ads Consent:</strong> {hasAdsConsentCookie() ? "Yes" : "No"}</p>
                    <p><strong>Script Loaded:</strong> {scriptLoaded ? "Yes" : "No"}</p>
                    <p><strong>Container Children:</strong> {adContainerChildren}</p>
                    <p><strong>Should Show Ads:</strong> {
                        hydrated &&
                            planId === "free" &&
                            !isPaidContext &&
                            ADS_ENABLED &&
                            AD_CLIENT &&
                            hasAdsConsentCookie() ? "Yes" : "No"
                    }</p>
                </div>
            </div>

            <div className="p-3 bg-gray-100 rounded mb-4">
                <h3 className="font-medium mb-2">Container Content</h3>
                <div className="p-2 bg-white border rounded font-mono text-sm overflow-auto max-h-32">
                    {adContainerContent || "Empty"}
                </div>
            </div>

            <div className="p-3 bg-gray-100 rounded">
                <h3 className="font-medium mb-2">Raw Debug Info</h3>
                <details>
                    <summary className="cursor-pointer text-blue-600">Click to expand</summary>
                    <pre className="mt-2 p-2 bg-white border rounded text-xs overflow-auto">
                        {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                </details>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <h3 className="font-medium mb-2 text-yellow-800">Troubleshooting Steps</h3>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>Make sure you've accepted the cookie consent banner</li>
                    <li>Verify you're on a free plan (not paid)</li>
                    <li>Check that ads are enabled in environment variables</li>
                    <li>Ensure Adsterra site ID is correctly set</li>
                    <li>Verify your Adsterra account is active and approved</li>
                    <li>Check if there are any ad blockers enabled</li>
                    <li>Try visiting the test page at /test-ads</li>
                </ol>
            </div>
        </div>
    );
}