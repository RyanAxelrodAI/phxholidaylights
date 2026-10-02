import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(
  req: NextRequest,
  // Next 15: params is a Promise and must be awaited.
  { params }: { params: Promise<{ id: string }> }
) {
  // Explicitly require the secret to EXIST. This route already failed closed
  // (headers.get() returns null and `null !== undefined` is true), but relying on
  // that is fragile; app/admin/page.tsx had the same shape and did NOT fail closed.
  const { id } = await params
  const adminKey = process.env.ADMIN_SECRET_KEY
  if (!adminKey || req.headers.get('x-admin-key') !== adminKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()

  // Fetch the submission
  const { data: sub, error: fetchError } = await admin
    .from('submissions')
    .select('*')
    .eq('id', id)
    .eq('status', 'pending')
    .single()

  if (fetchError || !sub) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }

  // Insert into locations and mark submission approved — run in parallel
  const [{ error: insertError }, { error: updateError }] = await Promise.all([
    admin.from('locations').insert({
      address: sub.address,
      description: sub.description,
      lat: sub.lat,
      lng: sub.lng,
      verified: true,
    }),
    admin.from('submissions').update({ status: 'approved' }).eq('id', id),
  ])

  if (insertError || updateError) {
    return NextResponse.json(
      { error: insertError?.message ?? updateError?.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
