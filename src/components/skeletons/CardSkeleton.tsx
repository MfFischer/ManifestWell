/**
 * Generic Card Skeleton for loading states
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface CardSkeletonProps {
  showHeader?: boolean
  linesCount?: number
  className?: string
}

/**
 * Generic card skeleton component
 *
 * @param showHeader - Show header skeleton
 * @param linesCount - Number of content lines to show
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <CardSkeleton showHeader linesCount={3} />
 * ```
 */
export function CardSkeleton({ showHeader = true, linesCount = 3, className }: CardSkeletonProps) {
  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: linesCount }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}
