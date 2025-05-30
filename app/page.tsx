import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Music, BookOpen } from "lucide-react"
import Image from "next/image"
import { getAlbums, getBlogPosts } from "@/lib/contentful"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"

export default async function HomePage() {
  // Fetch latest album and blog posts from Contentful
  const albums = await getAlbums()
  const blogPosts = await getBlogPosts()

  // Get the latest album (first in the array since they're ordered by release date)
  const latestAlbum = albums.length > 0 ? albums[0] : null

  // Get the latest 2 blog posts
  const latestPosts = blogPosts.slice(0, 2)

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with your uploaded image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/background-1.jpg')`,
              filter: "brightness(0.3) contrast(1.2)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
          <div className="absolute inset-0 bg-noise opacity-10" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* Artist Name */}
          <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-[0.1em] text-white drop-shadow-2xl">
            VOŽD JOVAN POGANI
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl mb-12 text-gray-200 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            Black Metal Artist
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200 font-medium shadow-xl">
              <Link href="/albums">
                <Music className="mr-2 h-5 w-5" />
                Latest Release
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black backdrop-blur-sm shadow-xl"
            >
              <Link href="/blog">
                <BookOpen className="mr-2 h-5 w-5" />
                News & Updates
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Album Section - Now Dynamic */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          {latestAlbum ? (
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                {latestAlbum.fields.coverImage && latestAlbum.fields.coverImage.length > 0 ? (
                  <div className="relative w-full max-w-lg mx-auto aspect-square">
                    <Image
                      src={`https:${latestAlbum.fields.coverImage[0].fields.file.url}`}
                      alt={`${latestAlbum.fields.title} Album Cover`}
                      fill
                      className="object-cover shadow-2xl rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-lg mx-auto aspect-square bg-zinc-800 rounded-lg flex items-center justify-center">
                    <Music className="w-24 h-24 text-zinc-600" />
                  </div>
                )}
              </div>
              <div className="space-y-6 order-1 lg:order-2">
                <div>
                  <h2 className="text-4xl md:text-5xl font-light mb-4 text-white">{latestAlbum.fields.title}</h2>
                  <p className="text-xl text-gray-400 mb-6">
                    Latest Album • {new Date(latestAlbum.fields.releaseDate).getFullYear()}
                  </p>
                </div>

                {latestAlbum.fields.description && (
                  <div className="text-gray-300 text-lg leading-relaxed prose prose-invert max-w-none">
                    {documentToReactComponents(latestAlbum.fields.description)}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-white text-black hover:bg-gray-200 shadow-xl">
                    <Link href="/albums">View Album Details</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-gray-400 text-gray-300 hover:bg-gray-800">
                    <a href="https://bandcamp.com" target="_blank" rel="noopener noreferrer">
                      Listen on Bandcamp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p className="text-xl">No albums available yet.</p>
              <p>Add your first album in Contentful!</p>
            </div>
          )}
        </div>
      </section>

      {/* News Section - Now Dynamic */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-12 text-white">Latest News</h2>

          {latestPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {latestPosts.map((post: any) => (
                <article key={post.sys.id} className="text-left bg-black/30 p-6 rounded-lg backdrop-blur-sm">
                  <div className="mb-4">
                    {post.fields.featuredImage ? (
                      <div className="relative w-full h-48">
                        <Image
                          src={`https:${post.fields.featuredImage.fields.file.url}`}
                          alt={post.fields.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-zinc-800 rounded flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-zinc-600" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-white">{post.fields.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {new Date(post.fields.publicationDate).toLocaleDateString()}
                  </p>
                  <div className="text-gray-300 leading-relaxed prose prose-invert max-w-none">
                    {post.fields.content && documentToReactComponents(post.fields.content)}
                  </div>
                  <Button asChild variant="link" className="text-white p-0 mt-3">
                    <Link href={`/blog/${post.fields.slug}`}>Read More</Link>
                  </Button>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p className="text-xl">No news available yet.</p>
              <p>Add your first blog post in Contentful!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
