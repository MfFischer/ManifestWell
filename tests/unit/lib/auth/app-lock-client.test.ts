/**
 * Unit tests for App Lock Client
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// Mock capacitor biometric auth to avoid import errors
vi.mock('@aparajita/capacitor-biometric-auth', () => ({
  BiometricAuth: {
    checkBiometry: vi.fn().mockResolvedValue({ isAvailable: false, biometryType: 0 })
  },
  BiometryType: {
    none: 0,
    touchId: 1,
    faceId: 2,
    fingerprintAuthentication: 3,
    faceAuthentication: 4,
    irisAuthentication: 5
  }
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} })
  }
})()

// Mock crypto.subtle for PBKDF2
const mockCrypto = {
  getRandomValues: vi.fn((arr: Uint8Array) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256)
    }
    return arr
  }),
  subtle: {
    importKey: vi.fn(() => Promise.resolve({ type: 'secret' })),
    deriveBits: vi.fn(() => Promise.resolve(new ArrayBuffer(32)))
  }
}

// Setup before importing the module
vi.stubGlobal('localStorage', localStorageMock)
vi.stubGlobal('crypto', mockCrypto)

describe('App Lock Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  afterEach(() => {
    vi.resetModules()
  })

  describe('PIN Security Module', () => {
    it('should record and retrieve failed attempts', async () => {
      const { recordFailedAttempt, getFailedAttempts, clearAttempts } = await import('@/lib/auth/pin-security')

      expect(getFailedAttempts()).toBe(0)

      recordFailedAttempt()
      expect(getFailedAttempts()).toBe(1)

      recordFailedAttempt()
      recordFailedAttempt()
      expect(getFailedAttempts()).toBe(3)

      clearAttempts()
      expect(getFailedAttempts()).toBe(0)
    })

    it('should enforce lockout after threshold attempts', async () => {
      const { recordFailedAttempt, isLockedOut, getLockoutRemaining } = await import('@/lib/auth/pin-security')

      // 3 attempts should trigger lockout
      recordFailedAttempt()
      recordFailedAttempt()
      recordFailedAttempt()

      expect(isLockedOut()).toBe(true)
      expect(getLockoutRemaining()).toBeGreaterThan(0)
    })

    it('should format lockout time correctly', async () => {
      const { formatLockoutRemaining } = await import('@/lib/auth/pin-security')

      expect(formatLockoutRemaining(30000)).toBe('30 seconds')
      expect(formatLockoutRemaining(1000)).toBe('1 second')
      expect(formatLockoutRemaining(60000)).toBe('1 minute')
      expect(formatLockoutRemaining(300000)).toBe('5 minutes')
      expect(formatLockoutRemaining(3600000)).toBe('1 hour')
    })
  })

  describe('App Lock Config', () => {
    it('should return default config when no PIN is set', async () => {
      const { getAppLockConfig } = await import('@/lib/auth/app-lock-client')

      const config = getAppLockConfig()

      expect(config.pinEnabled).toBe(false)
      expect(config.biometricEnabled).toBe(false)
      expect(config.timeoutMs).toBe(5 * 60 * 1000) // 5 minutes default
    })

    it('should detect PIN enabled when hash exists', async () => {
      localStorageMock.setItem('manifestwell_pin_hash', 'somehash')

      const { getAppLockConfig } = await import('@/lib/auth/app-lock-client')
      const config = getAppLockConfig()

      expect(config.pinEnabled).toBe(true)
    })
  })

  describe('Lock Timeout', () => {
    it('should determine lock status based on last activity', async () => {
      const { shouldLockApp, updateLastActive, getAppLockConfig } = await import('@/lib/auth/app-lock-client')

      // Setup a PIN
      localStorageMock.setItem('manifestwell_pin_hash', 'somehash')
      const config = getAppLockConfig()

      // Should lock if no last active timestamp
      expect(shouldLockApp(config)).toBe(true)

      // Update last active
      updateLastActive()
      expect(shouldLockApp(config)).toBe(false)
    })
  })
})

describe('PIN Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  it('should reject PIN shorter than 4 digits', async () => {
    const { setupPin } = await import('@/lib/auth/app-lock-client')

    await expect(setupPin('123')).rejects.toThrow('PIN must be 4-6 digits')
  })

  it('should reject PIN longer than 6 digits', async () => {
    const { setupPin } = await import('@/lib/auth/app-lock-client')

    await expect(setupPin('1234567')).rejects.toThrow('PIN must be 4-6 digits')
  })

  it('should reject non-numeric PIN', async () => {
    const { setupPin } = await import('@/lib/auth/app-lock-client')

    await expect(setupPin('12ab')).rejects.toThrow('PIN must contain only digits')
  })

  it('should accept valid 4-digit PIN', async () => {
    const { setupPin } = await import('@/lib/auth/app-lock-client')

    const result = await setupPin('1234')
    expect(result).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'manifestwell_pin_hash',
      expect.any(String)
    )
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'manifestwell_pin_salt',
      expect.any(String)
    )
  })

  it('should accept valid 6-digit PIN', async () => {
    const { setupPin } = await import('@/lib/auth/app-lock-client')

    const result = await setupPin('123456')
    expect(result).toBe(true)
  })
})

describe('PIN Removal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    localStorageMock.setItem('manifestwell_pin_hash', 'somehash')
    localStorageMock.setItem('manifestwell_pin_salt', 'somesalt')
  })

  it('should remove PIN and salt from storage', async () => {
    const { removePin } = await import('@/lib/auth/app-lock-client')

    removePin()

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('manifestwell_pin_hash')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('manifestwell_pin_salt')
  })
})
