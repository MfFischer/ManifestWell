/**
 * Component prop types and UI-specific types
 */

import { ReactNode } from 'react'

// Dialog/Modal state management
export interface DialogState {
  isOpen: boolean
  mode: 'create' | 'edit'
  editingId: string | null
}

// Form state management
export interface FormState<T> {
  data: T
  errors: Partial<Record<keyof T, string>>
  isSubmitting: boolean
  isDirty: boolean
}

// Common component props
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

// Table props
export interface TableColumn<T> {
  key: keyof T | string
  header: string
  accessor?: (item: T) => ReactNode
  sortable?: boolean
  width?: string
}

// Pagination props
export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
}

// Filter props
export interface FilterOption<T = string> {
  label: string
  value: T
  icon?: ReactNode
}

// Sort options
export interface SortOption<T> {
  key: keyof T
  label: string
  direction: 'asc' | 'desc'
}

// Chart data types
export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface ChartConfig {
  title?: string
  type: 'line' | 'bar' | 'pie' | 'area'
  data: ChartDataPoint[]
  height?: number
}

// Badge/Status display
export interface BadgeConfig {
  label: string
  color: string
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

// Video player props
export interface VideoPlayerProps {
  videoId: string
  title?: string
  onClose?: () => void
  autoplay?: boolean
}

// Stats display
export interface StatCard {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  color?: string
}
