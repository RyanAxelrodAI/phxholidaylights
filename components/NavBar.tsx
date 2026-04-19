'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-holiday-dark/90 to-transparent pointer-events-none">
      <Link
        href="/"
        className="pointer-events-auto flex items-center gap-2 text-holiday-gold font-bold text-lg tracking-wide hover:text-yellow-300 transition-colors"
      >
        <span className="text-2xl">🎄</span>
        <span className="hidden sm:inline">PHX Holiday Lights</span>
        <span className="sm:hidden">PHX Lights</span>
      </Link>

      <div className="pointer-events-auto flex items-center gap-2">
        {pathname !== '/submit' && (
          <Link
            href="/submit"
            className="flex items-center gap-1.5 bg-holiday-red hover:bg-holiday-red-light text-white text-sm font-semibold px-3 py-2 rounded-full shadow-lg transition-colors"
          >
            <span>+</span>
            <span className="hidden sm:inline">Submit a Location</span>
            <span className="sm:hidden">Submit</span>
          </Link>
        )}
        {pathname === '/submit' && (
          <Link
            href="/"
            className="text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-full transition-colors"
          >
            ← Back to Map
          </Link>
        )}
      </div>
    </nav>
  )
}
