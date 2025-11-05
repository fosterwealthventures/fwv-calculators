'use client'

import { useEffect } from 'react';

export default function PWAInstaller() {
    useEffect(() => {
        // Service Worker Registration
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js')
                    .then(function (registration) {
                        console.log('SW registered: ', registration);
                    })
                    .catch(function (registrationError) {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }

        // PWA Install Prompt Handler
        let deferredPrompt: any;
        const installBanner = document.getElementById('pwa-install-banner');
        const installButton = document.getElementById('pwa-install-button');
        const installManualButton = document.getElementById('pwa-install-manual');
        const dismissButton = document.getElementById('pwa-dismiss-button');
        const instructionsModal = document.getElementById('pwa-instructions');
        const closeInstructionsButton = document.getElementById('pwa-close-instructions');

        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true) {
            if (installBanner) {
                (installBanner as HTMLElement).style.display = 'none';
            }
        }

        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e: any) => {
            e.preventDefault();
            deferredPrompt = e;
            // Show the install banner (it's already visible, but ensure it's not hidden)
            if (installBanner) {
                (installBanner as HTMLElement).style.display = 'block';
            }
        });

        // Handle install button click
        if (installButton) {
            installButton.addEventListener('click', () => {
                if (deferredPrompt) {
                    // Use the browser's install prompt
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult: any) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('User accepted the install prompt');
                            if (installBanner) {
                                (installBanner as HTMLElement).style.display = 'none';
                            }
                        } else {
                            console.log('User dismissed the install prompt');
                        }
                        deferredPrompt = null;
                    });
                } else {
                    // Fallback: show instructions for manual install
                    alert('To install this app:\n\nChrome/Edge: Click the install icon (⊕) in the address bar\nSafari: Click the share icon (📤) and select "Add to Home Screen"\nFirefox: Click the menu icon (⋮) and select "Install"');
                }
            });
        }

        // Handle manual install instructions button
        if (installManualButton && instructionsModal) {
            installManualButton.addEventListener('click', () => {
                (instructionsModal as HTMLElement).classList.remove('hidden');
            });
        }

        // Handle close instructions button
        if (closeInstructionsButton && instructionsModal) {
            closeInstructionsButton.addEventListener('click', () => {
                (instructionsModal as HTMLElement).classList.add('hidden');
            });
        }

        // Handle dismiss button click
        if (dismissButton) {
            dismissButton.addEventListener('click', () => {
                if (installBanner) {
                    (installBanner as HTMLElement).style.display = 'none';
                }
            });
        }

        // Hide banner if app is already installed
        window.addEventListener('appinstalled', () => {
            if (installBanner) {
                (installBanner as HTMLElement).style.display = 'none';
            }
            console.log('PWA was installed');
            alert('App installed successfully!');
        });

        // Close modal when clicking outside
        if (instructionsModal) {
            instructionsModal.addEventListener('click', (e: Event) => {
                if (e.target === instructionsModal) {
                    (instructionsModal as HTMLElement).classList.add('hidden');
                }
            });
        }
    }, []);

    return null;
}