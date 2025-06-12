import { UserPlus, Search, MessageCircle, Heart } from "lucide-react"

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-background/90">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Your Spiritual Journey</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            Four simple steps to find your spiritual partner
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-4 mt-16">
          {[
            {
              icon: <UserPlus className="h-8 w-8 text-primary" />,
              title: "Create Profile",
              description: "Share your spiritual journey, practices, and what you seek in a partner.",
            },
            {
              icon: <Search className="h-8 w-8 text-primary" />,
              title: "Discover Matches",
              description: "Our algorithm finds compatible spiritual seekers aligned with your path.",
            },
            {
              icon: <MessageCircle className="h-8 w-8 text-primary" />,
              title: "Mindful Connection",
              description: "Engage in meaningful conversations about spirituality and life goals.",
            },
            {
              icon: <Heart className="h-8 w-8 text-primary" />,
              title: "Begin Together",
              description: "Start your shared spiritual journey with your dharma partner.",
            },
          ].map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="absolute -inset-1 rounded-full bg-primary/10 blur-md" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              {index < 3 && (
                <div className="hidden md:block mt-6 h-0.5 w-full max-w-[100px] bg-gradient-to-r from-transparent via-muted to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
