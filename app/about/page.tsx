import { PageHeader } from "@/components/page-header"
import { SocialLinks } from "@/components/social-links"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <PageHeader title="About" subtitle="The Artist Behind the Music" backgroundImage="/images/background-1.jpg" />

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-black/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-light mb-6 text-white">The Journey</h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                      Vozd Jovan Pogani emerged from the depths of Serbian wilderness in 2020, born from a profound
                      connection to the ancient forests and forgotten folklore of the Balkans. What began as solitary
                      compositions in remote mountain cabins has evolved into a full exploration of atmospheric black
                      metal that honors both tradition and innovation.
                    </p>
                    <p>
                      Drawing inspiration from the raw beauty of Serbian nature and the rich tapestry of Slavic
                      mythology, the music serves as a bridge between the ancient world and modern consciousness. Each
                      composition is crafted to transport listeners into the heart of the wilderness, where old spirits
                      still roam among the evergreen trees.
                    </p>
                    <p>
                      The artistic vision centers on authenticity and respect for the natural world. Every album is
                      conceived as a complete journey, from the initial inspiration found in mountain solitude to the
                      final recording that captures the essence of the Serbian landscape.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-light mb-6 text-white">Musical Philosophy</h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                      Black metal, at its core, represents a return to the primal connection between humanity and
                      nature. The approach combines traditional atmospheric black metal elements with field recordings
                      and natural soundscapes captured in the Serbian wilderness.
                    </p>
                    <p>
                      The creative process often begins in solitude, deep in the forest where the silence between sounds
                      becomes as important as the music itself. Whether recording the whisper of wind through pine
                      branches or the distant call of mountain wildlife, these natural elements find their way into
                      every composition.
                    </p>
                    <p>
                      Each song serves as a ritual, each album as a testament to the enduring power of the natural
                      world. The goal is not merely to create music, but to craft doorways through which others can
                      access the profound peace and ancient wisdom found in the wilderness.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="bg-black/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <img src="/images/background-1.jpg" alt="Vozd Jovan Pogani" className="w-full rounded-lg mb-6" />
                  <h3 className="text-xl font-light mb-4 text-white">Connect</h3>
                  <p className="text-gray-300 mb-6 text-sm">
                    Follow the journey through the wilderness and discover new realms of atmospheric black metal.
                  </p>
                  <SocialLinks />
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-light mb-4 text-white">Influences</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Burzum</li>
                    <li>• Darkthrone</li>
                    <li>• Paysage d'Hiver</li>
                    <li>• Wolves in the Throne Room</li>
                    <li>• Blut Aus Nord</li>
                    <li>• Serbian Folk Traditions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-light mb-4 text-white">Equipment</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• ESP LTD EC-1000</li>
                    <li>• Orange Dark Terror</li>
                    <li>• Tama Imperialstar</li>
                    <li>• Audio-Technica AT2020</li>
                    <li>• Reaper DAW</li>
                    <li>• Field Recording Equipment</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
