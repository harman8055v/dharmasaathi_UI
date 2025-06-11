"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import {
  Heart,
  Shield,
  Eye,
  CheckCircle,
  Star,
  Globe,
  Smartphone,
  UserCheck,
  MessageCircle,
  Sparkles,
  MapPin,
  Lock,
  Award,
  Instagram,
  Twitter,
  Youtube,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

// Country codes with flag emojis
const countryCodes = [
  { code: "+91", flag: "🇮🇳" }, // India
  { code: "+1", flag: "🇺🇸" }, // USA
  { code: "+44", flag: "🇬🇧" }, // UK
  { code: "+61", flag: "🇦🇺" }, // Australia
  { code: "+86", flag: "🇨🇳" }, // China
  { code: "+81", flag: "🇯🇵" }, // Japan
  { code: "+49", flag: "🇩🇪" }, // Germany
  { code: "+33", flag: "🇫🇷" }, // France
  { code: "+7", flag: "🇷🇺" }, // Russia
  { code: "+971", flag: "🇦🇪" }, // UAE
  { code: "+65", flag: "🇸🇬" }, // Singapore
  { code: "+60", flag: "🇲🇾" }, // Malaysia
  { code: "+66", flag: "🇹🇭" }, // Thailand
  { code: "+852", flag: "🇭🇰" }, // Hong Kong
  { code: "+55", flag: "🇧🇷" }, // Brazil
  { code: "+27", flag: "🇿🇦" }, // South Africa
  { code: "+234", flag: "🇳🇬" }, // Nigeria
  { code: "+20", flag: "🇪🇬" }, // Egypt
  { code: "+966", flag: "🇸🇦" }, // Saudi Arabia
  { code: "+64", flag: "🇳🇿" }, // New Zealand
]

