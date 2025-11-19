'use client'

import { useEffect, useMemo } from 'react'

interface AdsterraNativeBannerProps {
  className?: string
  /**
   * Optional override for the Adsterra native key/client value.
   * Falls back to NEXT_PUBLIC_AD_CLIENT when omitted.
   */
  client?: string
  /** Optional network host override – defaults to the effectivegatecpm cluster. */
  baseUrl?: string
  /** Explicit container id if a predictable DOM node is required. */
  containerId?: string
}

const DEFAULT_AD_BASE = 'https://pl27994832.effectivegatecpm.com'
// Fallback to known public client id if env missing
const DEFAULT_AD_CLIENT = process.env.NEXT_PUBLIC_AD_CLIENT || '1ae6deb893d2fba7115c6c32ef705246'

export default function AdsterraNativeBanner({
  className = '',
  client,
  baseUrl,
  containerId: explicitContainerId,
}: AdsterraNativeBannerProps) {
  const resolvedClient = (client ?? DEFAULT_AD_CLIENT)?.trim()
  const resolvedBase = baseUrl?.trim() || DEFAULT_AD_BASE
  const containerId = useMemo(() => {
    if (explicitContainerId) return explicitContainerId
    if (!resolvedClient) return ''
    return `adsterra-${resolvedClient}`
  }, [explicitContainerId, resolvedClient])

  useEffect(() => {
    if (!resolvedClient || !containerId) return
    const container = document.getElementById(containerId)
    if (!container) return

    // Avoid duplicate scripts and prefer reloading if supported
    const maybeReload = (container as any).reload
    if (typeof maybeReload === 'function') {
      try {
        maybeReload()
        return
      } catch {
        // Swallow reload errors and fall back to injecting a new script
      }
    }

    Array.from(container.querySelectorAll('script')).forEach((s) => s.remove())
    const script = document.createElement('script')
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    script.src = `${resolvedBase}/${resolvedClient}/invoke.js`
    container.appendChild(script)
  }, [containerId, resolvedBase, resolvedClient])

  if (!resolvedClient || !containerId) return null

  // Wrapper lives nicely in page footer
  return (
    <div className={`adsterra-native-banner ${className}`} style={{ textAlign: 'center', margin: '16px 0' }}>
      <div id={containerId}></div>
    </div>
  )
}
