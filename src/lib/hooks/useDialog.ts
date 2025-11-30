/**
 * Dialog/Modal state management hook
 * Standardizes dialog handling across the application
 */

import { useState, useCallback } from 'react'

export interface UseDialogOptions<T> {
  onOpen?: () => void
  onClose?: () => void
  onConfirm?: (data?: T) => void | Promise<void>
}

export interface UseDialogReturn<T> {
  isOpen: boolean
  mode: 'create' | 'edit'
  editingItem: T | null
  open: () => void
  openCreate: () => void
  openEdit: (item: T) => void
  close: () => void
  toggle: () => void
  setMode: (mode: 'create' | 'edit') => void
  setEditingItem: (item: T | null) => void
}

/**
 * Custom hook for managing dialog/modal state
 *
 * @param options - Dialog configuration options
 * @returns Dialog state and control functions
 *
 * @example
 * ```typescript
 * const dialog = useDialog<Meal>({
 *   onClose: () => {
 *     resetForm()
 *   }
 * })
 *
 * // Open for creating
 * <Button onClick={dialog.openCreate}>Add Meal</Button>
 *
 * // Open for editing
 * <Button onClick={() => dialog.openEdit(meal)}>Edit</Button>
 *
 * // In Dialog component
 * <Dialog open={dialog.isOpen} onOpenChange={dialog.close}>
 *   {dialog.mode === 'create' ? 'Add Meal' : 'Edit Meal'}
 * </Dialog>
 * ```
 */
export function useDialog<T = unknown>(options: UseDialogOptions<T> = {}): UseDialogReturn<T> {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editingItem, setEditingItem] = useState<T | null>(null)

  const open = useCallback(() => {
    setIsOpen(true)
    options.onOpen?.()
  }, [options])

  const openCreate = useCallback(() => {
    setMode('create')
    setEditingItem(null)
    open()
  }, [open])

  const openEdit = useCallback((item: T) => {
    setMode('edit')
    setEditingItem(item)
    open()
  }, [open])

  const close = useCallback(() => {
    setIsOpen(false)
    options.onClose?.()
    // Reset state after animation completes
    setTimeout(() => {
      setMode('create')
      setEditingItem(null)
    }, 200)
  }, [options])

  const toggle = useCallback(() => {
    if (isOpen) {
      close()
    } else {
      open()
    }
  }, [isOpen, open, close])

  return {
    isOpen,
    mode,
    editingItem,
    open,
    openCreate,
    openEdit,
    close,
    toggle,
    setMode,
    setEditingItem
  }
}
