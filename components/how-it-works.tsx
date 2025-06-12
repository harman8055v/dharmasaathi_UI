import { UserPlus, Search, MessageCircle, Heart } from "lucide-react"
import FadeIn from "@/components/animated/fade-in"
import StaggerContainer from "@/components/animated/stagger-container"
import Counter from "@/components/animated/counter"
import ParallaxContainer from "@/components/parallax/parallax-container"
import { FloatingOrb } from "@/components/parallax/floating-elements"

export default function HowItWorks() {
  const steps = [
    {
      icon: <UserPlus className="h-6 md:h-8 w-6 md:w-8 text-primary" />,
      title: "Create Profile",
      description: "Share your spiritual journey, practices, and what you seek in a partner.",
    },
    {
      icon: <Search className="h-6 md:h-8 w-6 md:w-8 text-primary" />,
      title: "Discover Matches",
      description: "Our algorithm finds compatible spiritual seekers aligned with your path.",
    },
    {
      icon: <MessageCircle className="h-6 md:h-8 w-6 md:w-8 text-primary" />,
      title: "Mindful Connection",
      description: "Engage in meaningful conversations about spirituality and life goals.",
    },
    {
      icon: <Heart className="h-6 md:h-8 w-6 md:w-8 text-primary" />,
      title: "Begin Together",
      description: "Start your shared spiritual journey with your dharma partner.",
    },
  ]

  return (
    <section
      id="how-it-works"
      className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-background to-background/90 relative overflow-hidden"
    >
      {/* Parallax Background Elements */}
      <FloatingOrb
        className="top-16 left-16"
        size="w-48 h-48"
        color="bg-gradient-to-r from-primary/8 to-purple-100/15"
        delay={0}
      />
      <FloatingOrb
        className="bottom-16 right-16"
        size="w-56 h-56"
        color="bg-gradient-to-r from-rose-100/15 to-primary/8"
        delay={2000}
      />

      <div className="container px-4 md:px-6 relative z-10">
        <ParallaxContainer speed={0.1}>
          <FadeIn>
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl">
                Your Spiritual Journey
              </h2>
              <p className="max-w-[700px] text-muted-foreground text-base md:text-lg lg:text-xl leading-relaxed px-4">
                Four simple steps to find your spiritual partner
              </p>
            </div>
          </FadeIn>
        </ParallaxContainer>

        {/* Stats Section with Parallax */}
        <ParallaxContainer speed={0.05}>
          <FadeIn delay={400}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  <Counter end={10000} suffix="+" />
                </div>
                <p className="text-sm text-muted-foreground">Spiritual Seekers</p>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  <Counter end={2500} suffix="+" />
                </div>
                <p className="text-sm text-muted-foreground">Sacred Unions</p>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  <Counter end={50} suffix="+" />
                </div>
                <p className="text-sm text-muted-foreground">Countries</p>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  <Counter end={98} suffix="%" />
                </div>
                <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
              </div>
            </div>
          </FadeIn>
        </ParallaxContainer>

        <ParallaxContainer speed={0.08}>
          <StaggerContainer
            staggerDelay={150}
            className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6"
          >
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="relative mb-4 md:mb-6">
                  <div className="absolute -inset-1 rounded-full bg-primary/10 blur-md group-hover:bg-primary/20 transition-all duration-300" />
                  <div className="relative flex h-14 md:h-16 w-14 md:w-16 items-center justify-center rounded-full bg-white shadow-sm group-hover:shadow-lg transform transition-all duration-300 group-hover:scale-110">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed px-2">{step.description}</p>
                {index < 3 && (
                  <div className="hidden lg:block mt-6 h-0.5 w-full max-w-[100px] bg-gradient-to-r from-transparent via-muted to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </div>
            ))}
          </StaggerContainer>
        </ParallaxContainer>
      </div>
    </section>
  )
}
