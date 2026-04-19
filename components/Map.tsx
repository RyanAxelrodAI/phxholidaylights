'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  useMap,
} from '@vis.gl/react-google-maps'
import type { Location } from '@/lib/types'
import FeedbackModal from './FeedbackModal'

const PHOENIX_CENTER = { lat: 33.4484, lng: -111.9 }

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1a2e1a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec07c' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1a0f' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d4a2d' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1a2e1a' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3d6b3d' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d2e3a' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1a3a1a' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#2d4a2d' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'simplified' }] },
]

// Pans map when selectedLocation changes
function MapPanner({ location }: { location: Location | null }) {
  const map = useMap()
  useEffect(() => {
    if (map && location) {
      map.panTo({ lat: location.lat, lng: location.lng })
      map.setZoom(15)
    }
  }, [map, location])
  return null
}

interface MarkerWithInfoProps {
  location: Location
  onClick: (loc: Location) => void
  selected: boolean
  onClose: () => void
  onFeedback: (loc: Location) => void
}

function LocationMarker({ location, onClick, selected, onClose, onFeedback }: MarkerWithInfoProps) {
  const [markerRef, marker] = useAdvancedMarkerRef()

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: location.lat, lng: location.lng }}
        onClick={() => onClick(location)}
        title={location.address}
      >
        <div className="holiday-marker">🎄</div>
      </AdvancedMarker>

      {selected && marker && (
        <InfoWindow
          anchor={marker}
          onCloseClick={onClose}
          headerDisabled
        >
          <div className="bg-holiday-green-dark text-white rounded-xl overflow-hidden min-w-[220px] max-w-[280px]">
            <div className="bg-holiday-green px-4 py-3 flex items-start gap-2">
              <span className="text-lg flex-shrink-0 mt-0.5">📍</span>
              <p className="text-sm font-semibold leading-snug">{location.address}</p>
            </div>
            {location.description && (
              <p className="px-4 py-3 text-sm text-white/80 leading-relaxed border-t border-white/10">
                {location.description}
              </p>
            )}
            {location.date_added && (
              <p className="px-4 pb-2 text-xs text-white/40">
                Added {location.date_added}
              </p>
            )}
            <div className="px-4 py-3 border-t border-white/10 space-y-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full text-sm bg-holiday-green hover:bg-holiday-green-light text-white font-medium py-2 px-3 rounded-lg transition-colors"
              >
                🗺️ Get Directions
              </a>
              <button
                onClick={() => onFeedback(location)}
                className="w-full text-sm bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-3 rounded-lg transition-colors"
              >
                💬 Give Feedback / Report
              </button>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  )
}

interface MapViewProps {
  locations: Location[]
}

