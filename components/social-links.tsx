import { Button } from "@/components/ui/button"
import { Youtube, Music, Globe } from "lucide-react"

interface SocialLinksProps {
  size?: "sm" | "lg"
}

export function SocialLinks({ size = "sm" }: SocialLinksProps) {
  const iconSize = size === "lg" ? "h-5 w-5" : "h-4 w-4"

  return (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <Youtube className={iconSize} />
        </a>
      </Button>

      <Button asChild size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
        <a href="https://bandcamp.com" target="_blank" rel="noopener noreferrer" aria-label="Bandcamp">
          <Music className={iconSize} />
        </a>
      </Button>

      <Button asChild size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
        <a href="https://metal-archives.com" target="_blank" rel="noopener noreferrer" aria-label="Metal Archives">
          <Globe className={iconSize} />
        </a>
      </Button>
    </div>
  )
}
