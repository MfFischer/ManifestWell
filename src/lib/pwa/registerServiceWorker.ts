/**
 * Service Worker Registration
 * Registers and manages the PWA service worker
 */

import { logger } from '@/lib/utils/logger';

/**
 * Register service worker
 *
 * @returns True if registration successful
 *
 * @example
 * ```typescript
 * // In app initialization
 * if (typeof window !== 'undefined') {
 *   await registerServiceWorker()
 * }
 * ```
 */
export async function registerServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    logger.log('Service workers not supported')
    return false
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })

    logger.log('Service Worker registered:', registration.scope)

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing

      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            logger.log('New service worker available')

            // Notify user about update
            if (window.confirm('New version available! Reload to update?')) {
              window.location.reload()
            }
          }
        })
      }
    })

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.type === 'BACKGROUND_SYNC') {
        // Trigger sync in app
        window.dispatchEvent(new CustomEvent('background-sync', { detail: event.data }))
      }
    })

    return true
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return false
  }
}

/**
 * Unregister service worker
 *
 * @example
 * ```typescript
 * await unregisterServiceWorker()
 * ```
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()

    if (registration) {
      const success = await registration.unregister()
      logger.log('Service Worker unregistered:', success)
      return success
    }

    return false
  } catch (error) {
    console.error('Service Worker unregistration failed:', error)
    return false
  }
}

/**
 * Check if service worker is registered
 *
 * @returns True if registered
 *
 * @example
 * ```typescript
 * const isRegistered = await isServiceWorkerRegistered()
 * ```
 */
export async function isServiceWorkerRegistered(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    return registration !== undefined
  } catch {
    return false
  }
}

/**
 * Request background sync permission
 * For syncing data when app comes back online
 *
 * @returns True if permission granted
 *
 * @example
 * ```typescript
 * const granted = await requestBackgroundSync()
 * ```
 */
export async function requestBackgroundSync(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready

    if ('sync' in registration) {
      await (registration as any).sync.register('sync-data')
      logger.log('Background sync registered')
      return true
    }

    return false
  } catch (error) {
    console.error('Background sync registration failed:', error)
    return false
  }
}
