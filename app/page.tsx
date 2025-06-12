"use client"

import { Suspense } from "react"
import Header from "@/components/header"
import EnhancedHero from "@/components/enhanced-hero"
import Features from "@/components/features"
import HowItWorks from "@/components/how-it-works"
import Testimonials from "@/components/testimonials"
import MobileApps from "@/components/mobile-apps"
import InspirationQuote from "@/components/inspiration-quote"
import Faq from "@/components/faq"
import Footer from "@/components/footer"
import LoadingWrapper from "@/components/loading-wrapper"

// Skeleton imports
import HeaderSkeleton from "@/components/skeletons/header-skeleton"
import HeroSkeleton from "@/components/skeletons/hero-skeleton"
import FeaturesSkeleton from "@/components/skeletons/features-skeleton"
import HowItWorksSkeleton from "@/components/skeletons/how-it-works-skeleton"
import TestimonialsSkeleton from "@/components/skeletons/testimonials-skeleton"
import MobileAppsSkeleton from "@/components/skeletons/mobile-apps-skeleton"
import FaqSkeleton from "@/components/skeletons/faq-skeleton"
import FooterSkeleton from "@/components/skeletons/footer-skeleton"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <LoadingWrapper skeleton={<HeaderSkeleton />} delay={800}>
        <Header />
      </LoadingWrapper>

      <LoadingWrapper skeleton={<HeroSkeleton />} delay={1200}>
        <EnhancedHero />
      </LoadingWrapper>

      <LoadingWrapper skeleton={<FeaturesSkeleton />} delay={1600}>
        <Features />
      </LoadingWrapper>

      <LoadingWrapper skeleton={<HowItWorksSkeleton />} delay={2000}>
        <HowItWorks />
      </LoadingWrapper>

      <LoadingWrapper skeleton={<TestimonialsSkeleton />} delay={2400}>
        <Testimonials />
      </LoadingWrapper>

      <LoadingWrapper skeleton={<MobileAppsSkeleton />} delay={2800}>
        <MobileApps />
      </LoadingWrapper>

      <Suspense fallback={<div className="py-12 md:py-16 lg:py-24" />}>
        <InspirationQuote />
      </Suspense>

      <LoadingWrapper skeleton={<FaqSkeleton />} delay={3200}>
        <Faq />
      </LoadingWrapper>

      <LoadingWrapper skeleton={<FooterSkeleton />} delay={3600}>
        <Footer />
      </LoadingWrapper>
    </main>
  )
}
