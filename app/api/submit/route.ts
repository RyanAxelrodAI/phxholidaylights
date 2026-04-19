import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { address, lat, lng, description, name, email } = body as Record<string, unknown>

  if (!address || typeof address !== 'string' || address.trim().length < 5) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 })
  }
  if (typeof lat !== 'number' || typeof lng !== 'number' || !lat || !lng) {
    return NextResponse.json({ error: 'Please select an address from the autocomplete dropdown.' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('submissions').insert({
    address: address.trim(),
    description: typeof description === 'string' ? description.trim() || null : null,
    lat,
    lng,
    submitted_by: typeof name === 'string' ? name.trim() || null : null,
    email: typeof email === 'string' ? email.trim() || null : null,
    status: 'pending',
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send Slack notification
  const slackWebhook = process.env.SLACK_WEBHOOK_URL
  console.log('Slack webhook present:', !!slackWebhook)
  if (slackWebhook) {
    const submitter = typeof name === 'string' && name.trim() ? name.trim() : 'Anonymous'
    const emailStr = typeof email === 'string' && email.trim() ? email.trim() : 'Not provided'
    const descStr = typeof description === 'string' && description.trim() ? description.trim() : 'No description'

    try {
      const slackRes = await fetch(slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🎄 *New Holiday Light Submission!*\n*Address:* ${address.trim()}\n*Submitted by:* ${submitter}\n*Email:* ${emailStr}\n*Description:* ${descStr}`,
        }),
      })
      console.log('Slack response:', slackRes.status, await slackRes.text())
    } catch (e) {
      console.error('Slack error:', e)
    }
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
