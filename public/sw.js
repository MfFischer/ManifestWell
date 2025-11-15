/**
 * Service Worker for ManifestWell PWA
 * Handles offline caching and background sync
 */

const CACHE_NAME = 'manifestwell-v1'
const RUNTIME_CACHE = 'manifestwell-runtime'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.error('Failed to cache static assets:', err)
      })
    })
  )
  // Activate immediately
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      )
    })
  )
  // Take control immediately
  return self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // Skip API requests (they need fresh data)
  if (url.pathname.startsWith('/api/')) {
    return
  }

  // Network-first strategy for navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful response
          const responseClone = response.clone()
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })
          return response
        })
        .catch(() => {
          // Serve from cache or show offline page
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/offline')
          })
        })
    )
    return
  }

  // Cache-first strategy for assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200) {
            return response
          }

          // Cache the fetched response
          const responseClone = response.clone()
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })

          return response
        })
        .catch(() => {
          // Return offline fallback for images
          if (request.destination === 'image') {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#f0f0f0" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Offline</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            )
          }
          throw error
        })
    })
  )
})

// Background sync - sync queued data when online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Trigger sync in the app
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'BACKGROUND_SYNC',
            tag: event.tag
          })
        })
      })
    )
  }
})

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'ManifestWell'
  const options = {
    body: data.body || 'New update available',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: data.url || '/'
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url === event.notification.data && 'focus' in client) {
          return client.focus()
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data)
      }
    })
  )
})
