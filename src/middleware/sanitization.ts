/**
 * Input sanitization utilities
 * Prevents XSS and other injection attacks
 */

/**
 * Escapes HTML special characters to prevent XSS
 *
 * @param str - String to escape
 * @returns Escaped string
 *
 * @example
 * ```typescript
 * const safe = escapeHtml('<script>alert("xss")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
 */
export function escapeHtml(str: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  }

  return str.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char)
}

/**
 * Sanitizes a string by removing potentially dangerous content
 *
 * @param str - String to sanitize
 * @returns Sanitized string
 *
 * @example
 * ```typescript
 * const safe = sanitizeString('<script>alert("xss")</script>')
 * ```
 */
export function sanitizeString(str: string): string {
  if (typeof str !== 'string') {
    return ''
  }

  // Remove any script tags and their content
  let sanitized = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '')

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '')

  return sanitized.trim()
}

/**
 * Sanitizes an object recursively
 *
 * @param obj - Object to sanitize
 * @returns Sanitized object
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeObject({
 *   name: '<script>alert("xss")</script>',
 *   nested: {
 *     value: 'onclick="alert(1)"'
 *   }
 * })
 * ```
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string'
          ? sanitizeString(item)
          : typeof item === 'object' && item !== null
          ? sanitizeObject(item as Record<string, unknown>)
          : item
      )
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized as T
}

/**
 * Validates and sanitizes an email address
 *
 * @param email - Email to validate and sanitize
 * @returns Sanitized email or null if invalid
 *
 * @example
 * ```typescript
 * const email = sanitizeEmail('user@example.com')
 * ```
 */
export function sanitizeEmail(email: string): string | null {
  if (typeof email !== 'string') {
    return null
  }

  const sanitized = email.toLowerCase().trim()

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(sanitized)) {
    return null
  }

  return sanitized
}

/**
 * Removes SQL injection attempts from strings
 *
 * @param str - String to sanitize
 * @returns Sanitized string
 *
 * @example
 * ```typescript
 * const safe = sanitizeSql("'; DROP TABLE users; --")
 * ```
 */
export function sanitizeSql(str: string): string {
  if (typeof str !== 'string') {
    return ''
  }

  // Remove common SQL injection patterns
  let sanitized = str.replace(/['";]/g, '')
  sanitized = sanitized.replace(/--/g, '')
  sanitized = sanitized.replace(/\/\*/g, '')
  sanitized = sanitized.replace(/\*\//g, '')

  // Remove SQL keywords (case-insensitive)
  const sqlKeywords = [
    'DROP',
    'DELETE',
    'INSERT',
    'UPDATE',
    'UNION',
    'SELECT',
    'FROM',
    'WHERE',
    'EXEC',
    'EXECUTE'
  ]

  for (const keyword of sqlKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
    sanitized = sanitized.replace(regex, '')
  }

  return sanitized.trim()
}

/**
 * Sanitizes all inputs in a request body
 *
 * @param body - Request body to sanitize
 * @returns Sanitized body
 *
 * @example
 * ```typescript
 * const body = await request.json()
 * const safe = sanitize(body)
 * ```
 */
export function sanitize<T extends Record<string, unknown>>(body: T): T {
  return sanitizeObject(body)
}
