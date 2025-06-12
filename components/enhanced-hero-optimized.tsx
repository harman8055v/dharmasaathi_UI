"use client"

import type React from "react"

import { useState, memo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Mail, Lock, User, Phone } from "lucide-react"
import FadeIn from "@/components/animated/fade-in"
import SlideIn from "@/components/animated/slide-in"
import FormField from "@/components/ui/form-field"
import LoadingButton from "@/components/ui/loading-button"
import SuccessMessage from "@/components/ui/success-message"
import { useFormValidation } from "@/hooks/use-form-validation"
import ParallaxContainerOptimized from "@/components/optimized/parallax-container-optimized"
import { FloatingOrbOptimized, FloatingShapeOptimized } from "@/components/optimized/floating-elements-optimized"
import OptimizedImage from "@/components/optimized/image-optimized"

const countryCodes = [
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+971", country: "AE", flag: "🇦🇪" },
  { code: "+65", country: "SG", flag: "🇸🇬" },
]

// Validation rules
const signupRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  mobile: {
    required: true,
    pattern: /^[0-9]{10}$/,
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  },
}

const loginRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 1,
  },
}

// Memoized form components
const SignupForm = memo(function SignupForm({
  signupForm,
  selectedCountryCode,
  setSelectedCountryCode,
  isSubmitting,
  handleSubmit,
  handleSocialLogin,
}: any) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Full Name"
        id="name"
        placeholder="Your full name"
        value={signupForm.formState.name.value}
        error={signupForm.formState.name.error}
        touched={signupForm.formState.name.touched}
        isValid={signupForm.formState.name.isValid}
        icon={<User className="h-4 w-4" />}
        disabled={isSubmitting}
        onChange={(value) => signupForm.updateField("name", value)}
        onBlur={() => signupForm.touchField("name")}
      />

      <FormField
        label="Email Address"
        id="email"
        type="email"
        placeholder="your.email@example.com"
        value={signupForm.formState.email.value}
        error={signupForm.formState.email.error}
        touched={signupForm.formState.email.touched}
        isValid={signupForm.formState.email.isValid}
        icon={<Mail className="h-4 w-4" />}
        disabled={isSubmitting}
        onChange={(value) => signupForm.updateField("email", value)}
        onBlur={() => signupForm.touchField("email")}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Mobile Number</label>
        <div className="flex space-x-2">
          <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode} disabled={isSubmitting}>
            <SelectTrigger className="w-20 h-11 border-muted-foreground/20 text-xs">
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
          <div className="flex-1">
            <FormField
              label=""
              id="mobile"
              type="tel"
              placeholder="9876543210"
              value={signupForm.formState.mobile.value}
              error={signupForm.formState.mobile.error}
              touched={signupForm.formState.mobile.touched}
              isValid={signupForm.formState.mobile.isValid}
              icon={<Phone className="h-4 w-4" />}
              disabled={isSubmitting}
              onChange={(value) => signupForm.updateField("mobile", value)}
              onBlur={() => signupForm.touchField("mobile")}
            />
          </div>
        </div>
      </div>

      <FormField
        label="Create Password"
        id="password"
        type="password"
        placeholder="Create a strong password"
        value={signupForm.formState.password.value}
        error={signupForm.formState.password.error}
        touched={signupForm.formState.password.touched}
        isValid={signupForm.formState.password.isValid}
        icon={<Lock className="h-4 w-4" />}
        disabled={isSubmitting}
        onChange={(value) => signupForm.updateField("password", value)}
        onBlur={() => signupForm.touchField("password")}
      />

      <LoadingButton
        type="submit"
        loading={isSubmitting}
        loadingText="Creating Account..."
        disabled={!signupForm.isFormValid}
        className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium shadow-lg hover:shadow-xl text-sm transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Create Sacred Account
      </LoadingButton>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted-foreground/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-muted-foreground font-medium">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <LoadingButton
          type="button"
          variant="outline"
          loading={isSubmitting}
          disabled={isSubmitting}
          onClick={() => handleSocialLogin("Google")}
          className="h-11 border-muted-foreground/20 hover:border-primary/40 text-xs transform hover:scale-[1.02]"
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
        </LoadingButton>
        <LoadingButton
          type="button"
          variant="outline"
          loading={isSubmitting}
          disabled={isSubmitting}
          onClick={() => handleSocialLogin("Facebook")}
          className="h-11 border-muted-foreground/20 hover:border-primary/40 text-xs transform hover:scale-[1.02]"
        >
          <svg className="mr-2 h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </LoadingButton>
      </div>
    </form>
  )
})

const LoginForm = memo(function LoginForm({ loginForm, isSubmitting, handleSubmit }: any) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Email Address"
        id="login-email"
        type="email"
        placeholder="your.email@example.com"
        value={loginForm.formState.email.value}
        error={loginForm.formState.email.error}
        touched={loginForm.formState.email.touched}
        isValid={loginForm.formState.email.isValid}
        icon={<Mail className="h-4 w-4" />}
        disabled={isSubmitting}
        onChange={(value) => loginForm.updateField("email", value)}
        onBlur={() => loginForm.touchField("email")}
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Password</span>
          <LoadingButton variant="link" className="h-auto p-0 text-xs text-primary hover:text-primary/80">
            Forgot password?
          </LoadingButton>
        </div>
        <FormField
          label=""
          id="login-password"
          type="password"
          placeholder="Enter your password"
          value={loginForm.formState.password.value}
          error={loginForm.formState.password.error}
          touched={loginForm.formState.password.touched}
          isValid={loginForm.formState.password.isValid}
          icon={<Lock className="h-4 w-4" />}
          disabled={isSubmitting}
          onChange={(value) => loginForm.updateField("password", value)}
          onBlur={() => loginForm.touchField("password")}
        />
      </div>

      <LoadingButton
        type="submit"
        loading={isSubmitting}
        loadingText="Signing In..."
        disabled={!loginForm.isFormValid}
        className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium shadow-lg hover:shadow-xl text-sm transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sign In to Your Journey
      </LoadingButton>
    </form>
  )
})

