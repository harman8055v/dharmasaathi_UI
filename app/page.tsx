"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import Header from "@/components/header"
import EnhancedHeroSimple from "@/components/enhanced-hero-simple"
import InspirationQuote from "@/components/inspiration-quote"

// Lazy load components with dynamic imports
const Features = dynamic(() => import("@/components/features"), {
  loading: () => <div className="py-12 md:py-16 lg:py-24 bg-muted/20 animate-pulse" />,
  ssr: false,
})

const HowItWorks = dynamic(() => import("@/components/how-it-works"), {
  loading: () => <div className="py-12 md:py-16 lg:py-24 bg-muted/20 animate-pulse" />,
  ssr: false,
})

const Testimonials = dynamic(() => import("@/components/testimonials"), {
  loading: () => <div className="py-12 md:py-16 lg:py-24 bg-muted/20 animate-pulse" />,
  ssr: false,
})

const MobileApps = dynamic(() => import("@/components/mobile-apps"), {
  loading: () => <div className="py-12 md:py-16 lg:py-24 bg-muted/20 animate-pulse" />,
  ssr: false,
})

const FaqSimple = dynamic(() => import("@/components/faq-simple"), {
  loading: () => <div className="py-12 md:py-16 lg:py-24 bg-muted/20 animate-pulse" />,
  ssr: false,
})

const Footer = dynamic(() => import("@/components/footer"), {
  loading: () => <div className="py-12 md:py-16 bg-muted/20 animate-pulse" />,
  ssr: false,
})

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Critical above-the-fold content */}
      <Header />
      <EnhancedHeroSimple />

      {/* Lazy loaded sections */}
      <Suspense fallback={<div className="py-12 md:py-16 lg:py-24 bg-muted/20 animate-pulse" />}>
        <Features />
      </Suspense>

      <Suspense fallback={<div className="py-12 md:py-16 lg:py-24 bg-muted/20 animate-pulse" />}>
        <HowItWorks />
      </Suspense>

      <Suspense fallback={<div className="py-12 md:py-16 lg:py-24 bg-muted/20 animate-pulse" />}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<div className="py-12 md:py-16 lg:py-24 bg-muted/20 animate-pulse" />}>
        <MobileApps />
      </Suspense>

      {/* Keep inspiration quote as it's lightweight */}
      <InspirationQuote />

      <Suspense fallback={<div className="py-12 md:py-16 lg:py-24 bg-muted/20 animate-pulse" />}>
        <FaqSimple />
      </Suspense>

      <Suspense fallback={<div className="py-12 md:py-16 bg-muted/20 animate-pulse" />}>
        <Footer />
      </Suspense>
    </main>
  )
}
