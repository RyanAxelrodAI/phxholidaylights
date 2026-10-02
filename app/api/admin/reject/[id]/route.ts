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
  const { error } = await admin
    .from('submissions')
    .update({ status: 'rejected' })
    .eq('id', id)
    .eq('status', 'pending')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
