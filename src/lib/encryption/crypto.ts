/**
 * End-to-End Encryption Implementation
 * Uses XChaCha20-Poly1305 for authenticated encryption
 */

import { xchacha20poly1305 } from '@noble/ciphers/chacha.js'
import { randomBytes, bytesToHex, hexToBytes, utf8ToBytes, bytesToUtf8 } from '@noble/ciphers/utils.js'
import { pbkdf2 } from '@noble/hashes/pbkdf2.js'
import { sha256 } from '@noble/hashes/sha2.js'
import { logger } from '@/lib/utils/logger'

const ENCRYPTION_VERSION = 1
const PBKDF2_ITERATIONS = 100000
const KEY_LENGTH = 32 // 256 bits
const NONCE_LENGTH = 24 // 192 bits for XChaCha20

/**
 * End-to-End Encryption service for sensitive data
 *
 * @example
 * ```typescript
 * const encryption = new E2EEncryption()
 *
 * // Derive key from password
 * const key = await encryption.deriveKey('password123', salt)
 *
 * // Encrypt journal entry
 * const encrypted = await encryption.encryptField('My secret thoughts', key)
 *
 * // Decrypt
 * const decrypted = await encryption.decryptField(encrypted, key)
 * ```
 */
export class E2EEncryption {
  /**
   * Derives an encryption key from a password using PBKDF2
   *
   * @param password - User's password or master key
   * @param salt - Salt for key derivation (should be unique per user)
   * @returns Derived encryption key (32 bytes)
   *
   * @example
   * ```typescript
   * const salt = randomBytes(32)
   * const key = await encryption.deriveKey('myPassword123', salt)
   * ```
   */
  async deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
    const passwordBytes = utf8ToBytes(password)
    const derivedKey = pbkdf2(sha256, passwordBytes, salt, {
      c: PBKDF2_ITERATIONS,
      dkLen: KEY_LENGTH
    })
    return derivedKey
  }

  /**
   * Generates a cryptographically secure random salt
   *
   * @returns Random salt (32 bytes)
   *
   * @example
   * ```typescript
   * const salt = encryption.generateSalt()
   * ```
   */
  generateSalt(): Uint8Array {
    return randomBytes(KEY_LENGTH)
  }

  /**
   * Generates a random nonce for encryption
   *
   * @returns Random nonce (24 bytes)
   */
  private generateNonce(): Uint8Array {
    return randomBytes(NONCE_LENGTH)
  }

  /**
   * Encrypts a string using XChaCha20-Poly1305
   *
   * @param plaintext - Data to encrypt
   * @param key - Encryption key (32 bytes)
   * @returns Encrypted data as hex string with embedded nonce
   *
   * @example
   * ```typescript
   * const encrypted = await encryption.encryptField(
   *   'Sensitive journal entry',
   *   userKey
   * )
   * // Returns: "nonce:ciphertext:authTag" in hex
   * ```
   */
  async encryptField(plaintext: string, key: Uint8Array): Promise<string> {
    if (key.length !== KEY_LENGTH) {
      throw new Error(`Invalid key length. Expected ${KEY_LENGTH} bytes`)
    }

    // Generate random nonce
    const nonce = this.generateNonce()

    // Convert plaintext to bytes
    const plaintextBytes = utf8ToBytes(plaintext)

    // Encrypt with XChaCha20-Poly1305
    const cipher = xchacha20poly1305(key, nonce)
    const ciphertext = cipher.encrypt(plaintextBytes)

    // Combine nonce + ciphertext and convert to hex
    const combined = new Uint8Array(nonce.length + ciphertext.length)
    combined.set(nonce, 0)
    combined.set(ciphertext, nonce.length)

    return bytesToHex(combined)
  }

  /**
   * Decrypts an encrypted string
   *
   * @param encrypted - Encrypted hex string (nonce + ciphertext)
   * @param key - Decryption key (32 bytes)
   * @returns Decrypted plaintext
   * @throws Error if decryption fails or authentication tag is invalid
   *
   * @example
   * ```typescript
   * const decrypted = await encryption.decryptField(encrypted, userKey)
   * ```
   */
  async decryptField(encrypted: string, key: Uint8Array): Promise<string> {
    if (key.length !== KEY_LENGTH) {
      throw new Error(`Invalid key length. Expected ${KEY_LENGTH} bytes`)
    }

    try {
      // Convert hex to bytes
      const combined = hexToBytes(encrypted)

      // Extract nonce and ciphertext
      const nonce = combined.slice(0, NONCE_LENGTH)
      const ciphertext = combined.slice(NONCE_LENGTH)

      // Decrypt
      const cipher = xchacha20poly1305(key, nonce)
      const plaintextBytes = cipher.decrypt(ciphertext)

      // Convert bytes to string
      return bytesToUtf8(plaintextBytes)
    } catch (error) {
      throw new Error('Decryption failed. Invalid key or corrupted data.')
    }
  }

  /**
   * Encrypts an entire object, encrypting only specified fields
   *
   * @param obj - Object to encrypt
   * @param fieldsToEncrypt - Array of field names to encrypt
   * @param key - Encryption key
   * @returns Object with encrypted fields
   *
   * @example
   * ```typescript
   * const encrypted = await encryption.encryptObject(
   *   { title: 'My Entry', content: 'Secret text', mood: 'happy' },
   *   ['content'],
   *   userKey
   * )
   * // Returns: { title: 'My Entry', content: 'hex...', mood: 'happy' }
   * ```
   */
  async encryptObject(
    obj: Record<string, unknown>,
    fieldsToEncrypt: string[],
    key: Uint8Array
  ): Promise<Record<string, unknown>> {
    const result = { ...obj }

    for (const field of fieldsToEncrypt) {
      if (field in obj && typeof obj[field] === 'string') {
        result[field] = await this.encryptField(obj[field] as string, key)
      }
    }

    return result
  }

  /**
   * Decrypts an object, decrypting only specified fields
   *
   * @param obj - Object with encrypted fields
   * @param fieldsToDecrypt - Array of field names to decrypt
   * @param key - Decryption key
   * @returns Object with decrypted fields
   *
   * @example
   * ```typescript
   * const decrypted = await encryption.decryptObject(
   *   encryptedEntry,
   *   ['content'],
   *   userKey
   * )
   * ```
   */
  async decryptObject(
    obj: Record<string, unknown>,
    fieldsToDecrypt: string[],
    key: Uint8Array
  ): Promise<Record<string, unknown>> {
    const result = { ...obj }

    for (const field of fieldsToDecrypt) {
      if (field in obj && typeof obj[field] === 'string') {
        try {
          result[field] = await this.decryptField(obj[field] as string, key)
        } catch (error) {
          logger.error(`Failed to decrypt field ${field}:`, error)
          // Keep encrypted value if decryption fails
        }
      }
    }

    return result
  }

  /**
   * Checks if a string is encrypted (basic heuristic)
   *
   * @param value - String to check
   * @returns True if appears to be encrypted
   */
  isEncrypted(value: string): boolean {
    // Check if it's a valid hex string of reasonable length
    return /^[0-9a-f]{48,}$/i.test(value)
  }

  /**
   * Gets the encryption version
   *
   * @returns Current encryption version number
   */
  getVersion(): number {
    return ENCRYPTION_VERSION
  }
}

