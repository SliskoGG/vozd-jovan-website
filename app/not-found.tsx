import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-light text-white mb-4">404</h1>
        <h2 className="text-3xl font-light mb-4 text-white">Page Not Found</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist. Return to the main site or explore other sections.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-white text-black hover:bg-gray-200">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-gray-600 hover:bg-gray-800 text-gray-300">
            <Link href="/albums">
              <ArrowLeft className="mr-2 h-4 w-4" />
              View Albums
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
