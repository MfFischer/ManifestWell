'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LockScreen } from './LockScreen'
import { logger } from '@/lib/utils/logger'
import {
  getAppLockConfig,
  shouldLockApp,
  updateLastActive,
  type AppLockConfig
} from '@/lib/auth/app-lock-client'

interface AppLockContextValue {
  isLocked: boolean
  config: AppLockConfig | null
  lock: () => void
  refreshConfig: () => Promise<void>
}

const AppLockContext = createContext<AppLockContextValue | null>(null)

export function useAppLock() {
  const context = useContext(AppLockContext)
  if (!context) {
    throw new Error('useAppLock must be used within AppLockProvider')
  }
  return context
}

interface AppLockProviderProps {
  children: ReactNode
}

export function AppLockProvider({ children }: AppLockProviderProps) {
  const [isLocked, setIsLocked] = useState(false)
  const [config, setConfig] = useState<AppLockConfig | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load config and check lock state on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        const appConfig = await getAppLockConfig()
        setConfig(appConfig)
        
        // Check if should be locked
        if (shouldLockApp(appConfig)) {
          setIsLocked(true)
        }
      } catch (error) {
        logger.error('Failed to initialize app lock:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    initialize()
  }, [])

  // Track user activity
  useEffect(() => {
    if (!config || isLocked) return

    const handleActivity = () => {
      updateLastActive()
    }

    // Track various user interactions
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [config, isLocked])

  // Handle app visibility changes (background/foreground)
  useEffect(() => {
    if (!config) return

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // App came to foreground - check if should lock
        if (shouldLockApp(config)) {
          setIsLocked(true)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [config])

  const handleUnlock = useCallback(() => {
    setIsLocked(false)
    updateLastActive()
  }, [])

  const lock = useCallback(() => {
    if (config?.pinEnabled || config?.biometricEnabled) {
      setIsLocked(true)
    }
  }, [config])

  const refreshConfig = useCallback(async () => {
    const newConfig = await getAppLockConfig()
    setConfig(newConfig)
  }, [])

  // Don't render anything until initialized
  if (!isInitialized) {
    return null
  }

  return (
    <AppLockContext.Provider value={{ isLocked, config, lock, refreshConfig }}>
      <AnimatePresence mode="wait">
        {isLocked && config && (config.pinEnabled || config.biometricEnabled) ? (
          <LockScreen key="lock" config={config} onUnlock={handleUnlock} />
        ) : (
          <div key="content">{children}</div>
        )}
      </AnimatePresence>
    </AppLockContext.Provider>
  )
}

