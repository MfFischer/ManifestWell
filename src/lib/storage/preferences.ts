/**
 * Secure Preferences Storage
 * 
 * Uses Capacitor Preferences for secure storage on mobile devices.
 * Falls back to localStorage on web for development.
 */

import { Preferences } from '@capacitor/preferences'

// Preference keys
export const PREF_KEYS = {
  // App settings
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  
  // App lock
  LOCK_TIMEOUT: 'lock_timeout_ms',
  LAST_ACTIVE: 'last_active_timestamp',
  
  // Onboarding
  ONBOARDING_COMPLETE: 'onboarding_complete',
  FIRST_RUN_DATE: 'first_run_date',
  
  // User preferences
  DEFAULT_MEAL_REMINDER: 'default_meal_reminder',
  MEDITATION_REMINDER_TIME: 'meditation_reminder_time',
  DAILY_GOAL_CALORIES: 'daily_goal_calories',
  
  // Data
  LAST_BACKUP_DATE: 'last_backup_date',
  GAMIFICATION_STATS: 'gamification_stats',
} as const

export type PreferenceKey = typeof PREF_KEYS[keyof typeof PREF_KEYS]

/**
 * Get a preference value
 * 
 * @param key - Preference key
 * @returns Value or null if not set
 */
export async function getPreference(key: PreferenceKey): Promise<string | null> {
  try {
    const { value } = await Preferences.get({ key })
    return value
  } catch {
    // Fallback to localStorage on web
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key)
    }
    return null
  }
}

/**
 * Set a preference value
 * 
 * @param key - Preference key
 * @param value - Value to store
 */
export async function setPreference(key: PreferenceKey, value: string): Promise<void> {
  try {
    await Preferences.set({ key, value })
  } catch {
    // Fallback to localStorage on web
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value)
    }
  }
}

/**
 * Remove a preference
 * 
 * @param key - Preference key
 */
export async function removePreference(key: PreferenceKey): Promise<void> {
  try {
    await Preferences.remove({ key })
  } catch {
    // Fallback to localStorage on web
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  }
}

/**
 * Clear all preferences
 */
export async function clearAllPreferences(): Promise<void> {
  try {
    await Preferences.clear()
  } catch {
    // Fallback to localStorage on web
    if (typeof window !== 'undefined') {
      Object.values(PREF_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    }
  }
}

// Type-safe preference helpers

export async function getTheme(): Promise<'light' | 'dark' | 'system'> {
  const value = await getPreference(PREF_KEYS.THEME)
  return (value as 'light' | 'dark' | 'system') || 'system'
}

export async function setTheme(theme: 'light' | 'dark' | 'system'): Promise<void> {
  await setPreference(PREF_KEYS.THEME, theme)
}

export async function isOnboardingComplete(): Promise<boolean> {
  const value = await getPreference(PREF_KEYS.ONBOARDING_COMPLETE)
  return value === 'true'
}

export async function setOnboardingComplete(complete: boolean): Promise<void> {
  await setPreference(PREF_KEYS.ONBOARDING_COMPLETE, String(complete))
}

export async function getLockTimeout(): Promise<number> {
  const value = await getPreference(PREF_KEYS.LOCK_TIMEOUT)
  return value ? parseInt(value) : 5 * 60 * 1000 // Default 5 minutes
}

export async function setLockTimeout(ms: number): Promise<void> {
  await setPreference(PREF_KEYS.LOCK_TIMEOUT, String(ms))
}

export async function getLastBackupDate(): Promise<Date | null> {
  const value = await getPreference(PREF_KEYS.LAST_BACKUP_DATE)
  return value ? new Date(value) : null
}

export async function setLastBackupDate(date: Date): Promise<void> {
  await setPreference(PREF_KEYS.LAST_BACKUP_DATE, date.toISOString())
}

export async function getDailyCalorieGoal(): Promise<number> {
  const value = await getPreference(PREF_KEYS.DAILY_GOAL_CALORIES)
  return value ? parseInt(value) : 2000 // Default 2000 calories
}

export async function setDailyCalorieGoal(calories: number): Promise<void> {
  await setPreference(PREF_KEYS.DAILY_GOAL_CALORIES, String(calories))
}

