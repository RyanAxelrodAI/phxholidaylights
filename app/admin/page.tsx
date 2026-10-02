import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import type { Submission, Feedback, Location } from '@/lib/types'
import AdminPanel from './AdminPanel'

export const dynamic = 'force-dynamic'

interface PageProps {
  // Next 15: searchParams is a Promise and must be awaited.
  searchParams: Promise<{ key?: string }>
}

export default async function AdminPage({ searchParams }: PageProps) {
  // FAIL CLOSED. This used to be `searchParams.key !== process.env.ADMIN_SECRET_KEY`.
  // With ADMIN_SECRET_KEY unset, visiting /admin with no ?key= gave
  // `undefined !== undefined` -> false -> NO redirect -> the admin panel rendered to
  // anyone. The guard was only ever as good as the env var being present.
  // The two /api/admin routes were NOT affected: headers.get() returns null, and
  // `null !== undefined` is true, so they blocked correctly. Only this page was open.
  // (Malik, 2026-10-02, Ryan approved.)
  const adminKey = process.env.ADMIN_SECRET_KEY
  const { key } = await searchParams
  if (!adminKey || key !== adminKey) {
    redirect('/')
  }

  const admin = createAdminClient()

  const [{ data: submissions }, { data: feedback }] = await Promise.all([
    admin
      .from('submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true }),
    admin
      .from('feedback')
      .select('*, location:locations(address)')
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  return (
    <AdminPanel
      submissions={(submissions ?? []) as Submission[]}
      feedback={(feedback ?? []) as (Feedback & { location: Pick<Location, 'address'> })[]}
      adminKey={key!}
    />
  )
}
