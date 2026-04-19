import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import type { Submission, Feedback, Location } from '@/lib/types'
import AdminPanel from './AdminPanel'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: { key?: string }
}

export default async function AdminPage({ searchParams }: PageProps) {
  if (searchParams.key !== process.env.ADMIN_SECRET_KEY) {
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
      adminKey={searchParams.key!}
    />
  )
}
