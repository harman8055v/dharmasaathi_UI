import { Heart, Shield, Eye, BookOpen, NotebookIcon as Lotus } from "lucide-react"
import Image from "next/image"

export default function Features() {
  return (
    <section
      id="features"
      className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-background/80 to-background relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <Image
          src="/placeholder.svg?height=600&width=1200"
          alt="Background Pattern"
          width={1200}
          height={600}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
          <div className="inline-block rounded-full glass-effect px-4 md:px-6 py-2 md:py-3 text-sm shadow-lg">
            <Lotus className="inline-block w-4 md:w-5 h-4 md:h-5 mr-2 text-primary" />
            <span className="font-semibold text-primary">Our Sacred Features</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Mindful Connections
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-base md:text-lg lg:text-xl leading-relaxed px-4">
            Discover how DharmaSaathi helps spiritual seekers find their perfect match through sacred technology
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Feature cards with improved mobile spacing */}
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-rose-50/80 to-white/90 p-6 md:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 md:h-32 w-24 md:w-32 rounded-full bg-gradient-to-r from-primary/20 to-rose-200/30 blur-2xl group-hover:blur-xl transition-all duration-300" />
            <div className="relative">
              <div className="inline-flex h-12 md:h-16 w-12 md:w-16 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-r from-primary/10 to-rose-100 shadow-lg">
                <Heart className="h-6 md:h-8 w-6 md:w-8 text-primary" />
              </div>
              <h3 className="mt-4 md:mt-6 text-xl md:text-2xl font-bold text-foreground">Spiritual Compatibility</h3>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                Our unique algorithm matches you based on spiritual practices, beliefs, and life goals, creating
                connections that transcend the superficial.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary/5 to-white/90 p-6 md:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 md:h-32 w-24 md:w-32 rounded-full bg-gradient-to-r from-primary/20 to-purple-200/30 blur-2xl group-hover:blur-xl transition-all duration-300" />
            <div className="relative">
              <div className="inline-flex h-12 md:h-16 w-12 md:w-16 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-r from-primary/10 to-purple-100 shadow-lg">
                <Shield className="h-6 md:h-8 w-6 md:w-8 text-primary" />
              </div>
              <h3 className="mt-4 md:mt-6 text-xl md:text-2xl font-bold text-foreground">Sacred Privacy</h3>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                Your personal information is sacred. Our advanced KYC process verifies identities while maintaining your
                privacy and security at the highest level.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-purple-50/80 to-white/90 p-6 md:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 md:h-32 w-24 md:w-32 rounded-full bg-gradient-to-r from-purple-200/30 to-primary/20 blur-2xl group-hover:blur-xl transition-all duration-300" />
            <div className="relative">
              <div className="inline-flex h-12 md:h-16 w-12 md:w-16 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-100 to-primary/10 shadow-lg">
                <Eye className="h-6 md:h-8 w-6 md:w-8 text-primary" />
              </div>
              <h3 className="mt-4 md:mt-6 text-xl md:text-2xl font-bold text-foreground">Mutual Resonance</h3>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                Discover who resonates with your spiritual energy. Our mindful approach reveals mutual attraction and
                spiritual compatibility.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-amber-50/80 to-white/90 p-6 md:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 md:h-32 w-24 md:w-32 rounded-full bg-gradient-to-r from-amber-200/30 to-primary/20 blur-2xl group-hover:blur-xl transition-all duration-300" />
            <div className="relative">
              <div className="inline-flex h-12 md:h-16 w-12 md:w-16 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-r from-amber-100 to-primary/10 shadow-lg">
                <BookOpen className="h-6 md:h-8 w-6 md:w-8 text-primary" />
              </div>
              <h3 className="mt-4 md:mt-6 text-xl md:text-2xl font-bold text-foreground">Sacred Stories</h3>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                Read authentic stories from spiritual couples who found their soulmates and began their transformative
                journey together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
