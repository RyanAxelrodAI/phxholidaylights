import { NextResponse } from 'next/server'
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

export async function GET() {
  const raw = process.env.SLACK_WEBHOOK_URL
  if (!raw) {
    return NextResponse.json({ error: 'SLACK_WEBHOOK_URL not set' })
  }

  const trimmed = raw.trim()

  // Show URL details for debugging
  const urlDebug = {
    rawLength: raw.length,
    trimmedLength: trimmed.length,
    first80: trimmed.substring(0, 80),
    endsWithNewline: raw.endsWith('\n'),
    endsWithSpace: raw.endsWith(' '),
  }

  const result = await postToSlack(trimmed, '🎄 Test from Vercel - debugging Slack webhook')

  return NextResponse.json({ urlDebug, result })
}
