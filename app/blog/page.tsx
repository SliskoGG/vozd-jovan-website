import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"

const blogPosts = [
  {
    slug: "zlosutni-cetinari-srpske-release",
    title: "New Album 'Zlosutni Cetinari Srpske' Released",
    excerpt:
      "After two years of intensive work in the Serbian wilderness, exploring themes of ancient folklore and natural mysticism...",
    date: "2024-01-15",
    readTime: "8 min read",
    image: "/images/album-cover.jpg",
    category: "Release",
  },
  {
    slug: "balkan-tour",
    title: "Balkan Tour Dates Announced",
    excerpt: "Bringing the atmospheric black metal experience to intimate venues across the Balkans this spring...",
    date: "2024-01-08",
    readTime: "5 min read",
    image: "/images/background-1.jpg",
    category: "Tour",
  },
  {
    slug: "black-metal-evolution",
    title: "The Evolution of Atmospheric Black Metal",
    excerpt: "Exploring how the genre has evolved from its Norwegian roots to embrace diverse cultural influences...",
    date: "2023-12-22",
    readTime: "12 min read",
    image: "/placeholder.svg?height=300&width=600",
    category: "Article",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <PageHeader title="Blog" subtitle="News & Articles" backgroundImage="/images/background-1.jpg" />

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {blogPosts.map((post) => (
              <Card
                key={post.slug}
                className="bg-black/50 border-gray-700 hover:border-gray-500 transition-all duration-300 group backdrop-blur-sm"
              >
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-3 gap-0">
                    <div className="md:col-span-1">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="md:col-span-2 p-6">
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs uppercase tracking-wider">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <h2 className="text-2xl font-light mb-3 text-white group-hover:text-gray-200 transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-gray-300 mb-4 leading-relaxed">{post.excerpt}</p>

                      <Button asChild className="bg-white text-black hover:bg-gray-200">
                        <Link href={`/blog/${post.slug}`}>
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
