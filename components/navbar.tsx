"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { SocialLinks } from "@/components/social-links"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Albums", href: "/albums" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Empty */}
          <div className="w-1/3"></div>

          {/* Center - Navigation */}
          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-gray-300 hover:text-white transition-colors duration-200 font-medium uppercase text-sm tracking-wider",
                  pathname === item.href && "text-white",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side - Social links and mailing list */}
          <div className="hidden md:flex items-center justify-end space-x-4 w-1/3">
            <SocialLinks />
            <Button asChild size="sm" className="bg-amber-500 text-black hover:bg-amber-400 font-medium ml-4">
              <Link href="/contact">MAILING LIST</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200 uppercase text-sm tracking-wider",
                    pathname === item.href && "text-white",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <SocialLinks />
              </div>
              <div className="px-3 py-2">
                <Button asChild size="sm" className="bg-amber-500 text-black hover:bg-amber-400 font-medium w-full">
                  <Link href="/contact">MAILING LIST</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
