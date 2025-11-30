/**
 * Unified Food Search API
 * Searches multiple sources with fallback:
 * 1. Local cache (instant)
 * 2. USDA FoodData Central (primary, free)
 * 3. Nutritionix (fallback for branded foods)
 */

import { logger } from '@/lib/utils/logger'
import { searchUSDAFoods, getUSDAFoodDetails } from './usda-client'
import { searchNutritionixFoods } from './nutritionix-client'
import { searchLocalFoods, localFoods, getLocalFood } from './local-foods'
import type { FoodSearchResult, FoodSearchResponse } from './types'

export * from './types'
export { localFoods, getLocalFood } from './local-foods'

interface SearchOptions {
  pageSize?: number
  includeLocal?: boolean
  includeBranded?: boolean
  localOnly?: boolean
}

/**
 * Search for foods across all sources
 * Returns combined results from local, USDA, and Nutritionix
 */
export async function searchFoods(
  query: string,
  options: SearchOptions = {}
): Promise<FoodSearchResponse> {
  const {
    pageSize = 20,
    includeLocal = true,
    includeBranded = true,
    localOnly = false
  } = options

  // Normalize query
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery || normalizedQuery.length < 2) {
    return {
      foods: [],
      totalHits: 0,
      currentPage: 1,
      totalPages: 0
    }
  }

  // Start with local results (instant)
  let results: FoodSearchResult[] = []

  if (includeLocal) {
    const localResults = searchLocalFoods(normalizedQuery)
    results = [...localResults.slice(0, 5)] // Limit local to 5
  }

  // If local only mode, return local results
  if (localOnly) {
    return {
      foods: results,
      totalHits: results.length,
      currentPage: 1,
      totalPages: 1
    }
  }

  try {
    // Search USDA (primary source)
    const usdaResponse = await searchUSDAFoods(normalizedQuery, { pageSize: pageSize - results.length })

    if (usdaResponse.foods.length > 0) {
      // Deduplicate: don't add USDA results that match local food names
      const localNames = new Set(results.map(r => r.description.toLowerCase()))
      const uniqueUSDAFoods = usdaResponse.foods.filter(
        food => !localNames.has(food.description.toLowerCase())
      )
      results = [...results, ...uniqueUSDAFoods]
    }

    // If we still need more results and branded foods are enabled, try Nutritionix
    if (results.length < pageSize && includeBranded) {
      const nutritionixResponse = await searchNutritionixFoods(normalizedQuery, {
        branded: true,
        common: false
      })

      if (nutritionixResponse.foods.length > 0) {
        // Add Nutritionix results that aren't duplicates
        const existingIds = new Set(results.map(r => r.fdcId))
        const existingNames = new Set(results.map(r => r.description.toLowerCase()))
        const uniqueNutritionixFoods = nutritionixResponse.foods.filter(
          food => !existingIds.has(food.fdcId) && !existingNames.has(food.description.toLowerCase())
        )
        results = [...results, ...uniqueNutritionixFoods.slice(0, pageSize - results.length)]
      }
    }
  } catch (error) {
    logger.error('Food search error:', error)
    // Return local results on error
  }

  // Limit to pageSize
  const limitedResults = results.slice(0, pageSize)

  return {
    foods: limitedResults,
    totalHits: limitedResults.length,
    currentPage: 1,
    totalPages: 1
  }
}

/**
 * Get detailed food information by FDC ID
 */
export async function getFoodDetails(fdcId: string): Promise<FoodSearchResult | null> {
  // Check local first
  const localFood = getLocalFood(fdcId)
  if (localFood) {
    return localFood
  }

  // Check if it's a Nutritionix ID
  if (fdcId.startsWith('nx-')) {
    return null // Nutritionix doesn't have a detail endpoint for instant search results
  }

  // Fetch from USDA
  return getUSDAFoodDetails(fdcId)
}

/**
 * Get suggested foods (popular local foods)
 */
export function getSuggestedFoods(limit: number = 10): FoodSearchResult[] {
  return localFoods.slice(0, limit)
}

/**
 * Get foods by category
 */
export function getFoodsByCategory(category: string): FoodSearchResult[] {
  const categoryMap: Record<string, string[]> = {
    protein: ['Egg', 'Chicken', 'Salmon', 'Beef', 'Tuna', 'Turkey', 'Shrimp', 'Tofu'],
    carbs: ['Rice', 'Oatmeal', 'Bread', 'Pasta', 'Quinoa', 'Potato'],
    fruits: ['Apple', 'Banana', 'Orange', 'Strawberries', 'Blueberries', 'Grapes', 'Watermelon', 'Mango'],
    vegetables: ['Broccoli', 'Spinach', 'Carrot', 'Tomato', 'Cucumber', 'Bell Pepper', 'Avocado'],
    dairy: ['Milk', 'Yogurt', 'Cheese', 'Cottage Cheese'],
    nuts: ['Almonds', 'Peanut Butter', 'Walnuts', 'Chia Seeds']
  }

  const keywords = categoryMap[category.toLowerCase()] || []
  if (keywords.length === 0) {
    return []
  }

  return localFoods.filter(food =>
    keywords.some(keyword => food.description.toLowerCase().includes(keyword.toLowerCase()))
  )
}
