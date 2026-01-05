/**
 * Dashboard Skeleton - Loading placeholder for dashboard page
 */

import { Skeleton } from '@/components/ui/skeleton'
import { CardSkeleton } from './CardSkeleton'

/**
 * Skeleton loader for the main dashboard
 *
 * @example
 * ```tsx
 * {isLoading ? <DashboardSkeleton /> : <Dashboard />}
 * ```
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" /> {/* Page title */}
        <Skeleton className="h-4 w-96" /> {/* Subtitle */}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Main Content Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <CardSkeleton linesCount={4} />
        <CardSkeleton linesCount={4} />
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        <CardSkeleton showHeader={false} linesCount={5} />
      </div>
    </div>
  )
}
