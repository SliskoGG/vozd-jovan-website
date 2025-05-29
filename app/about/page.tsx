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
                      Vozd Jovan Pogani bio goes here.
                    </p>
                    <p>
                      Vozd Jovan Pogani bio goes here.
                    </p>
                    <p>
                      Vozd Jovan Pogani bio goes here.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-light mb-6 text-white">Musical Philosophy</h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                      Vozd Jovan Pogani bio goes here.
                    </p>
                    <p>
                      Vozd Jovan Pogani bio goes here.
                    </p>
                    <p>
                      Vozd Jovan Pogani bio goes here.
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
