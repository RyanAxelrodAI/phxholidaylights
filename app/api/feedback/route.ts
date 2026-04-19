import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import type { Feedback } from '@/lib/types'
import { FEEDBACK_LABELS } from '@/lib/types'
import https from 'https'

const VALID_TYPES: Feedback['type'][] = [
  'still_active', 'no_longer_active', 'update_needed', 'note',
]

function postToSlack(webhookUrl: string, text: string): Promise<void> {
  return new Promise((resolve) => {
    const payload = JSON.stringify({ text })
    const url = new URL(webhookUrl)
    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      () => resolve()
    )
    req.on('error', () => resolve())
    req.write(payload)
    req.end()
  })
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { location_id, location_address, type, message, submitted_by } = body as Record<string, unknown>

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

  // Send Slack notification
  const slackWebhook = process.env.SLACK_WEBHOOK_URL
  if (slackWebhook) {
    const label = FEEDBACK_LABELS[type as Feedback['type']]
    const address = typeof location_address === 'string' ? location_address : location_id
    const noteStr = typeof message === 'string' && message.trim() ? message.trim() : null
    const submitter = typeof submitted_by === 'string' && submitted_by.trim() ? submitted_by.trim() : 'Anonymous'

    const text = [
      `💬 *New Feedback Received!*`,
      `*Address:* ${address}`,
      `*Type:* ${label}`,
      noteStr ? `*Note:* ${noteStr}` : null,
      `*From:* ${submitter}`,
    ].filter(Boolean).join('\n')

    await postToSlack(slackWebhook.trim(), text)
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
