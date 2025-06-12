"use client"

import { Button } from "@/components/ui/button"
import { Smartphone, Bell, Download } from "lucide-react"
import Image from "next/image"
import ParallaxContainer from "@/components/parallax/parallax-container"
import { FloatingOrb } from "@/components/parallax/floating-elements"

export default function MobileApps() {
  const scrollToSignup = () => {
    const signupForm = document.getElementById("signup-form")
    if (signupForm) {
      signupForm.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-background/90 to-primary/5 relative overflow-hidden">
      {/* Parallax Background Elements */}
      <FloatingOrb
        className="top-20 left-20"
        size="w-64 h-64"
        color="bg-gradient-to-r from-primary/6 to-purple-100/12"
        delay={0}
      />
      <FloatingOrb
        className="bottom-10 right-10"
        size="w-48 h-48"
        color="bg-gradient-to-r from-rose-100/12 to-primary/6"
        delay={1500}
      />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <ParallaxContainer speed={0.1} className="flex flex-col justify-center space-y-6 order-2 lg:order-1">
            <div className="inline-block">
              <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
                <Smartphone className="h-4 md:h-5 w-4 md:w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Coming Soon</span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl">
              DharmaSaathi Mobile Apps
            </h2>
            <p className="max-w-[600px] text-muted-foreground text-base md:text-lg lg:text-xl leading-relaxed">
              Take your spiritual journey on the go. Our mobile apps will bring the power of meaningful connections
              right to your fingertips, with enhanced features for modern spiritual seekers.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm md:text-base text-muted-foreground">
                  Get notified when your spiritual match likes you
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Download className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm md:text-base text-muted-foreground">
                  Seamless experience across all your devices
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={scrollToSignup}
                className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-3 md:py-4 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign Up for Early Access
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-6 md:px-8 py-3 md:py-4 border-primary/20 hover:border-primary/40"
              >
                Notify Me
              </Button>
            </div>
          </ParallaxContainer>

          <ParallaxContainer speed={0.15} className="relative order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-200/20 rounded-3xl blur-3xl" />
            <div className="relative glass-effect p-6 md:p-8 rounded-3xl">
              <Image
                src="/placeholder.svg?height=500&width=400"
                alt="DharmaSaathi Mobile App Preview"
                width={400}
                height={500}
                className="w-full h-auto rounded-2xl shadow-2xl max-w-sm mx-auto"
              />
            </div>
          </ParallaxContainer>
        </div>
      </div>
    </section>
  )
}
