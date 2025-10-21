// components/ads/index.tsx
// No-op shim for AdSense Auto-ads setup (manual units disabled)

import * as React from "react";

export function AdBannerTop(_: Record<string, unknown>) {
    return null;
}

export function AdInContent(_: Record<string, unknown>) {
    return null;
}

export function AdFooter(_: Record<string, unknown>) {
    return null;
}

/**
 * Some places may wrap content in an "ad gate" component.
 * We just render children directly so nothing breaks.
 */
export function AdGateFreeOnly({
    children,
}: {
    children?: React.ReactNode;
}) {
    return <>{children} </>;
}

// If anything imports the module default, export an empty object.
export default {};
