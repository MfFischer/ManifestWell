/**
 * Food Database API Types
 * Shared types for USDA and Nutritionix integrations
 */

export interface FoodNutrients {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  sodium?: number
}

export interface FoodSearchResult {
  fdcId: string
  description: string
  brandName?: string
  brandOwner?: string
  servingSize: number
  servingUnit: string
  nutrients: FoodNutrients
  source: 'usda' | 'nutritionix' | 'local'
  dataType?: string
}

export interface FoodSearchOptions {
  query: string
  pageSize?: number
  pageNumber?: number
  dataType?: string[]
  brandOwner?: string
}

export interface FoodSearchResponse {
  foods: FoodSearchResult[]
  totalHits: number
  currentPage: number
  totalPages: number
}

// USDA API specific types
export interface USDASearchResponse {
  totalHits: number
  currentPage: number
  totalPages: number
  foods: USDAFood[]
}

export interface USDAFood {
  fdcId: number
  description: string
  dataType: string
  brandOwner?: string
  brandName?: string
  ingredients?: string
  servingSize?: number
  servingSizeUnit?: string
  foodNutrients: USDANutrient[]
}

export interface USDANutrient {
  nutrientId: number
  nutrientName: string
  nutrientNumber: string
  unitName: string
  value: number
}

// Nutritionix API specific types
export interface NutritionixSearchResponse {
  common: NutritionixFood[]
  branded: NutritionixFood[]
}

export interface NutritionixFood {
  food_name: string
  serving_unit: string
  nix_brand_id?: string
  brand_name_item_name?: string
  serving_qty: number
  nf_calories: number
  nf_total_fat: number
  nf_saturated_fat?: number
  nf_cholesterol?: number
  nf_sodium?: number
  nf_total_carbohydrate: number
  nf_dietary_fiber?: number
  nf_sugars?: number
  nf_protein: number
  nix_item_id?: string
  photo?: {
    thumb: string
  }
}

// Common local foods for offline fallback
export interface LocalFood {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: number
  servingUnit: string
  category: string
}
