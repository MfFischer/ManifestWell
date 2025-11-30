/**
 * Generic entity CRUD operations hook
 * Provides standardized data fetching and mutation for all entity types
 */

import { useState, useEffect, useCallback } from 'react'
import { logger } from '@/lib/utils/logger'

export interface UseEntityOptions<T> {
  endpoint: string
  initialData?: T[]
  autoFetch?: boolean
}

export interface UseEntityReturn<T> {
  data: T[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => Promise<T>
  update: (id: string, item: Partial<T>) => Promise<T>
  remove: (id: string) => Promise<void>
}

/**
 * Custom hook for entity CRUD operations
 *
 * @param options - Entity configuration
 * @returns Entity data and CRUD operations
 *
 * @example
 * ```typescript
 * const meals = useEntity<Meal>({
 *   endpoint: '/api/meals',
 *   autoFetch: true
 * })
 *
 * // Create
 * await meals.create({ name: 'Breakfast', type: 'breakfast', calories: 400 })
 *
 * // Update
 * await meals.update('meal-id', { calories: 450 })
 *
 * // Delete
 * await meals.remove('meal-id')
 *
 * // Refetch
 * await meals.refetch()
 * ```
 */
export function useEntity<T extends { id: string }>({
  endpoint,
  initialData = [],
  autoFetch = true
}: UseEntityOptions<T>): UseEntityReturn<T> {
  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }

      const result = await response.json()
      setData(Array.isArray(result) ? result : [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch data'
      setError(message)
      logger.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  const create = useCallback(async (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create')
      }

      const created = await response.json()
      setData((prev) => [created, ...prev])
      return created
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create'
      setError(message)
      throw err
    }
  }, [endpoint])

  const update = useCallback(async (id: string, item: Partial<T>): Promise<T> => {
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update')
      }

      const updated = await response.json()
      setData((prev) => prev.map((d) => (d.id === id ? updated : d)))
      return updated
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update'
      setError(message)
      throw err
    }
  }, [endpoint])

  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete')
      }

      setData((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete'
      setError(message)
      throw err
    }
  }, [endpoint])

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      refetch()
    }
  }, [autoFetch, refetch])

  return {
    data,
    loading,
    error,
    refetch,
    create,
    update,
    remove
  }
}
