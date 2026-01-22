/**
 * XSS Prevention Tests
 */

import { describe, it, expect } from 'vitest'
import { sanitizeString } from '@/middleware/sanitization'

describe('Security - XSS Prevention', () => {
  it('should remove script tags', () => {
    const malicious = '<script>alert("xss")</script>Hello'
    const sanitized = sanitizeString(malicious)

    expect(sanitized).not.toContain('<script>')
    expect(sanitized).not.toContain('alert')
    expect(sanitized).toContain('Hello')
  })

  it('should remove event handlers', () => {
    const malicious = '<div onclick="malicious()">Click</div>'
    const sanitized = sanitizeString(malicious)

    expect(sanitized).not.toContain('onclick')
  })

  it('should remove javascript: protocol', () => {
    const malicious = '<a href="javascript:alert(1)">Link</a>'
    const sanitized = sanitizeString(malicious)

    expect(sanitized).not.toContain('javascript:')
  })

  it('should handle nested attacks', () => {
    const malicious = '<scr<script>ipt>alert("nested")</scr</script>ipt>'
    const sanitized = sanitizeString(malicious)

    expect(sanitized).not.toContain('alert')
  })

  it('should handle encoded attacks', () => {
    const malicious = '<img src=x onerror="alert(1)">'
    const sanitized = sanitizeString(malicious)

    expect(sanitized).not.toContain('onerror')
  })
})
