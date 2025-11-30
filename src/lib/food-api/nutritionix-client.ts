/**
 * Nutritionix API Client
 * Fallback for branded foods and natural language search
 * API Documentation: https://developer.nutritionix.com/docs/v2
 */

import { logger } from '@/lib/utils/logger'
import type {
  FoodSearchResult,
  FoodSearchResponse,
  NutritionixSearchResponse,
  NutritionixFood
} from './types'

const NUTRITIONIX_API_BASE = 'https://trackapi.nutritionix.com/v2'

/**
 * Get Nutritionix credentials from environment
 */
function getCredentials(): { appId: string; apiKey: string } | null {
  const appId = process.env.NUTRITIONIX_APP_ID || process.env.NEXT_PUBLIC_NUTRITIONIX_APP_ID
  const apiKey = process.env.NUTRITIONIX_API_KEY || process.env.NEXT_PUBLIC_NUTRITIONIX_API_KEY

  if (!appId || !apiKey) {
    return null
  }

  return { appId, apiKey }
}

/**
 * Convert Nutritionix food to our standard format
 */
function convertNutritionixFood(food: NutritionixFood, isCommon: boolean): FoodSearchResult {
  return {
    fdcId: food.nix_item_id || `nx-${food.food_name.replace(/\s+/g, '-').toLowerCase()}`,
    description: food.brand_name_item_name || food.food_name,
    brandName: isCommon ? undefined : food.food_name.split(' ')[0],
    servingSize: food.serving_qty || 1,
    servingUnit: food.serving_unit || 'serving',
    nutrients: {
      calories: Math.round(food.nf_calories || 0),
      protein: Math.round((food.nf_protein || 0) * 10) / 10,
      carbs: Math.round((food.nf_total_carbohydrate || 0) * 10) / 10,
      fat: Math.round((food.nf_total_fat || 0) * 10) / 10,
      fiber: food.nf_dietary_fiber ? Math.round(food.nf_dietary_fiber * 10) / 10 : undefined,
      sugar: food.nf_sugars ? Math.round(food.nf_sugars * 10) / 10 : undefined,
      sodium: food.nf_sodium ? Math.round(food.nf_sodium) : undefined,
    },
    source: 'nutritionix',
    dataType: isCommon ? 'common' : 'branded'
  }
}

/**
 * Search Nutritionix for foods (instant search)
 */
export async function searchNutritionixFoods(
  query: string,
  options: { branded?: boolean; common?: boolean } = {}
): Promise<FoodSearchResponse> {
  const credentials = getCredentials()

  if (!credentials) {
    logger.warn('Nutritionix API credentials not configured')
    return {
      foods: [],
      totalHits: 0,
      currentPage: 1,
      totalPages: 0
    }
  }

  const { branded = true, common = true } = options

  try {
    const response = await fetch(
      `${NUTRITIONIX_API_BASE}/search/instant?query=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': credentials.appId,
          'x-app-key': credentials.apiKey,
        }
      }
    )

    if (!response.ok) {
      logger.error('Nutritionix API error:', response.status, response.statusText)
      return {
        foods: [],
        totalHits: 0,
        currentPage: 1,
        totalPages: 0
      }
    }

    const data: NutritionixSearchResponse = await response.json()
    const foods: FoodSearchResult[] = []

    // Add common foods
    if (common && data.common) {
      foods.push(...data.common.slice(0, 10).map(f => convertNutritionixFood(f, true)))
    }

    // Add branded foods
    if (branded && data.branded) {
      foods.push(...data.branded.slice(0, 10).map(f => convertNutritionixFood(f, false)))
    }

    return {
      foods,
      totalHits: foods.length,
      currentPage: 1,
      totalPages: 1
    }
  } catch (error) {
    logger.error('Nutritionix API request failed:', error)
    return {
      foods: [],
      totalHits: 0,
      currentPage: 1,
      totalPages: 0
    }
  }
}

/**
 * Get detailed nutrition info using natural language
 * Example: "1 large apple" or "2 eggs and toast"
 */
export async function getNutritionixNaturalNutrients(
  query: string
): Promise<FoodSearchResult[]> {
  const credentials = getCredentials()

  if (!credentials) {
    logger.warn('Nutritionix API credentials not configured')
    return []
  }

  try {
    const response = await fetch(
      `${NUTRITIONIX_API_BASE}/natural/nutrients`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': credentials.appId,
          'x-app-key': credentials.apiKey,
        },
        body: JSON.stringify({ query })
      }
    )

    if (!response.ok) {
      logger.error('Nutritionix Natural API error:', response.status)
      return []
    }

    const data = await response.json()

    if (!data.foods || !Array.isArray(data.foods)) {
      return []
    }

    return data.foods.map((food: NutritionixFood) => convertNutritionixFood(food, true))
  } catch (error) {
    logger.error('Nutritionix Natural API request failed:', error)
    return []
  }
}
