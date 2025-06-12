import { Heart, Shield, Eye, BookOpen } from "lucide-react"

export default function FeaturesMinimal() {
  const features = [
    {
      icon: <Heart className="h-6 md:h-8 w-6 md:w-8 text-primary" />,
      title: "Spiritual Compatibility",
      description:
        "Our unique algorithm matches you based on spiritual practices, beliefs, and life goals, creating connections that transcend the superficial.",
    },
    {
      icon: <Shield className="h-6 md:h-8 w-6 md:w-8 text-primary" />,
      title: "Sacred Privacy",
      description:
        "Your personal information is sacred. Our advanced KYC process verifies identities while maintaining your privacy and security at the highest level.",
    },
    {
      icon: <Eye className="h-6 md:h-8 w-6 md:w-8 text-primary" />,
      title: "Mutual Resonance",
      description:
        "Discover who resonates with your spiritual energy. Our mindful approach reveals mutual attraction and spiritual compatibility.",
    },
    {
      icon: <BookOpen className="h-6 md:h-8 w-6 md:w-8 text-primary" />,
      title: "Sacred Stories",
      description:
        "Read authentic stories from spiritual couples who found their soulmates and began their transformative journey together.",
    },
  ]

  return (
    <section
      id="features"
      className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-background/80 to-background relative overflow-hidden"
    >
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
          <div className="inline-block rounded-full glass-effect px-4 md:px-6 py-2 md:py-3 text-sm shadow-lg">
            <span className="font-semibold text-primary">Our Sacred Features</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl">
            Mindful Connections
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-base md:text-lg lg:text-xl leading-relaxed px-4">
            Discover how DharmaSaathi helps spiritual seekers find their perfect match through sacred technology
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-rose-50/80 to-white/90 p-6 md:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:scale-[1.02]"
            >
              <div className="relative">
                <div className="inline-flex h-12 md:h-16 w-12 md:w-16 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-r from-primary/10 to-rose-100 shadow-lg transform transition-all duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="mt-4 md:mt-6 text-xl md:text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                  {feature.title}
                </h3>
                <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
