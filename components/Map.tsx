'use client'

import { useState, useCallback } from 'react'
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
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

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="w-full h-full">
        <Map
          defaultCenter={PHOENIX_CENTER}
          defaultZoom={11}
          mapId="phx-holiday-lights"
          styles={DARK_MAP_STYLE}
          disableDefaultUI={false}
          gestureHandling="greedy"
          className="w-full h-full"
        >
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

      {feedbackLocation && (
        <FeedbackModal
          location={feedbackLocation}
          onClose={() => setFeedbackLocation(null)}
        />
      )}
    </APIProvider>
  )
}
