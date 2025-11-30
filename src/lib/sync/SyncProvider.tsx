/**
 * Sync Provider - Provides sync engine context to the app
 * Manages background sync and online/offline status
 */

'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { SyncEngine, type SyncResult } from './engine'

interface SyncContextValue {
  syncEngine: SyncEngine
  isOnline: boolean
  isSyncing: boolean
  lastSync: Date | null
  syncNow: () => Promise<SyncResult>
}

const SyncContext = createContext<SyncContextValue | null>(null)

interface SyncProviderProps {
  children: ReactNode
  userId: string
  apiEndpoint?: string
}

/**
 * Sync Provider component
 *
 * Provides sync engine functionality to the entire app
 * Automatically syncs when online and handles offline queueing
 *
 * @example
 * ```tsx
 * <SyncProvider userId={user.id}>
 *   <App />
 * </SyncProvider>
 * ```
 */
export function SyncProvider({ children, userId, apiEndpoint = '/api/sync' }: SyncProviderProps) {
  const [syncEngine] = useState(() => new SyncEngine(userId, apiEndpoint))
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // Auto-sync when coming back online
      void syncNow()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Set initial online status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Periodic background sync (every 5 minutes when online)
  useEffect(() => {
    if (!isOnline) return

    const intervalId = setInterval(() => {
      void syncNow()
    }, 5 * 60 * 1000) // 5 minutes

    // Initial sync
    void syncNow()

    return () => clearInterval(intervalId)
  }, [isOnline])

  const syncNow = async (): Promise<SyncResult> => {
    if (isSyncing) {
      return {
        success: false,
        syncedCount: 0,
        failedCount: 0,
        errors: [{ operation: {} as any, error: 'Sync already in progress' }]
      }
    }

    setIsSyncing(true)

    try {
      const result = await syncEngine.syncToRemote()
      if (result.success) {
        setLastSync(new Date())
      }
      return result
    } finally {
      setIsSyncing(false)
    }
  }

  const value: SyncContextValue = {
    syncEngine,
    isOnline,
    isSyncing,
    lastSync,
    syncNow
  }

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>
}

/**
 * Hook to use sync engine
 *
 * @returns Sync engine context
 * @throws Error if used outside SyncProvider
 *
 * @example
 * ```tsx
 * const { syncEngine, isOnline, syncNow } = useSync()
 *
 * // Track a change
 * await syncEngine.trackChange('meals', 'create', mealData)
 *
 * // Manually trigger sync
 * await syncNow()
 * ```
 */
export function useSync(): SyncContextValue {
  const context = useContext(SyncContext)
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider')
  }
  return context
}

/**
 * Hook to get online status
 *
 * @returns True if online
 *
 * @example
 * ```tsx
 * const isOnline = useOnlineStatus()
 *
 * if (!isOnline) {
 *   return <OfflineAlert />
 * }
 * ```
 */
export function useOnlineStatus(): boolean {
  const { isOnline } = useSync()
  return isOnline
}
