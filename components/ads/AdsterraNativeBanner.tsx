'use client'

import { useEffect } from 'react'

interface AdsterraNativeBannerProps { className?: string }

const AD_BASE = 'https://pl27994832.effectivegatecpm.com'
// Fallback to known public client id if env missing
const AD_CLIENT = process.env.NEXT_PUBLIC_AD_CLIENT || '1ae6deb893d2fba7115c6c32ef705246'

export default function AdsterraNativeBanner({ className = '' }: AdsterraNativeBannerProps) {
  const containerId = `container-${AD_CLIENT}`

  useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return

    // Avoid duplicate scripts and prefer reloading if supported
    const maybeReload = (container as any).reload
    if (typeof maybeReload === 'function') {
      try { maybeReload(); return } catch {}
    }

    Array.from(container.querySelectorAll('script')).forEach((s) => s.remove())
    const script = document.createElement('script')
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    script.src = `${AD_BASE}/${AD_CLIENT}/invoke.js`
    container.appendChild(script)
  }, [containerId])

  // Wrapper lives nicely in page footer
  return (
    <div className={`adsterra-native-banner ${className}`} style={{ textAlign: 'center', margin: '16px 0' }}>
      <div id={containerId}></div>
    </div>
  )
}
