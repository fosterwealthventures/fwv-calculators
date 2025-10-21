"use client";

// Expose a function CMPs can call after the user makes a choice
export function installCmpConsentBridge() {
    // @ts-ignore
    window.onCmpConsentUpdate = function (consent) {
        const ads = !!(consent && consent.ads);
        const analytics = !!(consent && consent.analytics);
        // @ts-ignore
        window.gtag && window.gtag('consent', 'update', {
            ad_storage: ads ? 'granted' : 'denied',
            ad_user_data: ads ? 'granted' : 'denied',
            ad_personalization: ads ? 'granted' : 'denied',
            analytics_storage: analytics ? 'granted' : 'denied',
        });
    };
}