"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface LyricsDisplayProps {
  lyrics: string
  trackTitle: string
}

export function LyricsDisplay({ lyrics, trackTitle }: LyricsDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-t border-gray-700 pt-4">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-gray-400 hover:text-white p-0 h-auto font-normal"
      >
        {isExpanded ? (
          <>
            Hide Lyrics <ChevronUp className="ml-2 h-4 w-4" />
          </>
        ) : (
          <>
            Show Lyrics <ChevronDown className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      {isExpanded && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-lg font-light mb-3 text-white">"{trackTitle}" Lyrics</h4>
          <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">{lyrics}</pre>
        </div>
      )}
    </div>
  )
}
