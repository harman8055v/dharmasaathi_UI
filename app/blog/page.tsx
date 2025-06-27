import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ArrowRight, BookOpen, Heart } from "lucide-react"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"

const blogPosts = [
  {
    id: 1,
    title: "The Sacred Art of Conscious Dating",
    excerpt:
      "Discover how to approach dating with mindfulness, intention, and spiritual awareness to attract your divine counterpart.",
    author: "Priya Sharma",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Conscious Living",
    image: "/placeholder.svg?height=300&width=500&text=Conscious+Dating",
  },
  {
    id: 2,
    title: "Understanding Dharma in Relationships",
    excerpt:
      "Explore how shared dharma creates the foundation for lasting spiritual partnerships and conscious unions.",
    author: "Arjun Patel",
    date: "2024-01-10",
    readTime: "12 min read",
    category: "Spiritual Wisdom",
    image: "/placeholder.svg?height=300&width=500&text=Dharma+Relationships",
  },
  {
    id: 3,
    title: "Meditation Practices for Couples",
    excerpt: "Learn powerful meditation techniques that deepen intimacy and spiritual connection between partners.",
    author: "Ananda Devi",
    date: "2024-01-05",
    readTime: "10 min read",
    category: "Practices",
    image: "/placeholder.svg?height=300&width=500&text=Couples+Meditation",
  },
  {
    id: 4,
    title: "Navigating Spiritual Differences in Love",
    excerpt: "How to honor different spiritual paths while building a harmonious relationship based on mutual respect.",
    author: "Vikram Singh",
    date: "2023-12-28",
    readTime: "15 min read",
    category: "Relationships",
    image: "/placeholder.svg?height=300&width=500&text=Spiritual+Differences",
  },
  {
    id: 5,
    title: "The Power of Sacred Rituals in Partnership",
    excerpt:
      "Creating meaningful rituals that strengthen your bond and invite divine blessings into your relationship.",
    author: "Lakshmi Gupta",
    date: "2023-12-20",
    readTime: "7 min read",
    category: "Sacred Practices",
    image: "/placeholder.svg?height=300&width=500&text=Sacred+Rituals",
  },
  {
    id: 6,
    title: "Healing Past Wounds for New Love",
    excerpt: "A spiritual approach to releasing past relationship trauma and opening your heart to divine love.",
    author: "Ravi Kumar",
    date: "2023-12-15",
    readTime: "11 min read",
    category: "Healing",
    image: "/placeholder.svg?height=300&width=500&text=Healing+Love",
  },
]

const categories = [
  "All",
  "Conscious Living",
  "Spiritual Wisdom",
  "Practices",
  "Relationships",
  "Sacred Practices",
  "Healing",
]

export default function BlogPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-rose-500/10" />
          <div className="container px-4 md:px-6 relative">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-rose-600 bg-clip-text text-transparent">
                Spiritual Blog
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Wisdom, insights, and guidance for your journey of conscious love and spiritual partnership
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={category === "All" ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Article</h2>
                <p className="text-xl text-muted-foreground">
                  Our most popular spiritual wisdom for conscious relationships
                </p>
              </div>

              <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-white to-primary/5">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <Image
                      src="/placeholder.svg?height=400&width=600&text=Featured+Article"
                      alt="Featured Article"
                      width={600}
                      height={400}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8 md:p-12">
                    <Badge className="mb-4">{blogPosts[0].category}</Badge>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">{blogPosts[0].title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{blogPosts[0].excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {blogPosts[0].author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(blogPosts[0].date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {blogPosts[0].readTime}
                      </div>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90">
                      Read Full Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-transparent to-primary/5">
          <div className="container px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Articles</h2>
                <p className="text-xl text-muted-foreground">Fresh insights for your spiritual journey</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.slice(1).map((post) => (
                  <Card
                    key={post.id}
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4">{post.category}</Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                      </div>
                      <Button variant="ghost" className="p-0 h-auto font-semibold text-primary hover:text-primary/80">
                        Read More
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 to-rose-500/10">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Stay Connected to Sacred Wisdom</h2>
              <p className="text-xl text-muted-foreground">
                Receive our latest articles and spiritual insights directly in your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-input bg-background"
                />
                <Button className="bg-primary hover:bg-primary/90">Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
