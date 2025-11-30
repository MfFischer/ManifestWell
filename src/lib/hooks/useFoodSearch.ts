/**
 * Food Search Hook
 * React Query hook with debouncing for food search
 */

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import type { FoodSearchResponse, FoodSearchResult } from '@/lib/food-api/types'

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

interface UseFoodSearchOptions {
  debounceMs?: number
  limit?: number
  localOnly?: boolean
  enabled?: boolean
}

interface UseFoodSearchResult {
  data: FoodSearchResult[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook for searching foods with debounce
 */
export function useFoodSearch(
  query: string,
  options: UseFoodSearchOptions = {}
): UseFoodSearchResult {
  const {
    debounceMs = 300,
    limit = 20,
    localOnly = false,
    enabled = true
  } = options

  const debouncedQuery = useDebounce(query, debounceMs)

  const { data, isLoading, isError, error, refetch } = useQuery<FoodSearchResponse>({
    queryKey: ['food-search', debouncedQuery, limit, localOnly],
    queryFn: async () => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(limit),
        localOnly: String(localOnly)
      })

      const response = await fetch(`/api/foods/search?${params}`)

      if (!response.ok) {
        throw new Error('Failed to search foods')
      }

      return response.json()
    },
    enabled: enabled && debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  })

  return {
    data: data?.foods || [],
    isLoading: isLoading && debouncedQuery.length >= 2,
    isError,
    error: error as Error | null,
    refetch
  }
}

/**
 * Hook for getting suggested foods
 */
export function useSuggestedFoods(limit: number = 10) {
  return useQuery<FoodSearchResponse>({
    queryKey: ['food-suggestions', limit],
    queryFn: async () => {
      const response = await fetch(`/api/foods/search?limit=${limit}`)

      if (!response.ok) {
        throw new Error('Failed to get suggestions')
      }

      return response.json()
    },
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
  })
}
