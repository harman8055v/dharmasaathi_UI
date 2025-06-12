"use client"

import { useState, useCallback } from "react"

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

export interface FormField {
  value: string
  error: string | null
  touched: boolean
  isValid: boolean
}

export interface FormState {
  [key: string]: FormField
}

export function useFormValidation(initialState: Record<string, string>, rules: Record<string, ValidationRule>) {
  const [formState, setFormState] = useState<FormState>(() => {
    const state: FormState = {}
    Object.keys(initialState).forEach((key) => {
      state[key] = {
        value: initialState[key],
        error: null,
        touched: false,
        isValid: false,
      }
    })
    return state
  })

  const validateField = useCallback(
    (fieldName: string, value: string): string | null => {
      const rule = rules[fieldName]
      if (!rule) return null

      // Required validation
      if (rule.required && (!value || value.trim() === "")) {
        return "This field is required"
      }

      // Skip other validations if field is empty and not required
      if (!value && !rule.required) return null

      // Min length validation
      if (rule.minLength && value.length < rule.minLength) {
        return `Must be at least ${rule.minLength} characters`
      }

      // Max length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        return `Must be no more than ${rule.maxLength} characters`
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        if (fieldName === "email") return "Please enter a valid email address"
        if (fieldName === "mobile") return "Please enter a valid mobile number"
        if (fieldName === "password")
          return "Password must contain at least 8 characters, one uppercase, one lowercase, and one number"
        return "Invalid format"
      }

      // Custom validation
      if (rule.custom) {
        return rule.custom(value)
      }

      return null
    },
    [rules],
  )

  const updateField = useCallback(
    (fieldName: string, value: string, shouldValidate = true) => {
      setFormState((prev) => {
        const error = shouldValidate ? validateField(fieldName, value) : null
        return {
          ...prev,
          [fieldName]: {
            value,
            error,
            touched: prev[fieldName].touched,
            isValid: error === null && value !== "",
          },
        }
      })
    },
    [validateField],
  )

  const touchField = useCallback(
    (fieldName: string) => {
      setFormState((prev) => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          touched: true,
          error: validateField(fieldName, prev[fieldName].value),
        },
      }))
    },
    [validateField],
  )

  const validateForm = useCallback(() => {
    let isFormValid = true
    const newState = { ...formState }

    Object.keys(formState).forEach((fieldName) => {
      const error = validateField(fieldName, formState[fieldName].value)
      newState[fieldName] = {
        ...formState[fieldName],
        error,
        touched: true,
        isValid: error === null && formState[fieldName].value !== "",
      }
      if (error) isFormValid = false
    })

    setFormState(newState)
    return isFormValid
  }, [formState, validateField])

  const resetForm = useCallback(() => {
    const resetState: FormState = {}
    Object.keys(formState).forEach((key) => {
      resetState[key] = {
        value: "",
        error: null,
        touched: false,
        isValid: false,
      }
    })
    setFormState(resetState)
  }, [formState])

  const isFormValid = Object.values(formState).every((field) => field.isValid && !field.error)

  return {
    formState,
    updateField,
    touchField,
    validateForm,
    resetForm,
    isFormValid,
  }
}
