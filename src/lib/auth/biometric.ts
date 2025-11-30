/**
 * Biometric Authentication Module
 * Handles Touch ID / Face ID authentication on mobile devices
 */

import { BiometricAuth, BiometryType } from '@aparajita/capacitor-biometric-auth'

export interface BiometricAvailability {
  isAvailable: boolean
  biometryType: BiometryType
  reason?: string
}

export interface BiometricAuthResult {
  success: boolean
  error?: string
}

/**
 * Check if biometric authentication is available
 *
 * @returns Availability status and biometry type
 *
 * @example
 * ```typescript
 * const { isAvailable, biometryType } = await checkBiometricAvailability()
 * if (isAvailable) {
 *   console.log('Biometric auth available:', biometryType)
 * }
 * ```
 */
export async function checkBiometricAvailability(): Promise<BiometricAvailability> {
  try {
    const result = await BiometricAuth.checkBiometry()

    return {
      isAvailable: result.isAvailable,
      biometryType: result.biometryType,
      reason: result.reason
    }
  } catch (error) {
    return {
      isAvailable: false,
      biometryType: BiometryType.none,
      reason: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Authenticate user with biometrics
 *
 * @param reason - Reason shown to user (e.g., "Unlock ManifestWell")
 * @returns Authentication result
 *
 * @example
 * ```typescript
 * const result = await authenticateWithBiometric('Access your wellness data')
 * if (result.success) {
 *   // Proceed with login
 * }
 * ```
 */
export async function authenticateWithBiometric(
  reason: string = 'Authenticate to access your wellness data'
): Promise<BiometricAuthResult> {
  try {
    // Check availability first
    const availability = await checkBiometricAvailability()

    if (!availability.isAvailable) {
      return {
        success: false,
        error: availability.reason || 'Biometric authentication not available'
      }
    }

    // Perform authentication
    await BiometricAuth.authenticate({
      reason,
      cancelTitle: 'Cancel',
      allowDeviceCredential: true,
      iosFallbackTitle: 'Use Passcode',
      androidTitle: 'Biometric Authentication',
      androidSubtitle: reason,
      androidConfirmationRequired: false
    })

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    }
  }
}

/**
 * Get biometry type as human-readable string
 *
 * @param type - Biometry type enum
 * @returns Human-readable biometry name
 *
 * @example
 * ```typescript
 * const name = getBiometryTypeName(BiometryType.faceId)
 * // Returns: "Face ID"
 * ```
 */
export function getBiometryTypeName(type: BiometryType): string {
  switch (type) {
    case BiometryType.touchId:
      return 'Touch ID'
    case BiometryType.faceId:
      return 'Face ID'
    case BiometryType.fingerprintAuthentication:
      return 'Fingerprint'
    case BiometryType.faceAuthentication:
      return 'Face Recognition'
    case BiometryType.irisAuthentication:
      return 'Iris Scan'
    default:
      return 'Biometric'
  }
}

/**
 * Enable biometric authentication for user
 * This should be called after user opts in to biometric auth
 *
 * @param userId - User ID
 * @returns Success status
 *
 * @example
 * ```typescript
 * const enabled = await enableBiometricAuth(user.id)
 * if (enabled) {
 *   // Update user preferences in database
 * }
 * ```
 */
export async function enableBiometricAuth(userId: string): Promise<boolean> {
  try {
    // Verify biometric auth works before enabling
    const result = await authenticateWithBiometric('Enable biometric authentication')

    if (result.success) {
      // Store user preference (you would save this to database)
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`biometric_enabled_${userId}`, 'true')
      }
      return true
    }

    return false
  } catch {
    return false
  }
}

/**
 * Disable biometric authentication for user
 *
 * @param userId - User ID
 *
 * @example
 * ```typescript
 * await disableBiometricAuth(user.id)
 * ```
 */
export async function disableBiometricAuth(userId: string): Promise<void> {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem(`biometric_enabled_${userId}`)
  }
}

/**
 * Check if biometric auth is enabled for user
 *
 * @param userId - User ID
 * @returns True if enabled
 *
 * @example
 * ```typescript
 * const enabled = await isBiometricEnabled(user.id)
 * ```
 */
export async function isBiometricEnabled(userId: string): Promise<boolean> {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem(`biometric_enabled_${userId}`) === 'true'
  }
  return false
}
