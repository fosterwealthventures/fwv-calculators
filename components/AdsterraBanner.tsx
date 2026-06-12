"use client";

import { useEffect } from "react";

export default function AdsterraBanner() {
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Allow in prod domain and in local dev
        const host = window.location.hostname;
        const allowedHosts = [
            "calculators.fosterwealthventures.com",
            "localhost",
            "127.0.0.1",
        ];
        if (!allowedHosts.includes(host)) return;

        // Avoid injecting multiple times
        const existing = document.querySelector(
            "script[data-adsterra='fwv-banner']",
        );
        if (existing) return;

        const script = document.createElement("script");
        script.async = true;
        script.setAttribute("data-cfasync", "false");
        script.setAttribute("data-adsterra", "fwv-banner");
        script.src =
            "//pl28080189.effectivegatecpm.com/449baf3ee6c092918f8d0ea54be7aa6e/invoke.js";

        document.body.appendChild(script);

        return () => {
            script.remove();
        };
    }, []);

    return (
        <div
            style={{ margin: "24px 0", textAlign: "center", width: "100%" }}
        >
            {/* This is the exact container Adsterra expects */}
            <div id="container-449baf3ee6c092918f8d0ea54be7aa6e" />
        </div>
    );
}
