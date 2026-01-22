/**
 * SQL Injection Prevention Tests
 */

import { describe, it, expect } from 'vitest'
import { sanitizeSql } from '@/middleware/sanitization'

describe('Security - SQL Injection Prevention', () => {
  it('should remove SQL injection attempts', () => {
    const malicious = "'; DROP TABLE users; --"
    const sanitized = sanitizeSql(malicious)

    expect(sanitized).not.toContain('DROP')
    expect(sanitized).not.toContain('--')
  })

  it('should remove SQL keywords', () => {
    const malicious = 'SELECT * FROM users WHERE id = 1 UNION SELECT * FROM passwords'
    const sanitized = sanitizeSql(malicious)

    expect(sanitized.toUpperCase()).not.toContain('SELECT')
    expect(sanitized.toUpperCase()).not.toContain('FROM')
    expect(sanitized.toUpperCase()).not.toContain('UNION')
  })

  it('should handle SQL comments', () => {
    const malicious = '/* comment */ data'
    const sanitized = sanitizeSql(malicious)

    expect(sanitized).not.toContain('/*')
  })

  it('should be case insensitive', () => {
    const malicious = 'SeLeCt * FrOm UsErS'
    const sanitized = sanitizeSql(malicious)

    expect(sanitized.toUpperCase()).not.toContain('SELECT')
  })
})
