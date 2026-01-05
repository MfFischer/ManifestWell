/**
 * Mobile bottom tab navigation
 * Optimized for touch interfaces with large hit targets
 */

'use client'

import { Utensils, Activity, Brain, Sparkles, BookOpen, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MobileTabBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
}

interface TabItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const tabs: TabItem[] = [
  {
    id: 'nutrition',
    label: 'Nutrition',
    icon: Utensils,
    color: 'text-orange-600'
  },
  {
    id: 'fitness',
    label: 'Fitness',
    icon: Activity,
    color: 'text-blue-600'
  },
  {
    id: 'meditation',
    label: 'Meditate',
    icon: Brain,
    color: 'text-purple-600'
  },
  {
    id: 'manifestation',
    label: 'Manifest',
    icon: Sparkles,
    color: 'text-pink-600'
  },
  {
    id: 'journal',
    label: 'Journal',
    icon: BookOpen,
    color: 'text-green-600'
  },
  {
    id: 'goals',
    label: 'Goals',
    icon: Target,
    color: 'text-red-600'
  }
]

/**
 * Mobile-optimized bottom tab navigation
 * Features:
 * - Large touch targets (min 44x44px)
 * - Visual feedback on active state
 * - Smooth transitions
 * - Haptic feedback ready
 * - Accessibility support
 *
 * @example
 * ```tsx
 * <MobileTabBar
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 * />
 * ```
 */
export function MobileTabBar({ activeTab, onTabChange, className }: MobileTabBarProps) {
  const handleTabClick = (tabId: string) => {
    // Trigger haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }
    onTabChange(tabId)
  }

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white dark:bg-gray-900',
        'border-t border-gray-200 dark:border-gray-800',
        'safe-area-inset-bottom',
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center',
                'min-w-[60px] min-h-[56px]', // Large touch target
                'px-3 py-2 rounded-lg',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-purple-500',
                'active:scale-95', // Touch feedback
                isActive
                  ? 'bg-purple-50 dark:bg-purple-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              )}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  'w-6 h-6 mb-1 transition-colors duration-200',
                  isActive
                    ? tab.color
                    : 'text-gray-500 dark:text-gray-400'
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium transition-colors duration-200',
                  isActive
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                )}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/**
 * Spacer component to prevent content from being hidden behind the tab bar
 * Use at the bottom of your scrollable content
 *
 * @example
 * ```tsx
 * <ScrollArea>
 *   <YourContent />
 *   <MobileTabBarSpacer />
 * </ScrollArea>
 * ```
 */
export function MobileTabBarSpacer() {
  return <div className="h-20" aria-hidden="true" />
}
