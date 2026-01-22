/**
 * Unit tests for Sanitization Middleware
 */

import { describe, it, expect } from 'vitest'
import {
  escapeHtml,
  sanitizeString,
  sanitizeObject,
  sanitizeEmail,
  sanitizeSql,
  sanitize
} from '@/middleware/sanitization'

describe('Sanitization Middleware', () => {
  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("xss")</script>'
      const escaped = escapeHtml(input)

      expect(escaped).not.toContain('<')
      expect(escaped).not.toContain('>')
      expect(escaped).toContain('&lt;')
      expect(escaped).toContain('&gt;')
    })

    it('should escape quotes', () => {
      const input = 'He said "Hello"'
      const escaped = escapeHtml(input)

      expect(escaped).toContain('&quot;')
    })

    it('should escape ampersands', () => {
      const input = 'Tom & Jerry'
      const escaped = escapeHtml(input)

      expect(escaped).toBe('Tom &amp; Jerry')
    })

    it('should handle empty strings', () => {
      expect(escapeHtml('')).toBe('')
    })
  })

  describe('sanitizeString', () => {
    it('should remove script tags and their content', () => {
      const malicious = '<script>alert("xss")</script>Hello World'
      const sanitized = sanitizeString(malicious)

      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('alert')
      expect(sanitized).toContain('Hello World')
    })

    it('should remove inline event handlers', () => {
      const inputs = [
        '<div onclick="malicious()">Click</div>',
        '<img onerror="steal()" src="x">',
        '<body onload="hack()">',
        '<a onmouseover="phish()">Link</a>'
      ]

      for (const input of inputs) {
        const sanitized = sanitizeString(input)
        expect(sanitized).not.toMatch(/on\w+\s*=/i)
      }
    })

    it('should remove javascript: protocol', () => {
      const malicious = '<a href="javascript:alert(1)">Click me</a>'
      const sanitized = sanitizeString(malicious)

      expect(sanitized).not.toContain('javascript:')
    })

    it('should remove data:text/html protocol', () => {
      const malicious = '<a href="data:text/html,<script>alert(1)</script>">Click</a>'
      const sanitized = sanitizeString(malicious)

      expect(sanitized).not.toContain('data:text/html')
    })

    it('should handle non-string input', () => {
      // @ts-expect-error Testing non-string input
      expect(sanitizeString(null)).toBe('')
      // @ts-expect-error Testing non-string input
      expect(sanitizeString(undefined)).toBe('')
      // @ts-expect-error Testing non-string input
      expect(sanitizeString(123)).toBe('')
    })

    it('should trim whitespace', () => {
      const input = '  hello world  '
      const sanitized = sanitizeString(input)

      expect(sanitized).toBe('hello world')
    })
  })

  describe('sanitizeObject', () => {
    it('should sanitize all string values in an object', () => {
      const obj = {
        name: '<script>alert(1)</script>John',
        message: 'onclick="hack()"Hello'
      }

      const sanitized = sanitizeObject(obj)

      expect(sanitized.name).not.toContain('<script>')
      expect(sanitized.message).not.toContain('onclick')
    })

    it('should recursively sanitize nested objects', () => {
      const obj = {
        user: {
          name: '<script>xss</script>',
          profile: {
            bio: 'onclick="hack()"'
          }
        }
      }

      const sanitized = sanitizeObject(obj)

      expect(sanitized.user.name).not.toContain('<script>')
      expect(sanitized.user.profile.bio).not.toContain('onclick')
    })

    it('should sanitize arrays', () => {
      const obj = {
        tags: ['<script>xss</script>', 'normal', 'onclick="hack()"']
      }

      const sanitized = sanitizeObject(obj)

      expect(sanitized.tags[0]).not.toContain('<script>')
      expect(sanitized.tags[1]).toBe('normal')
      expect(sanitized.tags[2]).not.toContain('onclick')
    })

    it('should preserve non-string values', () => {
      const obj = {
        count: 42,
        active: true,
        data: null,
        items: [1, 2, 3]
      }

      const sanitized = sanitizeObject(obj)

      expect(sanitized.count).toBe(42)
      expect(sanitized.active).toBe(true)
      expect(sanitized.data).toBeNull()
      expect(sanitized.items).toEqual([1, 2, 3])
    })
  })

  describe('sanitizeEmail', () => {
    it('should validate and return valid emails', () => {
      expect(sanitizeEmail('user@example.com')).toBe('user@example.com')
      expect(sanitizeEmail('User@Example.COM')).toBe('user@example.com')
      expect(sanitizeEmail('  test@test.org  ')).toBe('test@test.org')
    })

    it('should return null for invalid emails', () => {
      expect(sanitizeEmail('notanemail')).toBeNull()
      expect(sanitizeEmail('missing@domain')).toBeNull()
      expect(sanitizeEmail('@nodomain.com')).toBeNull()
      expect(sanitizeEmail('spaces in@email.com')).toBeNull()
    })

    it('should handle non-string input', () => {
      // @ts-expect-error Testing non-string input
      expect(sanitizeEmail(null)).toBeNull()
      // @ts-expect-error Testing non-string input
      expect(sanitizeEmail(123)).toBeNull()
    })
  })

  describe('sanitizeSql', () => {
    it('should remove SQL injection patterns', () => {
      const malicious = "'; DROP TABLE users; --"
      const sanitized = sanitizeSql(malicious)

      expect(sanitized).not.toContain("'")
      expect(sanitized).not.toContain(';')
      expect(sanitized).not.toContain('--')
      expect(sanitized).not.toMatch(/DROP/i)
    })

    it('should remove common SQL keywords', () => {
      const keywords = ['SELECT', 'DROP', 'DELETE', 'INSERT', 'UPDATE', 'UNION', 'EXEC']

      for (const keyword of keywords) {
        const input = `test ${keyword} test`
        const sanitized = sanitizeSql(input)
        expect(sanitized).not.toMatch(new RegExp(keyword, 'i'))
      }
    })

    it('should remove SQL comment markers', () => {
      const inputs = [
        'query /* comment */',
        'query -- comment',
        'query; -- drop'
      ]

      for (const input of inputs) {
        const sanitized = sanitizeSql(input)
        expect(sanitized).not.toContain('/*')
        expect(sanitized).not.toContain('*/')
        expect(sanitized).not.toContain('--')
      }
    })

    it('should handle non-string input', () => {
      // @ts-expect-error Testing non-string input
      expect(sanitizeSql(null)).toBe('')
      // @ts-expect-error Testing non-string input
      expect(sanitizeSql(undefined)).toBe('')
    })
  })

  describe('sanitize (main function)', () => {
    it('should sanitize a complete request body', () => {
      const body = {
        name: '<script>xss</script>John',
        email: 'test@example.com',
        query: "'; DROP TABLE --",
        nested: {
          comment: 'onclick="hack()"'
        }
      }

      const sanitized = sanitize(body)

      expect(sanitized.name).not.toContain('<script>')
      expect(sanitized.nested.comment).not.toContain('onclick')
    })
  })
})
