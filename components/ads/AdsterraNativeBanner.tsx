'use client'

import { useEffect } from 'react'

interface AdsterraNativeBannerProps {
    className?: string
}

export default function AdsterraNativeBanner({ className = '' }: AdsterraNativeBannerProps) {
    useEffect(() => {
        // Load the Adsterra script
        const script = document.createElement('script')
        script.async = true
        script.setAttribute('data-cfasync', 'false')
        script.src = '//pl27994832.effectivegatecpm.com/1ae6deb893d2fba7115c6c32ef705246/invoke.js'

        // Find the container and append the script
        const container = document.getElementById('container-1ae6deb893d2fba7115c6c32ef705246')
        if (container && !container.querySelector('script')) {
            container.appendChild(script)
        }
    }, [])

    return (
        <div className={`adsterra-native-banner ${className}`}>
            <div id="container-1ae6deb893d2fba7115c6c32ef705246"></div>
        </div>
    )
}