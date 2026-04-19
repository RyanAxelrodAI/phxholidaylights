import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import https from 'https'

function postToSlack(webhookUrl: string, text: string): Promise<string> {
  return new Promise((resolve) => {
    const payload = JSON.stringify({ text })
    const url = new URL(webhookUrl)

    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => resolve(`${res.statusCode} ${data}`))
    })

    req.on('error', (e) => resolve(`error: ${e.message}`))
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
  let slackStatus = 'no_webhook_env'

  if (slackWebhook) {
    const webhookUrl = slackWebhook.trim()
    const submitter = typeof name === 'string' && name.trim() ? name.trim() : 'Anonymous'
    const emailStr = typeof email === 'string' && email.trim() ? email.trim() : 'Not provided'
    const descStr = typeof description === 'string' && description.trim() ? description.trim() : 'No description'
    const text = `🎄 *New Holiday Light Submission!*\n*Address:* ${address.trim()}\n*Submitted by:* ${submitter}\n*Email:* ${emailStr}\n*Description:* ${descStr}`

    slackStatus = await postToSlack(webhookUrl, text)
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
