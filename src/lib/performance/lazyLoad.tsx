/**
 * Lazy Loading Utilities
 * Helper functions for dynamic imports and code splitting
 */

import { lazy, ComponentType, Suspense, type ReactNode } from 'react'
import { logger } from '@/lib/utils/logger'

/**
 * Lazy load a component with automatic retry on failure
 *
 * @param importFn - Dynamic import function
 * @param retries - Number of retry attempts
 * @param interval - Delay between retries (ms)
 * @returns Lazy-loaded component
 *
 * @example
 * ```tsx
 * const HeavyComponent = lazyWithRetry(() => import('./HeavyComponent'))
 * ```
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3,
  interval = 1000
): React.LazyExoticComponent<T> {
  return lazy(() =>
    new Promise<{ default: T }>((resolve, reject) => {
      const attemptImport = (attemptsLeft: number) => {
        importFn()
          .then(resolve)
          .catch((error) => {
            if (attemptsLeft === 1) {
              reject(error)
              return
            }

            setTimeout(() => {
              logger.log(`Retrying import... (${attemptsLeft - 1} attempts left)`)
              attemptImport(attemptsLeft - 1)
            }, interval)
          })
      }

      attemptImport(retries)
    })
  )
}

interface LazyComponentProps {
  /** Component to lazy load */
  component: React.LazyExoticComponent<ComponentType<any>>
  /** Fallback UI while loading */
  fallback?: ReactNode
  /** Props to pass to the component */
  [key: string]: any
}

/**
 * Wrapper component for lazy-loaded components with Suspense
 *
 * @example
 * ```tsx
 * <LazyComponent
 *   component={LazyModuleComponent}
 *   fallback={<Skeleton />}
 *   someProp="value"
 * />
 * ```
 */
export function LazyComponent({ component: Component, fallback, ...props }: LazyComponentProps) {
  return (
    <Suspense fallback={fallback || <div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  )
}

/**
 * Preload a lazy component
 * Useful for prefetching on hover or route change
 *
 * @param importFn - Dynamic import function
 *
 * @example
 * ```tsx
 * const HeavyComponent = lazy(() => import('./HeavyComponent'))
 *
 * <button
 *   onMouseEnter={() => preloadComponent(() => import('./HeavyComponent'))}
 *   onClick={() => setShowComponent(true)}
 * >
 *   Show Component
 * </button>
 * ```
 */
export function preloadComponent(importFn: () => Promise<any>): void {
  importFn().catch((error) => {
    logger.error('Failed to preload component:', error)
  })
}

/**
 * Lazy load a module based on condition
 *
 * @param condition - Condition to check
 * @param importFn - Dynamic import function
 * @returns Promise resolving to module or null
 *
 * @example
 * ```tsx
 * const module = await conditionalImport(
 *   platform.isMobile,
 *   () => import('./MobileFeature')
 * )
 * ```
 */
export async function conditionalImport<T>(
  condition: boolean,
  importFn: () => Promise<T>
): Promise<T | null> {
  if (!condition) {
    return null
  }

  try {
    return await importFn()
  } catch (error) {
    logger.error('Conditional import failed:', error)
    return null
  }
}

/**
 * Create a lazy-loaded route component
 *
 * @param importFn - Dynamic import function
 * @param fallback - Loading fallback
 * @returns Lazy route component with Suspense
 *
 * @example
 * ```tsx
 * const DashboardRoute = lazyRoute(
 *   () => import('@/app/dashboard/page'),
 *   <DashboardSkeleton />
 * )
 * ```
 */
export function lazyRoute<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ReactNode
) {
  const LazyComponent = lazyWithRetry(importFn)

  return function LazyRoute(props: any) {
    return (
      <Suspense fallback={fallback || <div>Loading page...</div>}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}
