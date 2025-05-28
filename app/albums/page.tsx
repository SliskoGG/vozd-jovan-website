import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

const albums = [
  {
    id: "zlosutni-cetinari-srpske",
    title: "Zlosutni Cetinari Srpske",
    year: 2024,
    image: "/images/album-cover.jpg",
    description: "An atmospheric journey through the dark forests of Serbian folklore.",
    tracks: 8,
  },
  {
    id: "shadows-of-the-void",
    title: "Shadows of the Void",
    year: 2023,
    image: "/placeholder.svg?height=400&width=400",
    description: "Exploring the depths of cosmic horror and existential dread.",
    tracks: 6,
  },
  {
    id: "blood-moon-rising",
    title: "Blood Moon Rising",
    year: 2022,
    image: "/placeholder.svg?height=400&width=400",
    description: "Raw black metal fury under the crimson lunar eclipse.",
    tracks: 7,
  },
]

export default function AlbumsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <PageHeader title="Albums" subtitle="Discography" backgroundImage="/images/background-1.jpg" />

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <Card
                key={album.id}
                className="bg-black/50 border-gray-700 hover:border-gray-500 transition-all duration-300 group backdrop-blur-sm"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={album.image || "/placeholder.svg"}
                      alt={`${album.title} album cover`}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200">
                        <Link href={`/albums/${album.id}`}>View Album</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-light mb-2 text-white">{album.title}</h3>
                    <p className="text-gray-400 mb-3">
                      {album.year} • {album.tracks} tracks
                    </p>
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">{album.description}</p>

                    <div className="flex gap-2">
                      <Button asChild size="sm" className="bg-white text-black hover:bg-gray-200">
                        <Link href={`/albums/${album.id}`}>View Details</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="border-gray-600 hover:bg-gray-800">
                        <a href="https://bandcamp.com" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Bandcamp
                        </a>
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
