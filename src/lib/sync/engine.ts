/**
 * Local Data Manager for Offline-First Mobile App
 *
 * This is a simplified version for local-only storage.
 * All data is persisted to SQLite via Prisma - no remote sync needed.
 *
 * This module provides:
 * - Change tracking for undo/redo functionality
 * - Data export/import for backup
 * - Future: Optional cloud sync when user opts in
 */

import { LOCAL_USER_ID } from '@/lib/auth/local-user'
import { logger } from '@/lib/utils/logger'

export interface DataChange {
  id: string
  table: string
  operation: 'create' | 'update' | 'delete'
  data: Record<string, unknown>
  previousData?: Record<string, unknown>
  timestamp: number
}

export interface DataManagerResult {
  success: boolean
  message: string
  data?: unknown
}

/**
 * Local data manager for offline-first app
 *
 * Tracks changes for potential undo functionality and data export.
 * All data is stored locally - no cloud sync by default.
 *
 * @example
 * ```typescript
 * const manager = new LocalDataManager()
 *
 * // Track a change (for undo/export)
 * manager.trackChange('meal', 'create', mealData)
 *
 * // Export all data
 * const backup = await manager.exportAllData()
 * ```
 */
export class LocalDataManager {
  private changeHistory: DataChange[] = []
  private maxHistorySize = 100

  constructor() {
    this.loadHistory()
  }

  /**
   * Get the local user ID
   */
  getUserId(): string {
    return LOCAL_USER_ID
  }

  /**
   * Load change history from localStorage
   */
  private loadHistory(): void {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem('data-change-history')
    if (stored) {
      try {
        this.changeHistory = JSON.parse(stored)
      } catch {
        this.changeHistory = []
      }
    }
  }

  /**
   * Save change history to localStorage
   */
  private saveHistory(): void {
    if (typeof window === 'undefined') return

    try {
      // Keep only recent changes
      if (this.changeHistory.length > this.maxHistorySize) {
        this.changeHistory = this.changeHistory.slice(-this.maxHistorySize)
      }
      localStorage.setItem('data-change-history', JSON.stringify(this.changeHistory))
    } catch (error) {
      logger.error('Failed to save change history:', error)
    }
  }

  /**
   * Track a data change (for undo/export functionality)
   *
   * @param table - Table name (meal, activity, etc.)
   * @param operation - Type of operation
   * @param data - Current data
   * @param previousData - Previous data (for updates)
   */
  trackChange(
    table: string,
    operation: 'create' | 'update' | 'delete',
    data: Record<string, unknown>,
    previousData?: Record<string, unknown>
  ): void {
    const change: DataChange = {
      id: `${table}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      table,
      operation,
      data,
      previousData,
      timestamp: Date.now()
    }

    this.changeHistory.push(change)
    this.saveHistory()
  }

  /**
   * Get recent changes (for undo functionality)
   *
   * @param count - Number of recent changes to return
   * @returns Array of recent changes
   */
  getRecentChanges(count: number = 10): DataChange[] {
    return this.changeHistory.slice(-count).reverse()
  }

  /**
   * Clear change history
   */
  clearHistory(): void {
    this.changeHistory = []
    this.saveHistory()
  }

  /**
   * Get change history count
   */
  getHistoryCount(): number {
    return this.changeHistory.length
  }
}

// Legacy exports for backward compatibility
export type SyncOperation = DataChange
export interface SyncResult {
  success: boolean
  syncedCount: number
  failedCount: number
  errors: Array<{ operation: DataChange; error: string }>
}

// Legacy SyncEngine class - now just wraps LocalDataManager
export class SyncEngine extends LocalDataManager {
  constructor(_userId?: string, _apiEndpoint?: string) {
    super()
    // userId and apiEndpoint are ignored - local only
  }

  // Legacy method - now just tracks locally
  async trackChange(
    table: string,
    operation: 'create' | 'update' | 'delete',
    data: Record<string, unknown>
  ): Promise<void> {
    super.trackChange(table, operation, data)
  }

  // Legacy method - no-op for local-only
  async syncToRemote(): Promise<SyncResult> {
    return {
      success: true,
      syncedCount: 0,
      failedCount: 0,
      errors: []
    }
  }

  // Legacy method - no-op for local-only
  async syncFromRemote(_table: string): Promise<SyncResult> {
    return {
      success: true,
      syncedCount: 0,
      failedCount: 0,
      errors: []
    }
  }

  // Legacy method
  getPendingCount(): number {
    return 0 // No pending sync for local-only
  }

  // Legacy method
  clearQueue(): void {
    this.clearHistory()
  }

  // Legacy method - no-op for local-only
  registerNetworkListeners(): void {
    // No network listeners needed for local-only app
  }

  // Legacy method
  resolveConflict(
    local: Record<string, unknown> & { updatedAt: Date },
    _remote: Record<string, unknown> & { updatedAt: Date }
  ): Record<string, unknown> {
    // Local always wins in local-only app
    return local
  }
}
