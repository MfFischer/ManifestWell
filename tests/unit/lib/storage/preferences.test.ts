/**
 * Tests for preferences storage module
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  PREF_KEYS,
  getTheme,
  isOnboardingComplete,
  getLockTimeout,
  getDailyCalorieGoal
} from '@/lib/storage/preferences'

// Mock Capacitor Preferences
vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn()
  }
}))

describe('Preferences Storage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('PREF_KEYS', () => {
    it('should have all required keys', () => {
      expect(PREF_KEYS.THEME).toBe('app_theme')
      expect(PREF_KEYS.ONBOARDING_COMPLETE).toBe('onboarding_complete')
      expect(PREF_KEYS.LOCK_TIMEOUT).toBe('lock_timeout_ms')
      expect(PREF_KEYS.DAILY_GOAL_CALORIES).toBe('daily_goal_calories')
    })
  })

  describe('Theme helpers', () => {
    it('getTheme should return system by default', async () => {
      const theme = await getTheme()
      expect(theme).toBe('system')
    })
  })

  describe('Onboarding helpers', () => {
    it('isOnboardingComplete should return false by default', async () => {
      const complete = await isOnboardingComplete()
      expect(complete).toBe(false)
    })
  })

  describe('Lock timeout helpers', () => {
    it('getLockTimeout should return default 5 minutes', async () => {
      const timeout = await getLockTimeout()
      expect(timeout).toBe(5 * 60 * 1000)
    })
  })

  describe('Calorie goal helpers', () => {
    it('getDailyCalorieGoal should return default 2000', async () => {
      const goal = await getDailyCalorieGoal()
      expect(goal).toBe(2000)
    })
  })
})

