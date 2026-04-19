'use client'

import { useState } from 'react'
import type { Location, Feedback } from '@/lib/types'
import { FEEDBACK_LABELS } from '@/lib/types'

interface Props {
  location: Location
  onClose: () => void
}

type FeedbackType = Feedback['type']

export default function FeedbackModal({ location, onClose }: Props) {
  const [type, setType] = useState<FeedbackType | null>(null)
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const requiresMessage = type === 'update_needed' || type === 'note'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!type) return

    setStatus('submitting')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location_id: location.id,
          type,
          message: message.trim() || null,
          submitted_by: name.trim() || null,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-holiday-green-dark border border-holiday-green/40 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <p className="font-bold text-white">Give Feedback</p>
            <p className="text-xs text-white/50 mt-0.5 truncate max-w-[260px]">{location.address}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white text-xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            ×
          </button>
        </div>

        {status === 'success' ? (
          <div className="p-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <p className="font-semibold text-white mb-1">Thanks for the feedback!</p>
            <p className="text-sm text-white/60 mb-5">It helps keep the map accurate for everyone.</p>
            <button
              onClick={onClose}
              className="bg-holiday-green hover:bg-holiday-green-light text-white font-semibold px-6 py-2.5 rounded-full transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Feedback type */}
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(FEEDBACK_LABELS) as FeedbackType[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setType(key)}
                  className={`text-left text-sm px-3 py-2.5 rounded-xl border transition-colors ${
                    type === key
                      ? 'bg-holiday-green border-holiday-gold text-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {FEEDBACK_LABELS[key]}
                </button>
              ))}
            </div>

            {/* Optional message */}
            {(requiresMessage || type) && (
              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={requiresMessage ? 'Please describe the update needed...' : 'Optional note...'}
                  required={requiresMessage}
                  rows={3}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-holiday-gold resize-none"
                />
              </div>
            )}

            {/* Optional name */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full bg-white/5 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-holiday-gold"
            />

            {status === 'error' && (
              <p className="text-holiday-red text-sm">Something went wrong. Please try again.</p>
            )}

            <button
              type="submit"
              disabled={!type || status === 'submitting'}
              className="w-full bg-holiday-red hover:bg-holiday-red-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-colors"
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
