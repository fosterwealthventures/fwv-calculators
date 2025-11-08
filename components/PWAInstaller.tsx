'use client'

import { useEffect } from 'react'

export default function PWAInstaller() {
  useEffect(() => {
    // Service Worker Registration (silent failure if unsupported)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker
          .register('/sw.js')
          .then(() => {
            // no-op
          })
          .catch(() => {
            // no-op
          })
      })
    }

    // PWA Install Prompt Handler
    let deferredPrompt: any
    const installBanner = document.getElementById('pwa-install-banner')
    const installButton = document.getElementById('pwa-install-button')
    const installManualButton = document.getElementById('pwa-install-manual')
    const dismissButton = document.getElementById('pwa-dismiss-button')
    const instructionsModal = document.getElementById('pwa-instructions')
    const closeInstructionsButton = document.getElementById('pwa-close-instructions')

    // Hide banner if app already installed
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      if (installBanner) (installBanner as HTMLElement).style.display = 'none'
    }

    // beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault()
      deferredPrompt = e
      if (installBanner) (installBanner as HTMLElement).style.display = 'block'
    })

    // Install button
    if (installButton) {
      installButton.addEventListener('click', () => {
        if (deferredPrompt) {
          deferredPrompt.prompt()
          deferredPrompt.userChoice.finally(() => {
            deferredPrompt = null
          })
        } else {
          alert(
            'To install this app:\n\n' +
              'Chrome/Edge: Click the install icon in the address bar\n' +
              'Safari: Tap the Share icon and choose "Add to Home Screen"\n' +
              'Firefox: Open the menu and choose "Install"'
          )
        }
      })
    }

    // Manual instructions button
    if (installManualButton && instructionsModal) {
      installManualButton.addEventListener('click', () => {
        (instructionsModal as HTMLElement).classList.remove('hidden')
      })
    }

    // Close instructions
    if (closeInstructionsButton && instructionsModal) {
      closeInstructionsButton.addEventListener('click', () => {
        (instructionsModal as HTMLElement).classList.add('hidden')
      })
    }

    // Dismiss banner
    if (dismissButton) {
      dismissButton.addEventListener('click', () => {
        if (installBanner) (installBanner as HTMLElement).style.display = 'none'
      })
    }

    // appinstalled
    window.addEventListener('appinstalled', () => {
      if (installBanner) (installBanner as HTMLElement).style.display = 'none'
      alert('App installed successfully!')
    })
  }, [])

  return null
}