export default function EnhancedHeroOptimized() {
  const [activeTab, setActiveTab] = useState("signup")
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState({ title: "", message: "" })

  // Form validation hooks
  const signupForm = useFormValidation({ name: "", email: "", mobile: "", password: "" }, signupRules)
  const loginForm = useFormValidation({ email: "", password: "" }, loginRules)

  const currentForm = activeTab === "signup" ? signupForm : loginForm

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentForm.validateForm()) {
      return
    }

    setIsSubmitting(true)
    setShowSuccess(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (activeTab === "signup") {
        setSuccessMessage({
          title: "Account Created Successfully!",
          message: "Welcome to DharmaSaathi! Please check your email to verify your account.",
        })
      } else {
        setSuccessMessage({
          title: "Welcome Back!",
          message: "You have successfully signed in to your spiritual journey.",
        })
      }

      setShowSuccess(true)
      currentForm.resetForm()
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSuccessMessage({
        title: `${provider} Login Successful!`,
        message: "You have successfully connected your account.",
      })
      setShowSuccess(true)
    } catch (error) {
      console.error("Social login error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="signup-form" className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-32">
      {/* Optimized Background */}
      <div className="absolute inset-0">
        <ParallaxContainerOptimized speed={0.1} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-white to-purple-50/60" />
        </ParallaxContainerOptimized>

        {/* Optimized Floating Elements */}
        <FloatingOrbOptimized
          className="top-20 left-10"
          size="w-96 h-96"
          color="bg-gradient-to-r from-primary/10 to-purple-200/20"
          delay={0}
        />
        <FloatingOrbOptimized
          className="bottom-10 right-10"
          size="w-80 h-80"
          color="bg-gradient-to-r from-rose-200/20 to-primary/10"
          delay={200}
        />
        <FloatingShapeOptimized className="top-32 right-1/4" delay={100} />
        <FloatingShapeOptimized className="bottom-32 left-1/3" delay={300} />
      </div>

      {/* Optimized Decorative Image */}
      <ParallaxContainerOptimized
        speed={0.3}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none"
      >
        <OptimizedImage
          src="/placeholder.svg?height=800&width=800"
          alt="Spiritual Background"
          width={800}
          height={800}
          className="w-full h-full object-contain"
          quality={60}
          sizes="800px"
        />
      </ParallaxContainerOptimized>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <ParallaxContainerOptimized speed={0.2}>
              <div className="space-y-4">
                <FadeIn delay={0}>
                  <div className="inline-block mb-6">
                    <div className="flex items-center space-x-3 glass-effect px-6 py-3 rounded-full shadow-lg">
                      <Heart className="h-6 w-6 text-primary animate-pulse" />
                      <span className="text-lg font-semibold text-primary">DharmaSaathi</span>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={100}>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    From Drama to <span className="text-primary">Dharma</span>
                  </h1>
                </FadeIn>

                <FadeIn delay={200}>
                  <p className="max-w-[600px] text-lg sm:text-xl text-muted-foreground md:text-2xl leading-relaxed">
                    Where Seekers Meet Their Soulmates
                  </p>
                </FadeIn>

                <FadeIn delay={300}>
                  <p className="max-w-[600px] text-muted-foreground leading-relaxed">
                    Join thousands of spiritual souls who have found their perfect match through our sacred platform.
                    Begin your journey from chaos to consciousness, from drama to dharma.
                  </p>
                </FadeIn>
              </div>
            </ParallaxContainerOptimized>

            <FadeIn delay={400}>
              <div className="flex flex-col gap-4 sm:flex-row">
                <LoadingButton
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Start Your Spiritual Journey
                </LoadingButton>
                <LoadingButton
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg border-primary/20 hover:border-primary/40 transform hover:scale-105"
                >
                  Watch Stories
                </LoadingButton>
              </div>
            </FadeIn>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-5 w-full">
            <SlideIn direction="right" delay={200}>
              <div className="glass-effect p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/30 max-w-md mx-auto lg:mx-0 backdrop-blur-xl">
                {showSuccess && (
                  <SuccessMessage
                    title={successMessage.title}
                    message={successMessage.message}
                    onClose={() => setShowSuccess(false)}
                    className="mb-6"
                  />
                )}

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

                  <TabsContent value="signup">
                    <SignupForm
                      signupForm={signupForm}
                      selectedCountryCode={selectedCountryCode}
                      setSelectedCountryCode={setSelectedCountryCode}
                      isSubmitting={isSubmitting}
                      handleSubmit={handleSubmit}
                      handleSocialLogin={handleSocialLogin}
                    />
                  </TabsContent>

                  <TabsContent value="login">
                    <LoginForm loginForm={loginForm} isSubmitting={isSubmitting} handleSubmit={handleSubmit} />
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
