'use client'

import { useState, useRef, useEffect } from 'react'
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps'

interface FormState {
  address: string
  lat: number | null
  lng: number | null
  description: string
  name: string
  email: string
}

function PlacesAutocomplete({
  onPlaceSelect,
}: {
  onPlaceSelect: (address: string, lat: number, lng: number) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState('')
  const placesLib = useMapsLibrary('places')

  useEffect(() => {
    if (!placesLib || !inputRef.current) return

    const autocomplete = new placesLib.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address', 'geometry'],
      types: ['address'],
      bounds: {
        north: 34.0,
        south: 32.8,
        east: -111.0,
        west: -113.0,
      },
      strictBounds: false,
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.geometry?.location || !place.formatted_address) return
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      setInputValue(place.formatted_address)
      onPlaceSelect(place.formatted_address, lat, lng)
    })

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete)
    }
  }, [placesLib, onPlaceSelect])

  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-1.5">
        Street Address <span className="text-holiday-red">*</span>
      </label>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
          if (!e.target.value) onPlaceSelect('', 0, 0)
        }}
        placeholder="Start typing an address in Phoenix, AZ..."
        required
        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-holiday-gold"
      />
      <p className="text-xs text-white/40 mt-1">Select an address from the dropdown to confirm location.</p>
    </div>
  )
}

function SubmitFormInner() {
  const [form, setForm] = useState<FormState>({
    address: '', lat: null, lng: null,
    description: '', name: '', email: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handlePlaceSelect(address: string, lat: number, lng: number) {
    setForm((f) => ({ ...f, address, lat: lat || null, lng: lng || null }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.lat || !form.lng) {
      setErrorMsg('Please select an address from the autocomplete dropdown.')
      return
    }
    setErrorMsg('')
    setStatus('submitting')

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed')
      }
      setStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">🎄</div>
        <h2 className="text-xl font-bold text-white mb-2">Thank you!</h2>
        <p className="text-white/60 mb-6 max-w-xs mx-auto">
          Your submission is under review. Once approved it will show up on the map.
        </p>
        <a
          href="/"
          className="inline-block bg-holiday-red hover:bg-holiday-red-light text-white font-semibold px-6 py-3 rounded-full transition-colors"
        >
          Back to Map
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PlacesAutocomplete onPlaceSelect={handlePlaceSelect} />

      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="What makes it special? Music, characters, best time to visit..."
          rows={3}
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-holiday-gold resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Your Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Optional"
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-holiday-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="Optional"
            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-holiday-gold"
          />
        </div>
      </div>

      {(status === 'error' || errorMsg) && (
        <p className="text-holiday-red text-sm">{errorMsg || 'Something went wrong. Please try again.'}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting' || !form.address}
        className="w-full bg-holiday-red hover:bg-holiday-red-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-full text-sm transition-colors shadow-lg"
      >
        {status === 'submitting' ? 'Submitting...' : '🎄 Submit Location'}
      </button>

      <p className="text-center text-xs text-white/30">
        All submissions are reviewed before appearing on the map.
      </p>
    </form>
  )
}

export default function SubmitForm() {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <SubmitFormInner />
    </APIProvider>
  )
}
