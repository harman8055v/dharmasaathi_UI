"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface FormFieldProps {
  label: string
  id: string
  type?: string
  placeholder?: string
  value: string
  error?: string | null
  touched?: boolean
  isValid?: boolean
  icon?: React.ReactNode
  disabled?: boolean
  onChange: (value: string) => void
  onBlur: () => void
  className?: string
}

export default function FormField({
  label,
  id,
  type = "text",
  placeholder,
  value,
  error,
  touched,
  isValid,
  icon,
  disabled,
  onChange,
  onBlur,
  className,
}: FormFieldProps) {
  const hasError = touched && error
  const hasSuccess = touched && isValid && !error

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-3 h-4 w-4 text-muted-foreground">{icon}</div>}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          className={cn(
            "h-11 text-sm transition-all duration-300",
            icon && "pl-10",
            hasError && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            hasSuccess && "border-green-500 focus:border-green-500 focus:ring-green-500/20",
            !hasError && !hasSuccess && "border-muted-foreground/20 focus:border-primary",
            "focus:scale-[1.02]",
          )}
        />
        {hasError && (
          <div className="absolute right-3 top-3">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
        {hasSuccess && (
          <div className="absolute right-3 top-3">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>
      {hasError && (
        <p className="text-xs text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      {hasSuccess && (
        <p className="text-xs text-green-600 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
          <CheckCircle2 className="h-3 w-3" />
          Looks good!
        </p>
      )}
    </div>
  )
}
