/**
 * App Lock Client Service (Browser-safe)
 *
 * Client-side app lock using localStorage with secure PBKDF2 hashing.
 * For a local-first app, we store PIN hash in localStorage.
 */

import { authenticateWithBiometric, checkBiometricAvailability } from './biometric'
import { clearAttempts, recordFailedAttempt, isLockedOut, getLockoutRemaining, formatLockoutRemaining } from './pin-security'

const PIN_HASH_KEY = 'manifestwell_pin_hash'
const PIN_SALT_KEY = 'manifestwell_pin_salt'
const BIOMETRIC_ENABLED_KEY = 'manifestwell_biometric_enabled'
const LOCK_TIMEOUT_KEY = 'manifestwell_lock_timeout'
const LAST_ACTIVE_KEY = 'manifestwell_last_active'
const DEFAULT_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes

// PBKDF2 parameters for secure key derivation
const PBKDF2_ITERATIONS = 100000
const SALT_LENGTH = 16 // 128 bits
const HASH_LENGTH = 256 // bits

export interface AppLockConfig {
  pinEnabled: boolean
  biometricEnabled: boolean
  timeoutMs: number
}

/**
 * Generates a cryptographically secure random salt
 */
function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
}

/**
 * Converts Uint8Array to hex string
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Converts hex string to Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16)
  }
  return bytes
}

/**
 * Secure PIN hashing using PBKDF2 with Web Crypto API
 * This is resistant to brute-force attacks unlike plain SHA-256
 *
 * @param pin - The PIN to hash
 * @param salt - Unique salt for this PIN (16 bytes)
 * @returns Hex-encoded hash
 */
async function hashPinSecure(pin: string, salt: Uint8Array): Promise<string> {
  const encoder = new TextEncoder()
  const pinBytes = encoder.encode(pin)

  // Import PIN as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    pinBytes,
    'PBKDF2',
    false,
    ['deriveBits']
  )

  // Derive key using PBKDF2 with high iteration count
  // Note: Cast salt buffer to satisfy TypeScript's strict BufferSource type
  const saltBuffer = new Uint8Array(salt.buffer.slice(salt.byteOffset, salt.byteOffset + salt.byteLength))
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    HASH_LENGTH
  )

  return bytesToHex(new Uint8Array(derivedBits))
}

// Re-export pin security utilities for use in components
export { isLockedOut, getLockoutRemaining, formatLockoutRemaining }

/**
 * Get app lock configuration from localStorage
 */
export function getAppLockConfig(): AppLockConfig {
  if (typeof window === 'undefined') {
    return {
      pinEnabled: false,
      biometricEnabled: false,
      timeoutMs: DEFAULT_TIMEOUT_MS
    }
  }

  const pinHash = localStorage.getItem(PIN_HASH_KEY)
  const biometricEnabled = localStorage.getItem(BIOMETRIC_ENABLED_KEY) === 'true'
  const timeoutMs = parseInt(localStorage.getItem(LOCK_TIMEOUT_KEY) || String(DEFAULT_TIMEOUT_MS))

  return {
    pinEnabled: !!pinHash,
    biometricEnabled,
    timeoutMs
  }
}

/**
 * Check if app should be locked based on inactivity timeout
 */
export function shouldLockApp(config: AppLockConfig): boolean {
  if (!config.pinEnabled && !config.biometricEnabled) {
    return false
  }

  if (typeof window === 'undefined') return false

  const lastActive = localStorage.getItem(LAST_ACTIVE_KEY)
  if (!lastActive) return true

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
 * Set up a new PIN with secure PBKDF2 hashing
 */
export async function setupPin(pin: string): Promise<boolean> {
  if (pin.length < 4 || pin.length > 6) {
    throw new Error('PIN must be 4-6 digits')
  }

  if (!/^\d+$/.test(pin)) {
    throw new Error('PIN must contain only digits')
  }

  // Generate a unique salt for this PIN
  const salt = generateSalt()
  const saltHex = bytesToHex(salt)

  // Hash PIN with PBKDF2
  const pinHash = await hashPinSecure(pin, salt)

  // Store both salt and hash
  localStorage.setItem(PIN_SALT_KEY, saltHex)
  localStorage.setItem(PIN_HASH_KEY, pinHash)

  // Clear any failed attempts from previous PIN
  clearAttempts()
  updateLastActive()

  return true
}

/**
 * Verify PIN with secure PBKDF2 and rate limiting
 */
export async function verifyPin(pin: string): Promise<boolean> {
  // Check if locked out first
  if (isLockedOut()) {
    const remaining = getLockoutRemaining()
    throw new Error(`Too many attempts. Try again in ${formatLockoutRemaining(remaining!)}`)
  }

  const storedHash = localStorage.getItem(PIN_HASH_KEY)
  const storedSaltHex = localStorage.getItem(PIN_SALT_KEY)

  if (!storedHash || !storedSaltHex) return false

  // Reconstruct salt and verify
  const salt = hexToBytes(storedSaltHex)
  const pinHash = await hashPinSecure(pin, salt)
  const isValid = pinHash === storedHash

  if (isValid) {
    // Clear failed attempts on success
    clearAttempts()
    updateLastActive()
  } else {
    // Record failed attempt for rate limiting
    recordFailedAttempt()
  }

  return isValid
}

/**
 * Remove PIN (disable app lock)
 */
export function removePin(): void {
  localStorage.removeItem(PIN_HASH_KEY)
  localStorage.removeItem(PIN_SALT_KEY)
  clearAttempts()
}

/**
 * Enable biometric unlock
 */
export async function enableBiometric(): Promise<boolean> {
  const availability = await checkBiometricAvailability()
  if (!availability.isAvailable) {
    throw new Error(availability.reason || 'Biometric not available')
  }

  const result = await authenticateWithBiometric('Enable biometric unlock')
  if (!result.success) {
    throw new Error(result.error || 'Biometric verification failed')
  }

  localStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true')
  return true
}

/**
 * Disable biometric unlock
 */
export function disableBiometric(): void {
  localStorage.setItem(BIOMETRIC_ENABLED_KEY, 'false')
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

/**
 * Set lock timeout
 */
export function setLockTimeout(timeoutMs: number): void {
  localStorage.setItem(LOCK_TIMEOUT_KEY, String(timeoutMs))
}
