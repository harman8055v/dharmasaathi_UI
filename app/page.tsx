"use client"

import { Suspense, lazy } from "react"
import Header from "@/components/header-minimal"
import HeroMinimal from "@/components/hero-minimal"

// Lazy load components
const FeaturesMinimal = lazy(() => import("@/components/features-minimal"))
const TestimonialsMinimal = lazy(() => import("@/components/testimonials-minimal"))
const FooterMinimal = lazy(() => import("@/components/footer-minimal"))

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Critical above-the-fold content */}
      <Header />
      <HeroMinimal />

      {/* Lazy loaded sections */}
      <Suspense fallback={<div className="py-12 md:py-16 lg:py-24 bg-muted/20 animate-pulse" />}>
        <FeaturesMinimal />
      </Suspense>

      <Suspense fallback={<div className="py-12 md:py-16 lg:py-24 bg-muted/20 animate-pulse" />}>
        <TestimonialsMinimal />
      </Suspense>

      <Suspense fallback={<div className="py-12 md:py-16 bg-muted/20 animate-pulse" />}>
        <FooterMinimal />
      </Suspense>
    </main>
  )
}
