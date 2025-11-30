/**
 * PIN Security Module
 *
 * Provides rate limiting and lockout functionality for PIN attempts.
 * Implements exponential backoff to prevent brute-force attacks.
 */

const ATTEMPTS_KEY = 'manifestwell_pin_attempts'
const LOCKOUT_UNTIL_KEY = 'manifestwell_lockout_until'

/**
 * Lockout thresholds with exponential backoff
 */
const LOCKOUT_THRESHOLDS = [
  { attempts: 3, lockoutMs: 30_000 },      // 30 seconds
  { attempts: 5, lockoutMs: 300_000 },     // 5 minutes
  { attempts: 8, lockoutMs: 900_000 },     // 15 minutes
  { attempts: 10, lockoutMs: 3600_000 },   // 1 hour
] as const

/**
 * Gets the current number of failed attempts
 */
export function getFailedAttempts(): number {
  if (typeof window === 'undefined') return 0

  const data = localStorage.getItem(ATTEMPTS_KEY)
  if (!data) return 0

  try {
    const { count, timestamp } = JSON.parse(data)
    // Reset attempts if more than 1 hour has passed
    if (Date.now() - timestamp > 3600_000) {
      clearAttempts()
      return 0
    }
    return count
  } catch {
    return 0
  }
}

/**
 * Records a failed PIN attempt and updates lockout if necessary
 */
export function recordFailedAttempt(): void {
  if (typeof window === 'undefined') return

  const currentAttempts = getFailedAttempts() + 1

  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify({
    count: currentAttempts,
    timestamp: Date.now()
  }))

  // Check if we need to apply a lockout
  for (let i = LOCKOUT_THRESHOLDS.length - 1; i >= 0; i--) {
    if (currentAttempts >= LOCKOUT_THRESHOLDS[i].attempts) {
      const lockoutUntil = Date.now() + LOCKOUT_THRESHOLDS[i].lockoutMs
      localStorage.setItem(LOCKOUT_UNTIL_KEY, String(lockoutUntil))
      break
    }
  }
}

/**
 * Clears all failed attempts (called on successful unlock)
 */
export function clearAttempts(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(ATTEMPTS_KEY)
  localStorage.removeItem(LOCKOUT_UNTIL_KEY)
}

/**
 * Gets the remaining lockout time in milliseconds
 * Returns null if not locked out
 */
export function getLockoutRemaining(): number | null {
  if (typeof window === 'undefined') return null

  const lockoutUntil = localStorage.getItem(LOCKOUT_UNTIL_KEY)
  if (!lockoutUntil) return null

  const remaining = parseInt(lockoutUntil) - Date.now()
  if (remaining <= 0) {
    localStorage.removeItem(LOCKOUT_UNTIL_KEY)
    return null
  }

  return remaining
}

/**
 * Checks if the user is currently locked out
 */
export function isLockedOut(): boolean {
  return getLockoutRemaining() !== null
}

/**
 * Formats the lockout remaining time as a human-readable string
 */
export function formatLockoutRemaining(ms: number): string {
  const seconds = Math.ceil(ms / 1000)

  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`
  }

  const minutes = Math.ceil(seconds / 60)
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`
  }
  return `${hours}h ${remainingMinutes}m`
}

/**
 * Gets the lockout message based on current attempt count
 */
export function getLockoutMessage(attempts: number): string {
  if (attempts < 3) {
    return ''
  }

  if (attempts < 5) {
    return 'Too many attempts. Please wait before trying again.'
  }

  if (attempts < 8) {
    return 'Multiple failed attempts detected. Account temporarily locked.'
  }

  return 'Too many failed attempts. Please try again later.'
}
