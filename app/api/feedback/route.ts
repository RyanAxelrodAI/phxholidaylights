import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import type { Feedback } from '@/lib/types'

const VALID_TYPES: Feedback['type'][] = [
  'still_active', 'no_longer_active', 'update_needed', 'note',
]

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { location_id, type, message, submitted_by } = body as Record<string, unknown>

  if (!location_id || typeof location_id !== 'string') {
    return NextResponse.json({ error: 'location_id is required' }, { status: 400 })
  }
  if (!type || !VALID_TYPES.includes(type as Feedback['type'])) {
    return NextResponse.json({ error: 'Invalid feedback type' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('feedback').insert({
    location_id,
    type,
    message: typeof message === 'string' ? message.trim() || null : null,
    submitted_by: typeof submitted_by === 'string' ? submitted_by.trim() || null : null,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
