"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Mail, Lock, User, Phone } from "lucide-react"
import Image from "next/image"
import FadeIn from "@/components/animated/fade-in"
import SlideIn from "@/components/animated/slide-in"

const countryCodes = [
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+971", country: "AE", flag: "🇦🇪" },
  { code: "+65", country: "SG", flag: "🇸🇬" },
]

export default function Hero() {
  const [activeTab, setActiveTab] = useState("signup")
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91")

  return (
    <section id="signup-form" className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-32">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-white to-purple-50/60" />
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-r from-primary/10 to-purple-200/20 blur-3xl animate-float" />
        <div
          className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-rose-200/20 to-primary/10 blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Decorative Image */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
        <Image
          src="/placeholder.svg?height=800&width=800"
          alt="Spiritual Background"
          width={800}
          height={800}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 items-center max-w-7xl mx-auto">
          {/* Left Content - Animated */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <FadeIn delay={200}>
                <div className="inline-block mb-6">
                  <div className="flex items-center space-x-3 glass-effect px-6 py-3 rounded-full shadow-lg">
                    <Heart className="h-6 w-6 text-primary animate-pulse" />
                    <span className="text-lg font-semibold text-primary">DharmaSaathi</span>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={400}>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  From Drama to <span className="text-primary">Dharma</span>
                </h1>
              </FadeIn>

              <FadeIn delay={600}>
                <p className="max-w-[600px] text-lg sm:text-xl text-muted-foreground md:text-2xl leading-relaxed">
                  Where Seekers Meet Their Soulmates
                </p>
              </FadeIn>

              <FadeIn delay={800}>
                <p className="max-w-[600px] text-muted-foreground leading-relaxed">
                  Join thousands of spiritual souls who have found their perfect match through our sacred platform.
                  Begin your journey from chaos to consciousness, from drama to dharma.
                </p>
              </FadeIn>
            </div>

            <FadeIn delay={1000}>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Your Spiritual Journey
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105"
                >
                  Watch Stories
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Right Form - Animated */}
          <div className="lg:col-span-5 w-full">
            <SlideIn direction="right" delay={600}>
              <div className="glass-effect p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/30 max-w-md mx-auto lg:mx-0 transform transition-all duration-300 hover:shadow-3xl">
                <Tabs defaultValue="signup" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
                    <TabsTrigger
                      value="signup"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm transition-all duration-300"
                    >
                      Sign Up
                    </TabsTrigger>
                    <TabsTrigger
                      value="login"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm transition-all duration-300"
                    >
                      Login
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signup" className="space-y-4">
                    <FadeIn delay={800}>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors duration-200" />
                          <Input
                            id="name"
                            placeholder="Your full name"
                            className="pl-10 h-11 border-muted-foreground/20 focus:border-primary text-sm transition-all duration-300 focus:scale-[1.02]"
                          />
                        </div>
                      </div>
                    </FadeIn>

                    <FadeIn delay={900}>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors duration-200" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            className="pl-10 h-11 border-muted-foreground/20 focus:border-primary text-sm transition-all duration-300 focus:scale-[1.02]"
                          />
                        </div>
                      </div>
                    </FadeIn>

                    <FadeIn delay={1000}>
                      <div className="space-y-2">
                        <Label htmlFor="mobile" className="text-sm font-medium">
                          Mobile Number
                        </Label>
                        <div className="flex space-x-2">
                          <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode}>
                            <SelectTrigger className="w-20 h-11 border-muted-foreground/20 text-xs transition-all duration-300 focus:scale-[1.02]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {countryCodes.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  <span className="flex items-center space-x-2">
                                    <span>{country.flag}</span>
                                    <span className="text-xs">{country.code}</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="relative flex-1">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors duration-200" />
                            <Input
                              id="mobile"
                              type="tel"
                              placeholder="9876543210"
                              className="pl-10 h-11 border-muted-foreground/20 focus:border-primary text-sm transition-all duration-300 focus:scale-[1.02]"
                            />
                          </div>
                        </div>
                      </div>
                    </FadeIn>

                    <FadeIn delay={1100}>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                          Create Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors duration-200" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="Create a strong password"
                            className="pl-10 h-11 border-muted-foreground/20 focus:border-primary text-sm transition-all duration-300 focus:scale-[1.02]"
                          />
                        </div>
                      </div>
                    </FadeIn>

                    <FadeIn delay={1200}>
                      <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm transform hover:scale-[1.02]">
                        Create Sacred Account
                      </Button>
                    </FadeIn>

                    <FadeIn delay={1300}>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-muted-foreground/20" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-3 text-muted-foreground font-medium">Or continue with</span>
                        </div>
                      </div>
                    </FadeIn>

                    <FadeIn delay={1400}>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="h-11 border-muted-foreground/20 hover:border-primary/40 text-xs transition-all duration-300 hover:scale-[1.02]"
                        >
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          Google
                        </Button>
                        <Button
                          variant="outline"
                          className="h-11 border-muted-foreground/20 hover:border-primary/40 text-xs transition-all duration-300 hover:scale-[1.02]"
                        >
                          <svg className="mr-2 h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          Facebook
                        </Button>
                      </div>
                    </FadeIn>
                  </TabsContent>

                  <TabsContent value="login" className="space-y-4">
                    <FadeIn delay={800}>
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="your.email@example.com"
                            className="pl-10 h-11 border-muted-foreground/20 focus:border-primary text-sm transition-all duration-300 focus:scale-[1.02]"
                          />
                        </div>
                      </div>
                    </FadeIn>

                    <FadeIn delay={900}>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="login-password" className="text-sm font-medium">
                            Password
                          </Label>
                          <Button variant="link" className="h-auto p-0 text-xs text-primary hover:text-primary/80">
                            Forgot password?
                          </Button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10 h-11 border-muted-foreground/20 focus:border-primary text-sm transition-all duration-300 focus:scale-[1.02]"
                          />
                        </div>
                      </div>
                    </FadeIn>

                    <FadeIn delay={1000}>
                      <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm transform hover:scale-[1.02]">
                        Sign In to Your Journey
                      </Button>
                    </FadeIn>
                  </TabsContent>
                </Tabs>
              </div>
            </SlideIn>
          </div>
        </div>
      </div>
    </section>
  )
}
