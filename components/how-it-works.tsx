"use client"

import { UserPlus, Search, MessageCircle, Heart } from "lucide-react"
import { useState } from "react"

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      icon: <UserPlus className="h-6 md:h-8 w-6 md:w-8 text-primary" />,
      title: "Create Profile",
      description: "Share your spiritual journey, practices, and what you seek in a partner.",
      detail:
        "Begin by creating your authentic spiritual profile. Share your meditation practices, spiritual beliefs, and the qualities you seek in a dharma partner.",
    },
    {
      icon: <Search className="h-6 md:h-8 w-6 md:w-8 text-primary" />,
      title: "Discover Matches",
      description: "Our algorithm finds compatible spiritual seekers aligned with your path.",
      detail:
        "Our intelligent matching system analyzes your spiritual compatibility, values, and practices to connect you with like-minded souls on similar journeys.",
    },
    {
      icon: <MessageCircle className="h-6 md:h-8 w-6 md:w-8 text-primary" />,
      title: "Mindful Connection",
      description: "Engage in meaningful conversations about spirituality and life goals.",
      detail:
        "Connect through deep, meaningful conversations about your spiritual practices, life philosophy, and shared aspirations for growth and enlightenment.",
    },
    {
      icon: <Heart className="h-6 md:h-8 w-6 md:w-8 text-primary" />,
      title: "Begin Together",
      description: "Start your shared spiritual journey with your dharma partner.",
      detail:
        "Embark on a beautiful journey of spiritual growth together, supporting each other's path to enlightenment and building a conscious relationship.",
    },
  ]

  return (
    <section
      id="how-it-works"
      className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-background to-background/90 overflow-hidden"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl animate-fade-in-up">
            Your Spiritual Journey
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-base md:text-lg lg:text-xl leading-relaxed px-4 animate-fade-in-up delay-200">
            Four transformative steps to find your spiritual partner
          </p>
        </div>

        {/* Interactive Journey Path */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent transform -translate-y-1/2 z-0" />

          {/* Progress Indicator */}
          <div
            className="hidden lg:block absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 transform -translate-y-1/2 z-10 transition-all duration-1000 ease-out"
            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 relative z-20">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`group cursor-pointer transition-all duration-500 ${
                  activeStep === index ? "scale-105" : "hover:scale-102"
                }`}
                onMouseEnter={() => setActiveStep(index)}
                onClick={() => setActiveStep(index)}
              >
                {/* Step Card */}
                <div
                  className={`
                  relative p-6 rounded-2xl border transition-all duration-500
                  ${
                    activeStep === index
                      ? "bg-white border-primary/50 shadow-xl"
                      : "bg-white/80 border-border hover:border-primary/30 hover:shadow-lg"
                  }
                  backdrop-blur-sm
                `}
                >
                  {/* Step Number */}
                  <div
                    className={`
                    absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                    ${
                      activeStep === index
                        ? "bg-primary text-primary-foreground shadow-lg scale-110"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/20"
                    }
                  `}
                  >
                    {index + 1}
                  </div>

                  {/* Icon Container */}
                  <div className="relative mb-6 flex justify-center">
                    <div
                      className={`
                      relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-500
                      ${
                        activeStep === index
                          ? "bg-primary/10 shadow-lg scale-110"
                          : "bg-primary/5 group-hover:bg-primary/10 group-hover:scale-105"
                      }
                    `}
                    >
                      {/* Animated Ring */}
                      <div
                        className={`
                        absolute inset-0 rounded-full border-2 transition-all duration-500
                        ${
                          activeStep === index
                            ? "border-primary animate-pulse-glow"
                            : "border-transparent group-hover:border-primary/30"
                        }
                      `}
                      />

                      {/* Icon */}
                      <div
                        className={`transition-all duration-300 ${
                          activeStep === index ? "text-primary scale-110" : "text-primary/70 group-hover:text-primary"
                        }`}
                      >
                        {step.icon}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-3">
                    <h3
                      className={`
                      text-lg md:text-xl font-bold transition-all duration-300
                      ${activeStep === index ? "text-primary" : "text-foreground group-hover:text-primary"}
                    `}
                    >
                      {step.title}
                    </h3>

                    <p
                      className={`
                      text-sm md:text-base leading-relaxed transition-all duration-300
                      ${activeStep === index ? "text-foreground" : "text-muted-foreground"}
                    `}
                    >
                      {activeStep === index ? step.detail : step.description}
                    </p>
                  </div>

                  {/* Active Step Indicator */}
                  <div
                    className={`
                    absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full transition-all duration-300
                    ${activeStep === index ? "bg-primary shadow-lg" : "bg-transparent"}
                  `}
                  />
                </div>

                {/* Mobile Connection Line */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-6">
                    <div
                      className={`
                      w-0.5 h-8 transition-all duration-500
                      ${index < activeStep ? "bg-primary" : "bg-border"}
                    `}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 animate-fade-in-up delay-600">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full border border-primary/20">
              <Heart className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Ready to begin your journey?</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
