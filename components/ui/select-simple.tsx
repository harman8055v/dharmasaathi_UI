"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  children: React.ReactNode
}

interface SelectTriggerProps {
  className?: string
  children: React.ReactNode
}

interface SelectContentProps {
  children: React.ReactNode
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

interface SelectValueProps {
  placeholder?: string
}

const SelectContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  disabled: boolean
}>({
  value: "",
  onValueChange: () => {},
  isOpen: false,
  setIsOpen: () => {},
  disabled: false,
})

export function Select({ value = "", onValueChange = () => {}, disabled = false, children }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(value)

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue)
    onValueChange(newValue)
    setIsOpen(false)
  }

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  return (
    <SelectContext.Provider
      value={{
        value: internalValue,
        onValueChange: handleValueChange,
        isOpen,
        setIsOpen,
        disabled,
      }}
    >
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ className, children }: SelectTriggerProps) {
  const { isOpen, setIsOpen, disabled } = React.useContext(SelectContext)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, setIsOpen])

  return (
    <button
      ref={triggerRef}
      className={cn(
        "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      onClick={() => !disabled && setIsOpen(!isOpen)}
      disabled={disabled}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

export function SelectContent({ children }: SelectContentProps) {
  const { isOpen } = React.useContext(SelectContext)

  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md">
      <div className="p-1">{children}</div>
    </div>
  )
}

export function SelectItem({ value, children }: SelectItemProps) {
  const { onValueChange } = React.useContext(SelectContext)

  return (
    <button
      className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  )
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const { value } = React.useContext(SelectContext)

  return <span>{value || placeholder}</span>
}
