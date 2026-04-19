'use client'

import { useState } from 'react'
import type { Submission, Feedback, Location } from '@/lib/types'
import { FEEDBACK_LABELS } from '@/lib/types'

interface Props {
  submissions: Submission[]
  feedback: (Feedback & { location: Pick<Location, 'address'> })[]
  adminKey: string
}

function SubmissionCard({
  sub,
  adminKey,
  onAction,
}: {
  sub: Submission
  adminKey: string
  onAction: (id: string, action: 'approve' | 'reject') => void
}) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)

  async function handleAction(action: 'approve' | 'reject') {
    setLoading(action)
    try {
      const res = await fetch(`/api/admin/${action}/${sub.id}`, {
        method: 'POST',
        headers: { 'x-admin-key': adminKey },
      })
      if (!res.ok) throw new Error('Failed')
      onAction(sub.id, action)
    } catch {
      alert('Action failed. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-white text-sm truncate">{sub.address}</p>
          {sub.submitted_by && (
            <p className="text-xs text-white/40 mt-0.5">by {sub.submitted_by} {sub.email ? `(${sub.email})` : ''}</p>
          )}
        </div>
        <span className="text-xs text-white/30 flex-shrink-0">
          {new Date(sub.created_at).toLocaleDateString()}
        </span>
      </div>

      {sub.description && (
        <p className="text-sm text-white/60 mb-3 leading-relaxed">{sub.description}</p>
      )}

      <p className="text-xs text-white/30 mb-3">
        📍 {sub.lat.toFixed(5)}, {sub.lng.toFixed(5)}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => handleAction('approve')}
          disabled={!!loading}
          className="flex-1 bg-holiday-green hover:bg-holiday-green-light disabled:opacity-40 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
        >
          {loading === 'approve' ? '…' : '✅ Approve'}
        </button>
        <button
          onClick={() => handleAction('reject')}
          disabled={!!loading}
          className="flex-1 bg-white/10 hover:bg-holiday-red/50 disabled:opacity-40 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
        >
          {loading === 'reject' ? '…' : '❌ Reject'}
        </button>
      </div>
    </div>
  )
}

export default function AdminPanel({ submissions: initial, feedback, adminKey }: Props) {
  const [submissions, setSubmissions] = useState(initial)

  function handleAction(id: string) {
    setSubmissions((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <main className="min-h-screen bg-holiday-dark">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🎄</span>
          <div>
            <h1 className="text-xl font-bold text-white">PHX Holiday Lights — Admin</h1>
            <p className="text-white/40 text-sm">Review pending submissions and feedback</p>
          </div>
        </div>

        {/* Pending Submissions */}
        <section className="mb-10">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            Pending Submissions
            <span className="bg-holiday-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {submissions.length}
            </span>
          </h2>

          {submissions.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center text-white/40 text-sm">
              No pending submissions — all clear! 🎉
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <SubmissionCard
                  key={sub.id}
                  sub={sub}
                  adminKey={adminKey}
                  onAction={handleAction}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recent Feedback */}
        <section>
          <h2 className="text-white font-semibold mb-4">Recent Feedback</h2>

          {feedback.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center text-white/40 text-sm">
              No feedback yet.
            </div>
          ) : (
            <div className="space-y-2">
              {feedback.map((fb) => (
                <div key={fb.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-white/40 truncate mb-1">{fb.location?.address}</p>
                      <p className="text-sm text-white font-medium">{FEEDBACK_LABELS[fb.type]}</p>
                      {fb.message && (
                        <p className="text-sm text-white/60 mt-1">{fb.message}</p>
                      )}
                      {fb.submitted_by && (
                        <p className="text-xs text-white/30 mt-1">— {fb.submitted_by}</p>
                      )}
                    </div>
                    <span className="text-xs text-white/30 flex-shrink-0">
                      {new Date(fb.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
