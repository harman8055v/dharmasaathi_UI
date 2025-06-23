"use client"

import { UserPlus, Search, MessageCircle, Heart } from "lucide-react"
import { useState } from "react"

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      icon: <UserPlus className="h-6 md:h-8 w-6 md:w-8" />,
      title: "Create Profile",
      description: "Share your spiritual journey, practices, and what you seek in a partner.",
      detail:
        "Begin by creating your authentic spiritual profile. Share your meditation practices, spiritual beliefs, and the qualities you seek in a dharma partner.",
    },
    {
      icon: <Search className="h-6 md:h-8 w-6 md:w-8" />,
      title: "Discover Matches",
      description: "Our algorithm finds compatible spiritual seekers aligned with your path.",
      detail:
        "Our intelligent matching system analyzes your spiritual compatibility, values, and practices to connect you with like-minded souls on similar journeys.",
    },
    {
      icon: <MessageCircle className="h-6 md:h-8 w-6 md:w-8" />,
      title: "Mindful Connection",
      description: "Engage in meaningful conversations about spirituality and life goals.",
      detail:
        "Connect through deep, meaningful conversations about your spiritual practices, life philosophy, and shared aspirations for growth and enlightenment.",
    },
    {
      icon: <Heart className="h-6 md:h-8 w-6 md:w-8" />,
      title: "Begin Together",
      description: "Start your shared spiritual journey with your dharma partner.",
      detail:
        "Embark on a beautiful journey of spiritual growth together, supporting each other's path to enlightenment and building a conscious relationship.",
    },
  ]

  return (
    <section id="how-it-works" className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl">
            Your Spiritual Journey
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-base md:text-lg lg:text-xl leading-relaxed px-4">
            Four transformative steps to find your spiritual partner
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20" />

          {/* Active Progress Line */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-primary to-primary/60 transition-all duration-1000 ease-out"
            style={{ height: `${((activeStep + 1) / steps.length) * 100}%` }}
          />

          {/* Steps */}
          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex-col group cursor-pointer`}
                onMouseEnter={() => setActiveStep(index)}
                onClick={() => setActiveStep(index)}
              >
                {/* Content Card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                  <div
                    className={`
                      relative p-6 md:p-8 rounded-2xl border transition-all duration-500 transform
                      ${
                        activeStep === index
                          ? "bg-white shadow-xl border-primary/30 scale-105 shadow-primary/10"
                          : "bg-white/80 border-border hover:border-primary/20 hover:shadow-lg hover:scale-102"
                      }
                    `}
                  >
                    {/* Step Number Badge */}
                    <div
                      className={`
                        absolute -top-3 ${index % 2 === 0 ? "-right-3" : "-left-3"} 
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                        ${
                          activeStep === index
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10"
                        }
                      `}
                    >
                      {index + 1}
                    </div>

                    <div className="space-y-4">
                      <h3
                        className={`
                          text-xl md:text-2xl font-bold transition-colors duration-300
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

                    {/* Connecting Arrow */}
                    <div
                      className={`
                        hidden md:block absolute top-1/2 transform -translate-y-1/2 
                        ${index % 2 === 0 ? "-right-4" : "-left-4"}
                        w-8 h-0.5 transition-all duration-300
                        ${activeStep === index ? "bg-primary" : "bg-border group-hover:bg-primary/50"}
                      `}
                    />
                  </div>
                </div>

                {/* Central Icon */}
                <div className="relative z-10 flex-shrink-0 my-4 md:my-0">
                  <div
                    className={`
                      relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full 
                      transition-all duration-500 border-4 bg-white
                      ${
                        activeStep === index
                          ? "border-primary shadow-xl shadow-primary/20 scale-110"
                          : "border-muted group-hover:border-primary/50 group-hover:scale-105"
                      }
                    `}
                  >
                    {/* Pulse Ring */}
                    {activeStep === index && (
                      <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20" />
                    )}

                    {/* Icon */}
                    <div
                      className={`
                        transition-all duration-300
                        ${activeStep === index ? "text-primary" : "text-muted-foreground group-hover:text-primary"}
                      `}
                    >
                      {step.icon}
                    </div>
                  </div>
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block w-5/12" />
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 md:mt-20">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-full border border-primary/20 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <Heart className="h-5 w-5 text-primary" />
              <span className="text-base font-medium text-primary">Ready to begin your journey?</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
