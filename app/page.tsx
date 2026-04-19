import dynamic from 'next/dynamic'
import NavBar from '@/components/NavBar'
import { getLocationsFromSheet } from '@/lib/getLocations'

const AddToHomeScreen = dynamic(() => import('@/components/AddToHomeScreen'), { ssr: false })

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

export const revalidate = 300 // revalidate every 5 minutes

export default async function HomePage() {
  const locations = await getLocationsFromSheet()

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <NavBar />
      <MapView locations={locations} />
      <AddToHomeScreen />

      {/* Bottom pill — location count */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-holiday-dark/85 backdrop-blur border border-holiday-green/40 rounded-full px-4 py-2 text-sm text-white/70 shadow-lg">
          {locations.length > 0
            ? `${locations.length} light display${locations.length === 1 ? '' : 's'} mapped`
            : 'No displays yet — be the first to submit!'}
        </div>
      </div>
    </main>
  )
}
