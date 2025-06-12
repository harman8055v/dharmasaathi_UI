"use client"

import React from "react"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionItemProps {
  value: string
  children: React.ReactNode
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

interface AccordionProps {
  type: "single" | "multiple"
  collapsible?: boolean
  className?: string
  children: React.ReactNode
}

const AccordionContext = React.createContext<{
  openItems: string[]
  toggleItem: (value: string) => void
  type: "single" | "multiple"
}>({
  openItems: [],
  toggleItem: () => {},
  type: "single",
})

export function Accordion({ type, collapsible = false, className, children }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (value: string) => {
    if (type === "single") {
      setOpenItems(openItems.includes(value) ? (collapsible ? [] : openItems) : [value])
    } else {
      setOpenItems(openItems.includes(value) ? openItems.filter((item) => item !== value) : [...openItems, value])
    }
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  )
}

export function AccordionItem({ value, children }: AccordionItemProps) {
  return <div data-value={value}>{children}</div>
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const { openItems, toggleItem } = React.useContext(AccordionContext)
  const value = React.useContext(AccordionItemContext)
  const isOpen = openItems.includes(value)

  return (
    <button
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-left font-medium transition-all hover:underline",
        className,
      )}
      onClick={() => toggleItem(value)}
    >
      {children}
      <ChevronDown
        className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", {
          "rotate-180": isOpen,
        })}
      />
    </button>
  )
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  const { openItems } = React.useContext(AccordionContext)
  const value = React.useContext(AccordionItemContext)
  const isOpen = openItems.includes(value)

  return (
    <div
      className={cn(
        "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className,
      )}
      data-state={isOpen ? "open" : "closed"}
      style={{
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
        transition: "height 0.2s ease-out, opacity 0.2s ease-out",
      }}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  )
}

const AccordionItemContext = React.createContext<string>("")

// Wrapper to provide value context
export function AccordionItemWrapper({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <AccordionItemContext.Provider value={value}>
      <AccordionItem value={value}>{children}</AccordionItem>
    </AccordionItemContext.Provider>
  )
}
