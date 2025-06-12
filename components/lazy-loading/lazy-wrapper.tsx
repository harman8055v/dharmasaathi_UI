"use client"

import { lazy, Suspense } from "react"
import type React from "react"

interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  threshold?: number
}

export default function LazyWrapper({ children, fallback = null, threshold = 0.1 }: LazyWrapperProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>
}

// Lazy load components
export const LazyFeatures = lazy(() => import("@/components/features"))
export const LazyHowItWorks = lazy(() => import("@/components/how-it-works"))
export const LazyTestimonials = lazy(() => import("@/components/testimonials"))
export const LazyMobileApps = lazy(() => import("@/components/mobile-apps"))
export const LazyFaq = lazy(() => import("@/components/faq"))
export const LazyFooter = lazy(() => import("@/components/footer"))
