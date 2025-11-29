// Service Worker for Foster Wealth Calculators PWA
// Bump cache names to force clients to pick up the latest assets and avoid stale HTML
const CACHE_NAME = 'fwv-calculators-v2';
const STATIC_CACHE = 'fwv-static-v2';

// Cache essential resources for offline use
const STATIC_ASSETS = [
    '/',
    '/calculators',
    '/calculators/shopping-budget',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache when offline (but never cache HTML shell to avoid hydration mismatches)
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests and Chrome extension requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

    // For navigation requests, try network first, then cache
  if (event.request.mode === 'navigate') {
    // Always go to network for HTML; if offline, fall back to cached root (if any)
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/') || Response.error())
    );
    return;
  }

    // For other requests, try cache first
    event.respondWith(
        caches.match(event.request)
            .then((cached) => {
                if (cached) {
                    return cached;
                }
                return fetch(event.request)
                    .then((response) => {
                        // Cache successful responses
                        if (response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => cache.put(event.request, responseClone));
                        }
                        return response;
                    });
            })
    );
});

// Background sync for when app comes back online
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        // Handle any background tasks when connection restored
        console.log('Background sync triggered');
    }
});
