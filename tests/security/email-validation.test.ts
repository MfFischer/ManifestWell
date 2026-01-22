/**
 * Email Validation Tests
 */

import { describe, it, expect } from 'vitest'
import { sanitizeEmail } from '@/middleware/sanitization'

describe('Security - Email Validation', () => {
  it('should accept valid emails', () => {
    expect(sanitizeEmail('user@example.com')).toBe('user@example.com')
    expect(sanitizeEmail('test+tag@domain.co.uk')).toBe('test+tag@domain.co.uk')
  })

  it('should reject invalid emails', () => {
    expect(sanitizeEmail('notanemail')).toBeNull()
    expect(sanitizeEmail('@example.com')).toBeNull()
    expect(sanitizeEmail('user@')).toBeNull()
    expect(sanitizeEmail('user @example.com')).toBeNull()
  })

  it('should normalize emails', () => {
    expect(sanitizeEmail('USER@EXAMPLE.COM')).toBe('user@example.com')
    expect(sanitizeEmail('  user@example.com  ')).toBe('user@example.com')
  })
})
