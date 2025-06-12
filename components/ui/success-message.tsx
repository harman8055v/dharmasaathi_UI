"use client"

import { CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SuccessMessageProps {
  title: string
  message: string
  onClose?: () => void
  className?: string
}

export default function SuccessMessage({ title, message, onClose, className }: SuccessMessageProps) {
  return (
    <div
      className={cn(
        "bg-green-50 border border-green-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300",
        className,
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-green-800">{title}</h3>
          <p className="mt-1 text-sm text-green-700">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-green-500 hover:text-green-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