/**
 * Singleton instance for convenience
 */
export const encryption = new E2EEncryption()

/**
 * Helper function to encrypt journal entries
 *
 * @param content - Journal content to encrypt
 * @param userKey - User's encryption key
 * @returns Encrypted content with metadata
 *
 * @example
 * ```typescript
 * const encrypted = await encryptJournalEntry(
 *   'My private thoughts',
 *   userKey
 * )
 * ```
 */
export async function encryptJournalEntry(
  content: string,
  userKey: Uint8Array
): Promise<{
  contentEncrypted: string
  isEncrypted: boolean
  encryptionVersion: number
  nonce: string
}> {
  const nonce = encryption.generateSalt()
  const contentEncrypted = await encryption.encryptField(content, userKey)

  return {
    contentEncrypted,
    isEncrypted: true,
    encryptionVersion: encryption.getVersion(),
    nonce: bytesToHex(nonce)
  }
}

/**
 * Helper function to decrypt journal entries
 *
 * @param encrypted - Encrypted journal data
 * @param userKey - User's encryption key
 * @returns Decrypted content
 *
 * @example
 * ```typescript
 * const content = await decryptJournalEntry(encryptedData, userKey)
 * ```
 */
export async function decryptJournalEntry(
  encrypted: { contentEncrypted: string; isEncrypted: boolean },
  userKey: Uint8Array
): Promise<string> {
  if (!encrypted.isEncrypted) {
    return encrypted.contentEncrypted
  }

  return encryption.decryptField(encrypted.contentEncrypted, userKey)
}
