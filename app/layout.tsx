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
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
