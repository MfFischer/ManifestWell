/**
 * List Skeleton - Loading placeholder for lists
 */

import { Skeleton } from '@/components/ui/skeleton'

interface ListSkeletonProps {
  count?: number
  itemHeight?: string
  spacing?: string
  showIcon?: boolean
  className?: string
}

/**
 * Skeleton loader for lists
 *
 * @param count - Number of skeleton items
 * @param itemHeight - Height of each item
 * @param spacing - Spacing between items
 * @param showIcon - Show icon skeleton
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <ListSkeleton count={5} showIcon />
 * ```
 */
export function ListSkeleton({
  count = 3,
  itemHeight = 'h-16',
  spacing = 'space-y-3',
  showIcon = false,
  className
}: ListSkeletonProps) {
  return (
    <div className={`${spacing} ${className || ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`flex items-center gap-3 ${itemHeight}`}>
          {showIcon && <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
