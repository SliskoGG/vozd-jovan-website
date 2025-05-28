import { SocialLinks } from "@/components/social-links"

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-light tracking-wider text-white mb-4">VOZD JOVAN POGANI</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Official website of black metal artist Vozd Jovan Pogani.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-4">Navigation</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="/albums" className="hover:text-white transition-colors">
                  Albums
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-4">Connect</h4>
            <SocialLinks />
            <p className="text-gray-500 text-xs mt-4">Follow for latest updates and releases.</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Vozd Jovan Pogani. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
