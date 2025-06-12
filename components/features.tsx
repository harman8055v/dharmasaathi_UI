import { Heart, Shield, Eye, BookOpen, NotebookIcon as Lotus } from "lucide-react"

export default function Features() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background/80 to-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
            <Lotus className="inline-block w-4 h-4 mr-2" />
            Our Features
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Mindful Connections</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            Discover how DharmaSaathi helps spiritual seekers find their perfect match
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16 mt-16">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-rose-50 to-white p-8">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-rose-100/80 blur-2xl" />
            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                <Heart className="h-6 w-6 text-rose-500" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Spiritual Compatibility</h3>
              <p className="mt-2 text-muted-foreground">
                Our unique algorithm matches you based on spiritual practices, beliefs, and life goals, not just
                superficial traits.
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-blue-50 to-white p-8">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-100/80 blur-2xl" />
            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Shield className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="mt-4 text-xl font-bold">KYC Privacy</h3>
              <p className="mt-2 text-muted-foreground">
                Your personal information is sacred. Our KYC process verifies identities while maintaining your privacy
                and security.
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-purple-50 to-white p-8">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-purple-100/80 blur-2xl" />
            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Eye className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Who Liked Me</h3>
              <p className="mt-2 text-muted-foreground">
                Discover who resonates with your energy. Our mindful approach to connections helps you find mutual
                spiritual attraction.
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50 to-white p-8">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-amber-100/80 blur-2xl" />
            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <BookOpen className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Real Stories</h3>
              <p className="mt-2 text-muted-foreground">
                Read authentic stories from spiritual couples who found their soulmates through our platform and began
                their journey together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
