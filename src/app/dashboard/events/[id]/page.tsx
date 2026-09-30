import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EventDetailClient from './EventDetailClient'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: event } = await supabase
    .from('events')
    .select('id')
    .eq('id', id)
    .eq('host_id', user.id)
    .single()

  if (!event) notFound()

  return <EventDetailClient eventId={id} />
}
