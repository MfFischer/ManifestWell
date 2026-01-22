/**
 * Tests for data export module
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Prisma
vi.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: vi.fn().mockResolvedValue({
        name: 'Test User',
        bio: 'Test bio',
        createdAt: new Date('2024-01-01')
      })
    },
    meal: { findMany: vi.fn().mockResolvedValue([]) },
    activity: { findMany: vi.fn().mockResolvedValue([]) },
    meditationSession: { findMany: vi.fn().mockResolvedValue([]) },
    manifestationSession: { findMany: vi.fn().mockResolvedValue([]) },
    journalEntry: { findMany: vi.fn().mockResolvedValue([]) },
    goal: { findMany: vi.fn().mockResolvedValue([]) }
  }
}))

// Mock Capacitor Filesystem
vi.mock('@capacitor/filesystem', () => ({
  Filesystem: {
    writeFile: vi.fn().mockRejectedValue(new Error('Not on mobile'))
  },
  Directory: {
    Documents: 'DOCUMENTS'
  },
  Encoding: {
    UTF8: 'utf8'
  }
}))

// Mock local-user
vi.mock('@/lib/auth/local-user', () => ({
  LOCAL_USER_ID: 'local-user'
}))

describe('Data Export', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock URL.createObjectURL and document methods for web download
    global.URL.createObjectURL = vi.fn(() => 'blob:test')
    global.URL.revokeObjectURL = vi.fn()
  })

  it('should export data structure', async () => {
    const { exportAllDataAsJson } = await import('@/lib/data/export')
    
    const result = await exportAllDataAsJson()
    
    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
    expect(result.data?.version).toBe('1.0')
    expect(result.data?.user).toBeDefined()
    expect(result.data?.meals).toEqual([])
    expect(result.data?.activities).toEqual([])
    expect(result.data?.journalEntries).toEqual([])
  })

  it('should include export date', async () => {
    const { exportAllDataAsJson } = await import('@/lib/data/export')
    
    const result = await exportAllDataAsJson()
    
    expect(result.data?.exportDate).toBeDefined()
    expect(new Date(result.data!.exportDate)).toBeInstanceOf(Date)
  })

  it('should generate correct filename', async () => {
    const { exportAllDataAsJson } = await import('@/lib/data/export')
    
    const result = await exportAllDataAsJson()
    
    expect(result.filename).toMatch(/^manifestwell-backup-\d{4}-\d{2}-\d{2}\.json$/)
  })
})

