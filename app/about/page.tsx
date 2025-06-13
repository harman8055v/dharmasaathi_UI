import { Heart, Users, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-maroon-800 dark:text-maroon-300 mb-6">
              About DharmaSaathi
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Connecting souls on their spiritual journey to find meaningful, dharma-aligned partnerships.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
              <Heart className="w-12 h-12 text-maroon-700 dark:text-maroon-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Authentic Connections</h3>
              <p className="text-slate-600 dark:text-slate-400">
                We believe in genuine relationships built on shared spiritual values and authentic self-expression.
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
              <Compass className="w-12 h-12 text-maroon-700 dark:text-maroon-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Spiritual Alignment</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Find partners who share your spiritual path, practices, and understanding of life's deeper meaning.
              </p>
            </div>

            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
              <Users className="w-12 h-12 text-maroon-700 dark:text-maroon-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Conscious Community</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Join a community of mindful individuals seeking meaningful relationships and personal growth.
              </p>
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 shadow-lg mb-16">
            <h2 className="text-3xl font-light text-maroon-800 dark:text-maroon-300 mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-slate-600 dark:text-slate-400">
              <p className="mb-6">
                DharmaSaathi was born from the understanding that finding a life partner who shares your spiritual
                journey is one of life's most profound quests. In a world where superficial connections often overshadow
                deeper compatibility, we created a space for souls seeking authentic, dharma-aligned relationships.
              </p>
              <p className="mb-6">
                Our platform goes beyond traditional matchmaking by focusing on spiritual compatibility, shared values,
                and the deeper aspects of human connection that create lasting, meaningful partnerships.
              </p>
              <p>
                Whether you're following the path of meditation, yoga, service, or any spiritual practice, DharmaSaathi
                helps you find someone who not only understands your journey but walks alongside you in growth and
                consciousness.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-2xl font-light text-slate-800 dark:text-slate-200 mb-6">
              Ready to Find Your DharmaSaathi?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding">
                <Button className="bg-maroon-800 hover:bg-maroon-700 text-white px-8 py-3">Start Your Journey</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="border-maroon-700 text-maroon-700 hover:bg-maroon-50 px-8 py-3">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
