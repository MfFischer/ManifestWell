/**
 * Meal Card Skeleton - Loading placeholder for meal cards
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Skeleton loader for meal cards
 *
 * @example
 * ```tsx
 * {isLoading && <MealCardSkeleton />}
 * ```
 */
export function MealCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-2/3" /> {/* Meal name */}
          <Skeleton className="h-4 w-1/3" /> {/* Meal type badge */}
        </div>
        <Skeleton className="h-8 w-16" /> {/* Actions */}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" /> {/* Icon */}
          <Skeleton className="h-4 w-24" /> {/* Calories */}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" /> {/* Icon */}
          <Skeleton className="h-4 w-32" /> {/* Time */}
        </div>
        <Skeleton className="h-16 w-full" /> {/* Description/notes */}
      </CardContent>
    </Card>
  )
}
