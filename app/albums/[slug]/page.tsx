import { PageHeader } from "@/components/page-header"
import { LyricsDisplay } from "@/components/lyrics-display"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Clock } from "lucide-react"
import { notFound } from "next/navigation"

const albumsData = {
  "zlosutni-cetinari-srpske": {
    title: "Zlosutni Cetinari Srpske",
    year: 2024,
    image: "/images/album-cover.jpg",
    description:
      "An atmospheric journey through the dark forests of Serbian folklore, where ancient spirits dwell among the evergreen trees. This album explores themes of nature, tradition, and the eternal struggle between light and darkness in the Balkan wilderness.",
    tracks: [
      {
        number: 1,
        title: "Uvod u Tamu",
        duration: "6:42",
        lyrics: `U dubini šume gde senke se kriju
Drevni duhovi šapću priče stare
Četinari čuvaju tajne davne
Gde tama vlada večno nad zemljom

[Refren]
Zlosutni četinari srpske zemlje
U mraku čuvaju drevne reči
Kroz vetrove hladne nose poruke
Od predaka što su davno prošli`,
      },
      {
        number: 2,
        title: "Šapati Vetra",
        duration: "5:28",
        lyrics: `Kroz grane borova vetar prolazi
Noseći glasove iz prošlosti
Stare legende oživljavaju
U šumi gde vreme stoji

[Refren]
Čuj šapate vetra kroz četinare
Priče o vremenima davno prošlim
U tišini noći otkrivaju se
Tajne što ih čuva srpska zemlja`,
      },
      {
        number: 3,
        title: "Večna Zima",
        duration: "7:15",
        lyrics: `Sneg pokriva staze zaboravljene
Gde su nekad hodili naši preci
Zima večna vlada ovim krajem
Čuvajući memorije davne

[Refren]
U večnoj zimi spavaju duše
Onih što su branili ovu zemlju
Četinari pamte njihove korake
I čuvaju ih od zaborava`,
      },
    ],
  },
}

export default function AlbumPage({ params }: { params: { slug: string } }) {
  const album = albumsData[params.slug as keyof typeof albumsData]

  if (!album) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <PageHeader title={album.title} subtitle={`Released ${album.year}`} backgroundImage="/images/album-cover.jpg" />

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            <div>
              <img
                src={album.image || "/placeholder.svg"}
                alt={`${album.title} album cover`}
                className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
              />
            </div>
            <div>
              <h1 className="text-4xl font-light mb-4 text-white">{album.title}</h1>
              <p className="text-xl text-gray-400 mb-6">{album.year}</p>
              <p className="text-gray-300 mb-8 leading-relaxed">{album.description}</p>

              <div className="flex gap-4 mb-8">
                <Button asChild size="lg" variant="outline" className="border-gray-600 hover:bg-gray-800 text-gray-300">
                  <a href="https://bandcamp.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Listen on Bandcamp
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-light mb-8 text-white">Tracklist</h2>
            <div className="space-y-4">
              {album.tracks.map((track) => (
                <Card key={track.number} className="bg-black/50 border-gray-700 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-light text-gray-400 w-8">{track.number}</span>
                        <div>
                          <h3 className="text-xl font-light text-white">{track.title}</h3>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span>{track.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <LyricsDisplay lyrics={track.lyrics} trackTitle={track.title} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
