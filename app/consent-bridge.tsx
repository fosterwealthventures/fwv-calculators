"use client";

// Expose a function CMPs can call after the user makes a choice
export function installCmpConsentBridge() {
    // @ts-ignore
    window.onCmpConsentUpdate = function (consent) {
        const analytics = !!(consent && consent.analytics);
        // @ts-ignore
        window.gtag && window.gtag('consent', 'update', {
            analytics_storage: analytics ? 'granted' : 'denied',
        });
    };
}
