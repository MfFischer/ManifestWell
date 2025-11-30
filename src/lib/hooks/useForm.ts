/**
 * Generic form state management hook
 * Eliminates form handling duplication across components
 */

import { useState, useCallback } from 'react'
import { logger } from '@/lib/utils/logger'

export interface UseFormOptions<T> {
  initialValues: T
  onSubmit: (values: T) => void | Promise<void>
  validate?: (values: T) => Partial<Record<keyof T, string>>
}

export interface UseFormReturn<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isDirty: boolean
  handleChange: (field: keyof T, value: T[keyof T]) => void
  handleBlur: (field: keyof T) => void
  handleSubmit: (e?: React.FormEvent) => Promise<void>
  resetForm: () => void
  setValues: (values: Partial<T>) => void
  setFieldValue: (field: keyof T, value: T[keyof T]) => void
  setFieldError: (field: keyof T, error: string) => void
}

/**
 * Custom hook for managing form state and validation
 *
 * @param options - Form configuration options
 * @returns Form state and handler functions
 *
 * @example
 * ```typescript
 * const form = useForm({
 *   initialValues: { email: '', password: '' },
 *   onSubmit: async (values) => {
 *     await login(values)
 *   },
 *   validate: (values) => {
 *     const errors: any = {}
 *     if (!values.email) errors.email = 'Email required'
 *     return errors
 *   }
 * })
 *
 * <input
 *   value={form.values.email}
 *   onChange={(e) => form.handleChange('email', e.target.value)}
 *   onBlur={() => form.handleBlur('email')}
 * />
 * ```
 */
export function useForm<T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  validate
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const handleChange = useCallback((field: keyof T, value: T[keyof T]) => {
    setValuesState((prev) => ({ ...prev, [field]: value }))
    setIsDirty(true)

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors])

  const handleBlur = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }))

    // Run validation on blur if validate function provided
    if (validate) {
      const validationErrors = validate(values)
      if (validationErrors[field]) {
        setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }))
      }
    }
  }, [values, validate])

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true
      return acc
    }, {} as Partial<Record<keyof T, boolean>>)
    setTouched(allTouched)

    // Run validation
    const validationErrors = validate ? validate(values) : {}
    setErrors(validationErrors)

    // If no errors, submit
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } catch (error) {
        logger.error('Form submission error:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }, [values, validate, onSubmit])

  const resetForm = useCallback(() => {
    setValuesState(initialValues)
    setErrors({})
    setTouched({})
    setIsDirty(false)
  }, [initialValues])

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState((prev) => ({ ...prev, ...newValues }))
    setIsDirty(true)
  }, [])

  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    handleChange(field, value)
  }, [handleChange])

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }))
  }, [])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setFieldValue,
    setFieldError
  }
}
