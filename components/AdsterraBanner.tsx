"use client";

import { useEffect } from "react";

export default function AdsterraBanner() {
    useEffect(() => {
        if (typeof window === "undefined") return;

        // OPTIONAL: only run this on the calculators subdomain
        if (window.location.hostname !== "calculators.fosterwealthventures.com") {
            return;
        }

        const script = document.createElement("script");
        script.async = true;
        script.setAttribute("data-cfasync", "false");
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
