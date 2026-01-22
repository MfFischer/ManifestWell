/**
 * Unit tests for E2E Encryption module
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { E2EEncryption, encryption } from '@/lib/encryption/crypto'

describe('E2EEncryption', () => {
  let enc: E2EEncryption

  beforeEach(() => {
    enc = new E2EEncryption()
  })

  describe('Key Derivation', () => {
    it('should derive consistent keys from same password and salt', async () => {
      const password = 'testPassword123'
      const salt = enc.generateSalt()

      const key1 = await enc.deriveKey(password, salt)
      const key2 = await enc.deriveKey(password, salt)

      expect(key1).toEqual(key2)
      expect(key1.length).toBe(32) // 256 bits
    })

    it('should derive different keys from different passwords', async () => {
      const salt = enc.generateSalt()

      const key1 = await enc.deriveKey('password1', salt)
      const key2 = await enc.deriveKey('password2', salt)

      expect(key1).not.toEqual(key2)
    })

    it('should derive different keys from different salts', async () => {
      const password = 'samePassword'
      const salt1 = enc.generateSalt()
      const salt2 = enc.generateSalt()

      const key1 = await enc.deriveKey(password, salt1)
      const key2 = await enc.deriveKey(password, salt2)

      expect(key1).not.toEqual(key2)
    })
  })

  describe('Salt Generation', () => {
    it('should generate unique salts', () => {
      const salt1 = enc.generateSalt()
      const salt2 = enc.generateSalt()

      expect(salt1).not.toEqual(salt2)
      expect(salt1.length).toBe(32) // 256 bits
    })
  })

  describe('Encryption and Decryption', () => {
    it('should encrypt and decrypt data correctly', async () => {
      const plaintext = 'This is a secret message for my journal'
      const salt = enc.generateSalt()
      const key = await enc.deriveKey('myPassword', salt)

      const encrypted = await enc.encryptField(plaintext, key)
      const decrypted = await enc.decryptField(encrypted, key)

      expect(decrypted).toBe(plaintext)
    })

    it('should generate unique nonces for each encryption', async () => {
      const plaintext = 'Same message'
      const salt = enc.generateSalt()
      const key = await enc.deriveKey('password', salt)

      const encrypted1 = await enc.encryptField(plaintext, key)
      const encrypted2 = await enc.encryptField(plaintext, key)

      // Same plaintext should produce different ciphertext due to unique nonces
      expect(encrypted1).not.toBe(encrypted2)
    })

    it('should fail decryption with wrong key', async () => {
      const plaintext = 'Secret data'
      const salt = enc.generateSalt()
      const correctKey = await enc.deriveKey('correctPassword', salt)
      const wrongKey = await enc.deriveKey('wrongPassword', salt)

      const encrypted = await enc.encryptField(plaintext, correctKey)

      await expect(enc.decryptField(encrypted, wrongKey))
        .rejects.toThrow('Decryption failed')
    })

    it('should handle empty strings', async () => {
      const salt = enc.generateSalt()
      const key = await enc.deriveKey('password', salt)

      const encrypted = await enc.encryptField('', key)
      const decrypted = await enc.decryptField(encrypted, key)

      expect(decrypted).toBe('')
    })

    it('should handle unicode and special characters', async () => {
      const plaintext = 'Hello 世界! 🎉 Special chars: <>&"\'\n\t'
      const salt = enc.generateSalt()
      const key = await enc.deriveKey('password', salt)

      const encrypted = await enc.encryptField(plaintext, key)
      const decrypted = await enc.decryptField(encrypted, key)

      expect(decrypted).toBe(plaintext)
    })

    it('should handle long content', async () => {
      const plaintext = 'x'.repeat(50000) // 50KB of text
      const salt = enc.generateSalt()
      const key = await enc.deriveKey('password', salt)

      const encrypted = await enc.encryptField(plaintext, key)
      const decrypted = await enc.decryptField(encrypted, key)

      expect(decrypted).toBe(plaintext)
    })

    it('should reject invalid key length', async () => {
      const plaintext = 'test'
      const invalidKey = new Uint8Array(16) // 128 bits instead of 256

      await expect(enc.encryptField(plaintext, invalidKey))
        .rejects.toThrow('Invalid key length')
    })
  })

  describe('Object Encryption', () => {
    it('should encrypt only specified fields', async () => {
      const salt = enc.generateSalt()
      const key = await enc.deriveKey('password', salt)

      const obj = {
        title: 'My Entry',
        content: 'Secret content',
        mood: 'happy'
      }

      const encrypted = await enc.encryptObject(obj, ['content'], key)

      expect(encrypted.title).toBe('My Entry') // Not encrypted
      expect(encrypted.mood).toBe('happy') // Not encrypted
      expect(encrypted.content).not.toBe('Secret content') // Encrypted
      expect(typeof encrypted.content).toBe('string')
    })

    it('should decrypt only specified fields', async () => {
      const salt = enc.generateSalt()
      const key = await enc.deriveKey('password', salt)

      const original = {
        title: 'My Entry',
        content: 'Secret content',
        mood: 'happy'
      }

      const encrypted = await enc.encryptObject(original, ['content'], key)
      const decrypted = await enc.decryptObject(encrypted, ['content'], key)

      expect(decrypted.title).toBe('My Entry')
      expect(decrypted.content).toBe('Secret content')
      expect(decrypted.mood).toBe('happy')
    })
  })

  describe('Encryption Detection', () => {
    it('should detect encrypted strings', async () => {
      const salt = enc.generateSalt()
      const key = await enc.deriveKey('password', salt)

      const encrypted = await enc.encryptField('test', key)

      expect(enc.isEncrypted(encrypted)).toBe(true)
      expect(enc.isEncrypted('plain text')).toBe(false)
      expect(enc.isEncrypted('')).toBe(false)
    })
  })

  describe('Version', () => {
    it('should return encryption version', () => {
      expect(enc.getVersion()).toBe(1)
      expect(encryption.getVersion()).toBe(1)
    })
  })
})