export default function DharmaSaathiLanding() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup")
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91")

  // Form validation states
  const [email, setEmail] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [emailError, setEmailError] = useState("")
  const [signupEmailError, setSignupEmailError] = useState("")
  const [phoneError, setPhoneError] = useState("")

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Phone validation - exactly 10 digits
  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(phone)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address")
    } else {
      setEmailError("")
    }
  }

  const handleSignupEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSignupEmail(value)
    if (value && !validateEmail(value)) {
      setSignupEmailError("Please enter a valid email address")
    } else {
      setSignupEmailError("")
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Remove non-digits
    setPhoneNumber(value)
    if (value && !validatePhone(value)) {
      setPhoneError("Phone number must be exactly 10 digits")
    } else {
      setPhoneError("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-white to-gold-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-beige-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/your-logo-path.png" alt="DharmaSaathi Logo" className="h-10 w-auto" />
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-700 hover:text-primary-900 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-700 hover:text-primary-900 transition-colors">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-gray-700 hover:text-primary-900 transition-colors">
              Stories
            </Link>
            <Link href="#faq" className="text-gray-700 hover:text-primary-900 transition-colors">
              FAQ
            </Link>
          </nav>
          <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen} modal={false}>
            <DialogTrigger asChild>
              <Button className="bg-primary-900 hover:bg-primary-800 text-white px-6 py-2 rounded-full shadow-lg">
                Sign Up
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold text-primary-900">
                  {authMode === "login" ? "Welcome Back" : "Join DharmaSaathi"}
                </DialogTitle>
                <DialogDescription className="text-center text-gray-600">
                  {authMode === "login"
                    ? "Sign in to continue your spiritual journey"
                    : "Begin your journey to find your spiritual soulmate"}
                </DialogDescription>
              </DialogHeader>

              <Tabs
                value={authMode}
                onValueChange={(value) => setAuthMode(value as "login" | "signup")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className={`mt-1 ${emailError ? "border-red-500" : ""}`}
                        value={email}
                        onChange={handleEmailChange}
                      />
                      {emailError && (
                        <div className="flex items-center mt-1 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span>{emailError}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="••••••••" className="mt-1" />
                    </div>
                    <Button className="w-full bg-primary-900 hover:bg-primary-800">Sign In</Button>
                  </div>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="First name" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Last name" className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="signupEmail">Email</Label>
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="your@email.com"
                        className={`mt-1 ${signupEmailError ? "border-red-500" : ""}`}
                        value={signupEmail}
                        onChange={handleSignupEmailChange}
                      />
                      {signupEmailError && (
                        <div className="flex items-center mt-1 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span>{signupEmailError}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <div className="flex mt-1">
                        <select
                          value={selectedCountryCode}
                          onChange={(e) => setSelectedCountryCode(e.target.value)}
                          className="w-24 rounded-l-md border border-r-0 border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          {countryCodes.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.code}
                            </option>
                          ))}
                        </select>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="Phone number"
                          className={`rounded-l-none flex-1 ${phoneError ? "border-red-500" : ""}`}
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          maxLength={10}
                        />
                      </div>
                      {phoneError && (
                        <div className="flex items-center mt-1 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span>{phoneError}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="signupPassword">Password</Label>
                      <Input id="signupPassword" type="password" placeholder="••••••••" className="mt-1" />
                    </div>
                    <Button className="w-full bg-primary-900 hover:bg-primary-800">Create Account</Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  <span className="text-sm font-medium">Google</span>
                </Button>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#1877F2"
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Facebook</span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-beige-50 to-gold-50 opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 animate-float">
              <img
                src="/your-logo-image.png"
                alt="DharmaSaathi Logo"
                className="w-24 h-24 mx-auto mb-6 shadow-2xl rounded-full object-cover animate-float"
              />
              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                <span className="bg-spiritual-gradient bg-clip-text text-transparent">DharmaSaathi</span>
              </h1>
            </div>

            <p className="text-2xl lg:text-3xl text-primary-900 font-semibold mb-4">
              Where spiritual seekers find true connection
            </p>

            <p className="text-lg lg:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Find conscious, spiritual partners worldwide—meditators, yogis, seekers, and mindful souls ready for
              authentic love and deep connection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-primary-900 hover:bg-primary-800 text-white px-8 py-4 text-lg rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={() => setIsLoginOpen(true)}
              >
                Get Started Free
                <Heart className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-900 text-primary-900 hover:bg-primary-50 px-8 py-4 text-lg rounded-full"
              >
                Watch Demo
                <Eye className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Free to join
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-primary-900 mr-2" />
                KYC Verified
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 text-gold-600 mr-2" />
                Global community
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spiritual Quote Section */}
      <section className="py-16 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Sparkles className="w-12 h-12 mx-auto mb-6 text-gold-300" />
            <blockquote className="text-2xl lg:text-3xl font-light italic mb-6 leading-relaxed">
              "When two souls are meant for each other, no distance is too far, no time is too long, and no other love
              can break them apart."
            </blockquote>
            <p className="text-gold-200 text-lg">— Ancient Sanskrit Wisdom</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-primary-900 mb-6">Why Choose DharmaSaathi?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the most authentic spiritual dating platform designed for conscious connections
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-900 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-primary-900">Verified Profiles</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Every member goes through our comprehensive KYC verification process for authentic connections.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-primary-900">Deep Compatibility</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Advanced matching based on spiritual practices, values, and consciousness levels.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-beige-500 to-beige-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-primary-900">Who Liked Me</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  See who's interested in you and who viewed your profile with our premium insights.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-primary-900">Privacy First</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Your data is sacred. End-to-end encryption and complete privacy control.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-primary-900">Meaningful Conversations</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Guided conversation starters based on spiritual topics and shared interests.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-primary-900">Global Community</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Connect with spiritual souls from around the world, transcending geographical boundaries.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-beige-50 to-gold-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-primary-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your journey to finding your spiritual soulmate in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-spiritual-gradient rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <UserCheck className="w-12 h-12 text-white" />
                </div>
                <Badge className="absolute -top-2 -right-2 bg-gold-500 text-white">1</Badge>
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-4">Create Your Profile</h3>
              <p className="text-gray-600 leading-relaxed">
                Share your spiritual journey, practices, and what you're seeking in a conscious partner. Our KYC
                verification ensures authenticity.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-12 h-12 text-white" />
                </div>
                <Badge className="absolute -top-2 -right-2 bg-gold-500 text-white">2</Badge>
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-4">Find Your Match</h3>
              <p className="text-gray-600 leading-relaxed">
                Our advanced algorithm matches you with compatible souls based on spiritual alignment, values, and
                consciousness levels.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
                <Badge className="absolute -top-2 -right-2 bg-gold-500 text-white">3</Badge>
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-4">Connect & Grow</h3>
              <p className="text-gray-600 leading-relaxed">
                Start meaningful conversations, share your spiritual practices, and build a conscious relationship that
                elevates both souls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-primary-900 mb-6">Love Stories That Inspire</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real couples who found their spiritual soulmates through DharmaSaathi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-gold-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "We both practice meditation daily and found each other through DharmaSaathi. Our connection goes
                  beyond the physical - it's a meeting of souls."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-900 to-primary-700 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">P&S</span>
                  </div>
                  <div>
                    <p className="font-semibold text-primary-900">Priya & Sandeep</p>
                    <p className="text-sm text-gray-500">Married</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-gold-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "As yoga instructors, we were looking for someone who understood our lifestyle. DharmaSaathi brought
                  us together beautifully."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">A&R</span>
                  </div>
                  <div>
                    <p className="font-semibold text-primary-900">Akshay & Roopali</p>
                    <p className="text-sm text-gray-500">Engaged</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-gold-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "The depth of connection we found here is unmatched. We share the same spiritual path and support each
                  other's growth."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">M&D</span>
                  </div>
                  <div>
                    <p className="font-semibold text-primary-900">Maya & Dev</p>
                    <p className="text-sm text-gray-500">Together</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-gold-300 mb-2">20K+</div>
              <p className="text-lg text-primary-100">Spiritual Seekers</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-gold-300 mb-2">15+</div>
              <p className="text-lg text-primary-100">Spiritual Organizations</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-gold-300 mb-2">500+</div>
              <p className="text-lg text-primary-100">Success Stories</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-gold-300 mb-2">95%</div>
              <p className="text-lg text-primary-100">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Preview */}
      <section className="py-20 bg-gradient-to-br from-beige-50 to-gold-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-primary-900 mb-6">Mobile Apps Coming Soon</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Our mobile apps are launching soon! Sign up on our web platform now to get early access and be the first
                to experience our beautifully designed mobile app.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                  <span className="text-lg text-gray-700">Early access for web platform users</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                  <span className="text-lg text-gray-700">Offline mode for meditation reminders</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                  <span className="text-lg text-gray-700">Location-based spiritual events</span>
                </div>
              </div>
              <Button
                className="bg-primary-900 hover:bg-primary-800 px-8 py-4 text-lg rounded-full"
                onClick={() => setIsLoginOpen(true)}
              >
                Sign Up Now For Early Access
                <Heart className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-64 h-96 bg-gradient-to-br from-primary-900 to-primary-700 rounded-3xl shadow-2xl mx-auto flex items-center justify-center">
                  <Smartphone className="w-32 h-32 text-white opacity-50" />
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center animate-float">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-16 bg-gradient-to-br from-beige-50 to-gold-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-900 mb-4">Supported Spiritual Organizations</h2>
            <p className="text-gray-600">Our users are heartful followers of one or more of these organizations</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                  <Award className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Your Spiritual Soulmate Awaits</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Join thousands of conscious souls who have found love, connection, and spiritual growth through
              DharmaSaathi. Your journey to authentic love starts here.
            </p>
            <Button
              size="lg"
              className="bg-white text-primary-900 hover:bg-beige-50 px-8 py-4 text-lg rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => setIsLoginOpen(true)}
            >
              Start Your Journey Today
              <Heart className="ml-2 w-5 h-5" />
            </Button>
            <p className="mt-4 text-sm opacity-75">Free to join • No credit card required</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-950 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <img src="/your-logo-path.png" alt="DharmaSaathi Logo" className="h-8 w-auto" />
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Connecting spiritual souls worldwide for authentic love and conscious relationships. Where dharma meets
                destiny.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors cursor-pointer">
                  <Instagram className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors cursor-pointer">
                  <Twitter className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors cursor-pointer">
                  <Youtube className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-gold-300">Platform</h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Premium Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Mobile App
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-gold-300">Support</h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Safety Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Community Rules
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-gold-300">Legal</h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Data Protection
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} DharmaSaathi. All rights reserved. Made with ❤️ for spiritual souls.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Global Platform
              </div>
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-1" />
                Secure & Private
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
