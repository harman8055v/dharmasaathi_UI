"use client"

import { Button } from "@/components/ui/button"
import { Smartphone, Bell, Download } from "lucide-react"
import Image from "next/image"

export default function MobileApps() {
  const scrollToSignup = () => {
    const signupForm = document.getElementById("signup-form")
    if (signupForm) {
      signupForm.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background/90 to-primary/5">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col justify-center space-y-6">
            <div className="inline-block">
              <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
                <Smartphone className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Coming Soon</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">DharmaSaathi Mobile Apps</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Take your spiritual journey on the go. Our mobile apps will bring the power of meaningful connections
              right to your fingertips, with enhanced features for modern spiritual seekers.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Get notified when your spiritual match likes you</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Download className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Seamless experience across all your devices</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button
                size="lg"
                onClick={scrollToSignup}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign Up for Early Access
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 border-primary/20 hover:border-primary/40">
                Notify Me
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-200/20 rounded-3xl blur-3xl" />
            <div className="relative glass-effect p-8 rounded-3xl">
              <Image
                src="/placeholder.svg?height=500&width=400"
                alt="DharmaSaathi Mobile App Preview"
                width={400}
                height={500}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
