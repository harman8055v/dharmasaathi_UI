"use client"

import { useState, useEffect } from "react"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "DharmaSaathi helped me find someone who shares my spiritual values. We meditate together every morning now.",
    name: "Ananya S.",
    location: "Rishikesh, India",
  },
  {
    quote:
      "After years of searching, I found someone who understands my yogic lifestyle. We're getting married next month!",
    name: "Michael P.",
    location: "Boulder, USA",
  },
  {
    quote:
      "The spiritual compatibility matching is incredible. My partner and I were both Buddhists looking for the same path.",
    name: "Tara L.",
    location: "Chiang Mai, Thailand",
  },
  {
    quote:
      "I never thought I'd find someone who understands my devotion to spiritual growth. DharmaSaathi made it possible.",
    name: "Raj K.",
    location: "Varanasi, India",
  },
]

export default function TestimonialsMinimal() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrent((current) => (current + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  return (
    <section id="testimonials" className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-background/90 to-background/80">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl">Soul Connections</h2>
          <p className="max-w-[700px] text-muted-foreground text-base md:text-lg lg:text-xl leading-relaxed px-4">
            Stories from spiritual partners who found each other
          </p>
        </div>

        <div className="mx-auto max-w-4xl relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2 md:px-4">
                  <div className="border-none bg-gradient-to-b from-white/80 to-white shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] rounded-lg">
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4 flex justify-center">
                          <Quote className="h-5 md:h-6 w-5 md:w-6 text-primary/60 animate-pulse" />
                        </div>
                        <p className="mb-4 text-base md:text-lg italic text-muted-foreground leading-relaxed">
                          "{testimonial.quote}"
                        </p>
                        <div>
                          <h4 className="font-medium text-sm md:text-base">{testimonial.name}</h4>
                          <p className="text-xs md:text-sm text-muted-foreground">{testimonial.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 md:mt-8 flex justify-center gap-2">
            <button
              className="rounded-full h-8 w-8 md:h-10 md:w-10 border border-input bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center"
              onClick={() => {
                setAutoplay(false)
                setCurrent((current - 1 + testimonials.length) % testimonials.length)
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 md:h-4 w-3 md:w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span className="sr-only">Previous</span>
            </button>
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full p-0 transition-all duration-300 hover:scale-125 ${
                  current === index ? "bg-primary" : "bg-muted"
                }`}
                onClick={() => {
                  setAutoplay(false)
                  setCurrent(index)
                }}
              >
                <span className="sr-only">Go to slide {index + 1}</span>
              </button>
            ))}
            <button
              className="rounded-full h-8 w-8 md:h-10 md:w-10 border border-input bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center"
              onClick={() => {
                setAutoplay(false)
                setCurrent((current + 1) % testimonials.length)
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 md:h-4 w-3 md:w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span className="sr-only">Next</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
