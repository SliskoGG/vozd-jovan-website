import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Music, BookOpen } from "lucide-react"

export default function HomePage() {
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
            VOZD JOVAN POGANI
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

      {/* Latest Album Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="/images/album-cover.jpg"
                alt="Zlosutni Cetinari Srpske Album Cover"
                className="w-full max-w-lg mx-auto shadow-2xl rounded-lg"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <div>
                <h2 className="text-4xl md:text-5xl font-light mb-4 text-white">Zlosutni Cetinari Srpske</h2>
                <p className="text-xl text-gray-400 mb-6">Latest Album • 2024</p>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed">
                An atmospheric journey through the dark forests of Serbian folklore, where ancient spirits dwell among
                the evergreen trees. This album explores themes of nature, tradition, and the eternal struggle between
                light and darkness in the Balkan wilderness.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-white text-black hover:bg-gray-200 shadow-xl">
                  <Link href="/albums/zlosutni-cetinari-srpske">View Album Details</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-400 text-gray-300 hover:bg-gray-800">
                  <a href="https://bandcamp.com" target="_blank" rel="noopener noreferrer">
                    Listen on Bandcamp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-12 text-white">Latest News</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <article className="text-left bg-black/30 p-6 rounded-lg backdrop-blur-sm">
              <div className="mb-4">
                <img
                  src="/images/album-cover.jpg"
                  alt="Album Release News"
                  className="w-full h-48 object-cover rounded"
                />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">New Album "Zlosutni Cetinari Srpske" Released</h3>
              <p className="text-gray-400 text-sm mb-3">January 15, 2024</p>
              <p className="text-gray-300 leading-relaxed">
                After two years of intensive work in the Serbian wilderness, the new album exploring themes of ancient
                folklore and natural mysticism is now available across all platforms...
              </p>
              <Button asChild variant="link" className="text-white p-0 mt-3">
                <Link href="/blog/zlosutni-cetinari-srpske-release">Read More</Link>
              </Button>
            </article>

            <article className="text-left bg-black/30 p-6 rounded-lg backdrop-blur-sm">
              <div className="mb-4">
                <img src="/images/background-1.jpg" alt="Tour News" className="w-full h-48 object-cover rounded" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">Balkan Tour Dates Announced</h3>
              <p className="text-gray-400 text-sm mb-3">December 20, 2023</p>
              <p className="text-gray-300 leading-relaxed">
                Bringing the darkness to stages across the Balkans this spring. Experience the atmospheric black metal
                journey live in intimate venues throughout the region...
              </p>
              <Button asChild variant="link" className="text-white p-0 mt-3">
                <Link href="/blog/balkan-tour">Read More</Link>
              </Button>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
