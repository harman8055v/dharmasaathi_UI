"use client"

import { Heart, Users, MessageCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const steps = [
  {
    icon: Heart,
    title: "Create Your Sacred Profile",
    description: "Share your spiritual journey, values, and what you seek in a dharma partner.",
    details: "Build a meaningful profile that reflects your authentic spiritual self and attracts like-minded souls.",
  },
  {
    icon: Users,
    title: "Discover Aligned Souls",
    description: "Our algorithm connects you with spiritually compatible partners on similar paths.",
    details:
      "Find matches based on spiritual practices, values, and life philosophy rather than just surface-level attraction.",
  },
  {
    icon: MessageCircle,
    title: "Connect Mindfully",
    description: "Engage in meaningful conversations that go beyond the superficial.",
    details: "Start conversations with intention, sharing your spiritual insights and building genuine connections.",
  },
  {
    icon: Sparkles,
    title: "Begin Your Journey Together",
    description: "Transform from individual seekers into conscious partners walking the path together.",
    details: "Create a relationship built on mutual growth, spiritual alignment, and shared purpose.",
  },
]

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section id="how-it-works" className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-background to-background/90">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl">
            Your Spiritual Journey
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Four transformative steps to finding your dharma partner and beginning a conscious relationship journey.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-border" style={{ height: "85%" }} />

          {/* Progress Line */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-primary to-primary/60 transition-all duration-700"
            style={{ height: `${((activeStep + 1) / steps.length) * 85}%` }}
          />

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isLeft = index % 2 === 0
              const isActive = index === activeStep

              return (
                <div key={index} className="relative flex items-center justify-center">
                  {/* Timeline Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                    <div
                      className={`w-12 h-12 rounded-full border-4 border-background flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-background text-muted-foreground border-border"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className={`w-full max-w-md ${isLeft ? "pr-20 text-right" : "pl-20 text-left ml-auto"}`}>
                    <div
                      className={`p-6 rounded-lg border bg-card transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "shadow-lg border-primary/20 bg-primary/5"
                          : "hover:shadow-md hover:border-primary/10"
                      }`}
                      onClick={() => setActiveStep(index)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-primary">Step {index + 1}</span>
                        </div>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                        {isActive && <p className="text-sm text-muted-foreground pt-2 border-t">{step.details}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="px-8">
            Begin Your Journey
          </Button>
        </div>
      </div>
    </section>
  )
}
