import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Camera, Plus, Calendar, Images } from 'lucide-react'
import { format } from 'date-fns'
import { Event } from '@/types/database'


async function signOut() {
  'use server'
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth')
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const { data: eventsRaw } = await supabase
    .from('events')
    .select('*, photos(count)')
    .eq('host_id', user.id)
    .order('created_at', { ascending: false })

  type EventWithCount = Event & { photos: { count: number }[] }
  const events = eventsRaw as EventWithCount[] | null

  const firstName = user.user_metadata?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-teal-700">Pixlane</span>
          </Link>
          <form action={signOut}>
            <button type="submit" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hey, {firstName} 👋</h1>
            <p className="text-gray-500 mt-1">Manage your events and galleries.</p>
          </div>
          <Link
            href="/dashboard/create"
            className="flex items-center gap-2 bg-teal-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New event
          </Link>
        </div>

        {/* Events grid */}
        {!events || events.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-400 mb-6">Create your first event and start collecting photos from everyone.</p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 bg-teal-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create first event
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => {
              const photoCount = (event.photos as unknown as { count: number }[])?.[0]?.count ?? 0
              return (
                <Link
                  key={event.id}
                  href={`/dashboard/events/${event.id}`}
                  className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-teal-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-3 h-3 rounded-full mt-1 ${event.is_active ? 'bg-green-400' : 'bg-gray-300'}`}
                      title={event.is_active ? 'Active' : 'Closed'}
                    />
                    <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">
                      {event.code}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-teal-700 transition-colors">
                    {event.name}
                  </h3>

                  <div className="flex items-center gap-1 text-sm text-gray-400 mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    {event.event_date
                      ? format(new Date(event.event_date), 'MMM d, yyyy')
                      : 'No date set'}
                  </div>

                  <div className="flex items-center gap-1 text-sm text-teal-600 font-medium">
                    <Images className="w-3.5 h-3.5" />
                    {photoCount} photo{photoCount !== 1 ? 's' : ''}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
