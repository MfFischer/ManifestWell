/**
 * Activity Card Skeleton - Loading placeholder for activity cards
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Skeleton loader for activity/fitness cards
 *
 * @example
 * ```tsx
 * {isLoading && <ActivityCardSkeleton />}
 * ```
 */
export function ActivityCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-2/3" /> {/* Activity name */}
          <Skeleton className="h-4 w-1/4" /> {/* Activity type badge */}
        </div>
        <Skeleton className="h-8 w-16" /> {/* Actions */}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" /> {/* Duration label */}
            <Skeleton className="h-5 w-20" /> {/* Duration value */}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" /> {/* Calories label */}
            <Skeleton className="h-5 w-20" /> {/* Calories value */}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" /> {/* Icon */}
          <Skeleton className="h-4 w-32" /> {/* Intensity */}
        </div>
        <Skeleton className="h-12 w-full" /> {/* Notes */}
      </CardContent>
    </Card>
  )
}
