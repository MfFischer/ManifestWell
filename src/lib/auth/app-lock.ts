/**
 * App Lock Service
 * 
 * Manages PIN-based and biometric app lock for local-first mobile app.
 * Protects user data when app is in background or device is shared.
 */

import { db } from '@/lib/db'
import { LOCAL_USER_ID } from './local-user'
import { authenticateWithBiometric, checkBiometricAvailability } from './biometric'
import bcrypt from 'bcryptjs'

const LOCK_TIMEOUT_KEY = 'app_lock_timeout'
const LAST_ACTIVE_KEY = 'app_last_active'
const DEFAULT_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes

export interface AppLockConfig {
  pinEnabled: boolean
  biometricEnabled: boolean
  timeoutMs: number
}

export interface AppLockState {
  isLocked: boolean
  config: AppLockConfig
}

/**
 * Hash a PIN for secure storage
 */
async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, 10)
}

/**
 * Verify a PIN against stored hash
 */
async function verifyPinHash(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin, hash)
}

/**
 * Get app lock configuration from database
 */
export async function getAppLockConfig(): Promise<AppLockConfig> {
  const user = await db.user.findUnique({
    where: { id: LOCAL_USER_ID },
    select: { pinHash: true, biometricEnabled: true }
  })

  const timeoutMs = typeof window !== 'undefined' 
    ? parseInt(localStorage.getItem(LOCK_TIMEOUT_KEY) || String(DEFAULT_TIMEOUT_MS))
    : DEFAULT_TIMEOUT_MS

  return {
    pinEnabled: !!user?.pinHash,
    biometricEnabled: user?.biometricEnabled ?? false,
    timeoutMs
  }
}

/**
 * Check if app should be locked based on inactivity timeout
 */
export function shouldLockApp(config: AppLockConfig): boolean {
  if (!config.pinEnabled && !config.biometricEnabled) {
    return false // No lock configured
  }

  if (typeof window === 'undefined') return false

  const lastActive = localStorage.getItem(LAST_ACTIVE_KEY)
  if (!lastActive) return true // First run or cleared

  const elapsed = Date.now() - parseInt(lastActive)
  return elapsed > config.timeoutMs
}

/**
 * Update last active timestamp
 */
export function updateLastActive(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()))
  }
}

/**
 * Set up a new PIN
 */
export async function setupPin(pin: string): Promise<boolean> {
  if (pin.length < 4 || pin.length > 6) {
    throw new Error('PIN must be 4-6 digits')
  }

  if (!/^\d+$/.test(pin)) {
    throw new Error('PIN must contain only digits')
  }

  const pinHash = await hashPin(pin)

  await db.user.update({
    where: { id: LOCAL_USER_ID },
    data: { pinHash }
  })

  updateLastActive()
  return true
}

/**
 * Verify PIN
 */
export async function verifyPin(pin: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: LOCAL_USER_ID },
    select: { pinHash: true }
  })

  if (!user?.pinHash) return false

  const isValid = await verifyPinHash(pin, user.pinHash)

  if (isValid) {
    updateLastActive()
  }

  return isValid
}

/**
 * Remove PIN (disable app lock)
 */
export async function removePin(): Promise<void> {
  await db.user.update({
    where: { id: LOCAL_USER_ID },
    data: { pinHash: null }
  })
}

/**
 * Enable biometric unlock
 */
export async function enableBiometric(): Promise<boolean> {
  const availability = await checkBiometricAvailability()
  if (!availability.isAvailable) {
    throw new Error(availability.reason || 'Biometric not available')
  }

  // Verify biometric works before enabling
  const result = await authenticateWithBiometric('Enable biometric unlock')
  if (!result.success) {
    throw new Error(result.error || 'Biometric verification failed')
  }

  await db.user.update({
    where: { id: LOCAL_USER_ID },
    data: { biometricEnabled: true }
  })

  return true
}

/**
 * Disable biometric unlock
 */
export async function disableBiometric(): Promise<void> {
  await db.user.update({
    where: { id: LOCAL_USER_ID },
    data: { biometricEnabled: false }
  })
}

/**
 * Unlock app with biometric
 */
export async function unlockWithBiometric(): Promise<boolean> {
  const result = await authenticateWithBiometric('Unlock ManifestWell')
  
  if (result.success) {
    updateLastActive()
  }

  return result.success
}

