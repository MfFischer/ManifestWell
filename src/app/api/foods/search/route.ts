/**
 * Food Search API Route
 * Searches USDA, Nutritionix, and local food database
 */

import { NextResponse } from 'next/server'
import { searchFoods, getSuggestedFoods } from '@/lib/food-api'
import { logger } from '@/lib/utils/logger'

// Required for static export
export const dynamic = "force-static";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || searchParams.get('query')
    const limit = parseInt(searchParams.get('limit') || '20')
    const localOnly = searchParams.get('localOnly') === 'true'

    // If no query, return suggested foods
    if (!query || query.trim().length < 2) {
      const suggestions = getSuggestedFoods(limit)
      return NextResponse.json({
        foods: suggestions,
        totalHits: suggestions.length,
        currentPage: 1,
        totalPages: 1,
        source: 'suggestions'
      })
    }

    // Search foods
    const results = await searchFoods(query, {
      pageSize: limit,
      includeLocal: true,
      includeBranded: !localOnly,
      localOnly
    })

    return NextResponse.json(results)
  } catch (error) {
    logger.error('Food search API error:', error)
    return NextResponse.json(
      { error: 'Failed to search foods' },
      { status: 500 }
    )
  }
}
