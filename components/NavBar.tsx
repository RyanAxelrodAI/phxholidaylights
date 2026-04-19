'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="absolute top-0 left-0 right-0 z-10 flex items-center px-4 py-3 bg-white/90 backdrop-blur shadow-sm pointer-events-none">
      {/* Left — spacer to balance the right side */}
      <div className="flex-1 pointer-events-auto">
        {pathname === '/submit' && (
          <Link
            href="/"
            className="text-black/60 hover:text-black text-sm font-medium px-2 py-1 rounded-full transition-colors"
          >
            ← Back
          </Link>
        )}
      </div>

      {/* Center — title */}
      <Link
        href="/"
        className="pointer-events-auto flex items-center gap-2 text-black font-bold text-lg tracking-wide hover:opacity-70 transition-opacity"
      >
        <span className="text-2xl">🎄</span>
        <span className="hidden sm:inline">PHX Holiday Lights</span>
        <span className="sm:hidden">PHX Lights</span>
      </Link>

      {/* Right — submit button */}
      <div className="flex-1 flex justify-end pointer-events-auto">
        {pathname !== '/submit' && (
          <Link
            href="/submit"
            className="flex items-center gap-1.5 bg-holiday-red hover:bg-holiday-red-light text-white text-sm font-semibold px-3 py-2 rounded-full shadow transition-colors"
          >
            <span>+</span>
            <span className="hidden sm:inline">Submit a Location</span>
            <span className="sm:hidden">Submit</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
