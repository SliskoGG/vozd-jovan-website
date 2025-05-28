"use client"

import { Button } from "@/components/ui/button"
import { LinkIcon } from "lucide-react"

interface SocialShareProps {
  title: string
}

export function SocialShare({ title }: SocialShareProps) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
  }

  return (
    <div className="flex gap-3">
      <Button
        onClick={copyToClipboard}
        size="sm"
        variant="outline"
        className="border-gray-600 hover:bg-gray-800 text-gray-300"
      >
        <LinkIcon className="h-4 w-4 mr-2" />
        Copy Link
      </Button>
    </div>
  )
}
