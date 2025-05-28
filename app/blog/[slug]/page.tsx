import { PageHeader } from "@/components/page-header"
import { SocialShare } from "@/components/social-share"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

const blogPostsData = {
  "zlosutni-cetinari-srpske-release": {
    title: "New Album 'Zlosutni Cetinari Srpske' Released",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Release",
    image: "/images/album-cover.jpg",
    content: `
      <p>After two years of intensive work in the Serbian wilderness, the new album "Zlosutni Cetinari Srpske" is finally available. This atmospheric black metal journey explores the deep connection between ancient Serbian folklore and the eternal darkness of the evergreen forests.</p>

      <h2>Inspiration from the Wilderness</h2>
      <p>The album was conceived during long walks through the dense forests of Serbia, where the ancient spirits of the land still whisper their forgotten tales. Each track represents a different aspect of this mystical landscape, from the towering pines that have stood for centuries to the hidden valleys where old traditions still echo.</p>

      <p>The recording process took place in a remote cabin, surrounded by the very forests that inspired the music. This isolation allowed for a pure connection to the natural world, resulting in an authentic atmospheric sound that captures the essence of the Serbian wilderness.</p>

      <h2>Musical Journey</h2>
      <p>The album features eight tracks that flow seamlessly from one to the next, creating an immersive experience that transports the listener deep into the heart of the forest. Traditional black metal elements are woven together with atmospheric passages and field recordings captured in the wilderness.</p>

      <p>This release marks a significant evolution in the artistic journey, embracing both the raw power of black metal and the subtle beauty of nature's darker aspects.</p>
    `,
  },
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPostsData[params.slug as keyof typeof blogPostsData]

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <PageHeader title={post.title} subtitle={`${post.category} • ${post.readTime}`} backgroundImage={post.image} />

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button asChild variant="outline" className="border-gray-600 hover:bg-gray-800 text-gray-300">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <article className="prose prose-invert max-w-none">
            <div className="flex items-center gap-4 mb-8 text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs uppercase tracking-wider">
                {post.category}
              </span>
            </div>

            <div
              className="text-gray-300 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <h3 className="text-xl font-light mb-4 text-white">Share this post</h3>
            <SocialShare title={post.title} />
          </div>
        </div>
      </section>
    </div>
  )
}
