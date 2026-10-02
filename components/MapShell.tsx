'use client'

import dynamic from 'next/dynamic'
import type { Location } from '@/lib/types'

// Next 15 does not allow `dynamic(..., { ssr: false })` inside a Server Component, and
// app/page.tsx must stay a Server Component (it does `await getLocationsFromSheet()` and
// sets `export const revalidate = 300`). Both of these genuinely are browser-only:
// Map.tsx uses Leaflet, which needs `window`, and AddToHomeScreen listens for
// `beforeinstallprompt`. So the client-only boundary moves here instead of disappearing.
// (Malik, 2026-10-02, Next 14 -> 15 migration.)

const MapView = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-holiday-dark">
      <div className="text-center">
        <div className="text-5xl animate-pulse mb-3">🎄</div>
        <p className="text-white/50 text-sm">Loading map…</p>
      </div>
    </div>
  ),
})

const AddToHomeScreen = dynamic(() => import('@/components/AddToHomeScreen'), { ssr: false })

export default function MapShell({ locations }: { locations: Location[] }) {
  return (
    <>
      <MapView locations={locations} />
      <AddToHomeScreen />
    </>
  )
}