export default function MapView({ locations }: MapViewProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [feedbackLocation, setFeedbackLocation] = useState<Location | null>(null)
  const [showList, setShowList] = useState(false)
  const [search, setSearch] = useState('')
  const activeItemRef = useRef<HTMLButtonElement>(null)

  const handleMarkerClick = useCallback((loc: Location) => {
    setSelectedLocation(loc)
  }, [])

  const handleInfoClose = useCallback(() => {
    setSelectedLocation(null)
  }, [])

  const handleFeedback = useCallback((loc: Location) => {
    setFeedbackLocation(loc)
    setSelectedLocation(null)
  }, [])

  const handleListClick = useCallback((loc: Location) => {
    setSelectedLocation(loc)
    // On mobile, close the list so the marker popup is visible
    if (window.innerWidth < 768) setShowList(false)
  }, [])

  // Scroll active item into view when selected from map
  useEffect(() => {
    if (selectedLocation && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedLocation])

  const filtered = locations.filter(loc =>
    loc.address.toLowerCase().includes(search.toLowerCase()) ||
    (loc.description ?? '').toLowerCase().includes(search.toLowerCase())
  )

  // Group by city (address format: "street, city, state zip")
  const getCity = (address: string) => address.split(', ')[1] ?? 'Other'

  const groupedByCity = filtered.reduce<Record<string, Location[]>>((acc, loc) => {
    const city = getCity(loc.address)
    if (!acc[city]) acc[city] = []
    acc[city].push(loc)
    return acc
  }, {})

  const sortedCities = Object.keys(groupedByCity).sort()

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="w-full h-full flex">

        {/* ── Sidebar list ── */}
        <div
          className={`
            absolute md:relative z-20 inset-y-0 left-0
            flex flex-col
            bg-holiday-dark border-r border-holiday-green/30
            transition-all duration-300 ease-in-out
            ${showList ? 'w-80' : 'w-0'}
            overflow-hidden
          `}
        >
          <div className="flex flex-col h-full w-80">
            {/* Header */}
            <div className="px-4 pt-4 pb-3 border-b border-holiday-green/20 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold text-sm">
                  🎄 All Locations
                  <span className="ml-2 text-white/40 font-normal">({locations.length})</span>
                </h2>
                <button
                  onClick={() => setShowList(false)}
                  className="text-white/40 hover:text-white transition-colors text-lg leading-none"
                  aria-label="Close list"
                >
                  ✕
                </button>
              </div>
              <input
                type="text"
                placeholder="Search locations…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-holiday-green/60"
              />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-white/40 text-sm text-center mt-8 px-4">No locations match your search.</p>
              ) : (
                sortedCities.map(city => (
                  <div key={city}>
                    {/* City header */}
                    <div className="sticky top-0 z-10 px-4 py-2 bg-holiday-dark/95 backdrop-blur border-b border-holiday-green/20 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-holiday-green/80">{city}</span>
                      <span className="text-xs text-white/30">{groupedByCity[city].length}</span>
                    </div>
                    {/* Locations under this city */}
                    {groupedByCity[city].map(loc => {
                      const isActive = selectedLocation?.id === loc.id
                      const street = loc.address.split(', ')[0]
                      return (
                        <button
                          key={loc.id}
                          ref={isActive ? activeItemRef : null}
                          onClick={() => handleListClick(loc)}
                          className={`
                            w-full text-left px-4 py-2.5 border-b border-white/5
                            transition-colors
                            ${isActive
                              ? 'bg-holiday-green/25 border-l-2 border-l-holiday-green'
                              : 'hover:bg-white/5'
                            }
                          `}
                        >
                          <p className="text-sm text-white leading-snug">{street}</p>
                          {loc.description && (
                            <p className="text-xs text-white/45 mt-0.5 line-clamp-1">{loc.description}</p>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Map ── */}
        <div className="relative flex-1 h-full">
          {/* Toggle button */}
          <button
            onClick={() => setShowList(v => !v)}
            className={`
              absolute top-4 z-10 flex items-center gap-2
              bg-holiday-dark/90 hover:bg-holiday-dark border border-holiday-green/40
              text-white text-sm font-medium px-3 py-2 rounded-lg shadow-lg
              transition-all duration-300
              ${showList ? 'left-4' : 'left-4'}
            `}
            aria-label="Toggle location list"
          >
            {showList ? '◀ Hide List' : '☰ View All'}
          </button>

          <Map
            defaultCenter={PHOENIX_CENTER}
            defaultZoom={11}
            mapId="phx-holiday-lights"
            styles={DARK_MAP_STYLE}
            disableDefaultUI={false}
            gestureHandling="greedy"
            className="w-full h-full"
          >
            <MapPanner location={selectedLocation} />
            {locations.map((loc) => (
              <LocationMarker
                key={loc.id}
                location={loc}
                onClick={handleMarkerClick}
                selected={selectedLocation?.id === loc.id}
                onClose={handleInfoClose}
                onFeedback={handleFeedback}
              />
            ))}
          </Map>

          {locations.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-holiday-dark/90 border border-holiday-green/40 rounded-2xl p-6 text-center max-w-xs mx-4">
                <div className="text-4xl mb-3">🎄</div>
                <p className="text-white font-semibold mb-1">No locations yet!</p>
                <p className="text-white/60 text-sm">Be the first to submit a holiday light display.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {feedbackLocation && (
        <FeedbackModal
          location={feedbackLocation}
          onClose={() => setFeedbackLocation(null)}
        />
      )}
    </APIProvider>
  )
}
