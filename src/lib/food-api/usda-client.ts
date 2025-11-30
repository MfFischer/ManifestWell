/**
 * USDA FoodData Central API Client
 * Primary food database - free and comprehensive
 * API Documentation: https://fdc.nal.usda.gov/api-guide.html
 */

import { logger } from '@/lib/utils/logger'
import type {
  FoodSearchResult,
  FoodSearchOptions,
  FoodSearchResponse,
  USDASearchResponse,
  USDAFood,
  USDANutrient
} from './types'

const USDA_API_BASE = 'https://api.nal.usda.gov/fdc/v1'

// Nutrient IDs for USDA API
const NUTRIENT_IDS = {
  ENERGY: 1008,        // Calories (kcal)
  PROTEIN: 1003,       // Protein (g)
  FAT: 1004,           // Total fat (g)
  CARBS: 1005,         // Carbohydrates (g)
  FIBER: 1079,         // Fiber (g)
  SUGAR: 2000,         // Total sugars (g)
  SODIUM: 1093,        // Sodium (mg)
}

/**
 * Get the USDA API key from environment or use DEMO_KEY
 */
function getApiKey(): string {
  return process.env.USDA_API_KEY || process.env.NEXT_PUBLIC_USDA_API_KEY || 'DEMO_KEY'
}

/**
 * Extract nutrient value from USDA food nutrients array
 */
function getNutrientValue(nutrients: USDANutrient[], nutrientId: number): number {
  const nutrient = nutrients.find(n => n.nutrientId === nutrientId)
  return nutrient?.value || 0
}

/**
 * Convert USDA food to our standard format
 */
function convertUSDAFood(food: USDAFood): FoodSearchResult {
  const nutrients = food.foodNutrients || []

  return {
    fdcId: String(food.fdcId),
    description: food.description,
    brandName: food.brandName || food.brandOwner,
    brandOwner: food.brandOwner,
    servingSize: food.servingSize || 100,
    servingUnit: food.servingSizeUnit || 'g',
    nutrients: {
      calories: Math.round(getNutrientValue(nutrients, NUTRIENT_IDS.ENERGY)),
      protein: Math.round(getNutrientValue(nutrients, NUTRIENT_IDS.PROTEIN) * 10) / 10,
      carbs: Math.round(getNutrientValue(nutrients, NUTRIENT_IDS.CARBS) * 10) / 10,
      fat: Math.round(getNutrientValue(nutrients, NUTRIENT_IDS.FAT) * 10) / 10,
      fiber: Math.round(getNutrientValue(nutrients, NUTRIENT_IDS.FIBER) * 10) / 10,
      sugar: Math.round(getNutrientValue(nutrients, NUTRIENT_IDS.SUGAR) * 10) / 10,
      sodium: Math.round(getNutrientValue(nutrients, NUTRIENT_IDS.SODIUM)),
    },
    source: 'usda',
    dataType: food.dataType
  }
}

/**
 * Search USDA FoodData Central
 */
export async function searchUSDAFoods(
  query: string,
  options: Partial<FoodSearchOptions> = {}
): Promise<FoodSearchResponse> {
  const apiKey = getApiKey()
  const pageSize = options.pageSize || 25
  const pageNumber = options.pageNumber || 1

  const searchParams = new URLSearchParams({
    api_key: apiKey,
    query: query,
    pageSize: String(pageSize),
    pageNumber: String(pageNumber),
    // Prioritize common foods and branded foods
    dataType: 'Foundation,SR Legacy,Survey (FNDDS),Branded'
  })

  try {
    const response = await fetch(
      `${USDA_API_BASE}/foods/search?${searchParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Cache for 5 minutes
        next: { revalidate: 300 }
      }
    )

    if (!response.ok) {
      logger.error('USDA API error:', response.status, response.statusText)
      return {
        foods: [],
        totalHits: 0,
        currentPage: pageNumber,
        totalPages: 0
      }
    }

    const data: USDASearchResponse = await response.json()

    return {
      foods: data.foods?.map(convertUSDAFood) || [],
      totalHits: data.totalHits || 0,
      currentPage: data.currentPage || pageNumber,
      totalPages: data.totalPages || 0
    }
  } catch (error) {
    logger.error('USDA API request failed:', error)
    return {
      foods: [],
      totalHits: 0,
      currentPage: pageNumber,
      totalPages: 0
    }
  }
}

/**
 * Get detailed food information by FDC ID
 */
export async function getUSDAFoodDetails(fdcId: string): Promise<FoodSearchResult | null> {
  const apiKey = getApiKey()

  try {
    const response = await fetch(
      `${USDA_API_BASE}/food/${fdcId}?api_key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    )

    if (!response.ok) {
      logger.error('USDA API error:', response.status)
      return null
    }

    const food: USDAFood = await response.json()
    return convertUSDAFood(food)
  } catch (error) {
    logger.error('USDA API request failed:', error)
    return null
  }
}
