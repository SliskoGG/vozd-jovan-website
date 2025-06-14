import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vozd Jovan Pogani - Black Metal",
  description: "Official website of Vozd Jovan Pogani - Black Metal artist",
  keywords: "black metal, atmospheric black metal, Vozd Jovan Pogani, dark music, extreme metal",
  openGraph: {
    title: "Vozd Jovan Pogani - Black Metal",
    description: "Official website of Vozd Jovan Pogani - Black Metal artist",
    url: "https://vozdjovanpogani.com",
    siteName: "Vozd Jovan Pogani",
    type: "website",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Radio Widget CSS */}
        <link rel="stylesheet" href="/css/radio-widget.css" />
      </head>
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>

        {/* Radio Widget */}
        <div className="radio-widget expanded" id="radioWidget">
          <div className="widget-header" onClick={() => {
            const widget = document.getElementById('radioWidget');
            const collapseBtn = document.getElementById('collapseBtn');
            if (widget?.classList.contains('collapsed')) {
              widget.classList.remove('collapsed');
              widget.classList.add('expanded');
              if (collapseBtn) collapseBtn.textContent = '−';
            } else {
              widget?.classList.remove('expanded');
              widget?.classList.add('collapsed');
              if (collapseBtn) collapseBtn.textContent = '+';
            }
          }}>
            <h3 className="widget-title">Radio</h3>
            <button className="collapse-btn" id="collapseBtn">−</button>
          </div>
          <div className="widget-content">
            <div className="now-playing">
              <div className="song-info">
                <div className="song-title" id="songTitle">Ready to play</div>
                <div className="song-artist" id="songArtist">Click play to start</div>
              </div>
            </div>
            <div className="controls">
              <button className="control-btn play-btn" id="playBtn" onClick={() => {
                if (typeof window !== 'undefined' && (window as any).radioPlayer) {
                  (window as any).radioPlayer.togglePlay();
                }
              }}>
                Play
              </button>
              <button className="control-btn" id="nextBtn" onClick={() => {
                if (typeof window !== 'undefined' && (window as any).radioPlayer) {
                  (window as any).radioPlayer.nextSong();
                }
              }}>
                Next
              </button>
              <button className="control-btn" id="shuffleBtn" onClick={() => {
                if (typeof window !== 'undefined' && (window as any).radioPlayer) {
                  (window as any).radioPlayer.toggleShuffle();
                }
              }}>
                Shuffle
              </button>
            </div>
            <div className="volume-container">
              <span className="volume-icon">♪</span>
              <input 
                type="range" 
                className="volume-slider" 
                id="volumeSlider" 
                min="0" 
                max="100" 
                defaultValue="70" 
                onChange={(e) => {
                  if (typeof window !== 'undefined' && (window as any).radioPlayer) {
                    (window as any).radioPlayer.setVolume(e.target.value);
                  }
                }}
              />
              <span className="volume-label" id="volumeDisplay">70%</span>
            </div>
            <div className="status" id="status">Ready</div>
          </div>
        </div>

        {/* Radio Widget JavaScript */}
        <script src="/js/radio-widget.js" defer></script>
      </body>
    </html>
  )
}
