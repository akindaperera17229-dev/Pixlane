import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
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
  const totalPhotos = events?.reduce((sum, e) => sum + ((e.photos?.[0]?.count) ?? 0), 0) ?? 0

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <header className="border-b border-gray-800/60 bg-gray-950/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold text-white">Pixlane</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:block">{user.email}</span>
            <form action={signOut}>
              <button type="submit" className="text-sm text-gray-500 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-lg border border-gray-800 hover:border-gray-700">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Header + Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Hey, {firstName} 👋</h1>
            <p className="text-gray-400 mt-1 text-sm">Manage your events and photo galleries</p>
          </div>
          <Link href="/dashboard/create"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New event
          </Link>
        </div>

        {/* Quick Stats */}
        {events && events.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Events', value: events.length },
              { label: 'Active', value: events.filter(e => e.is_active).length },
              { label: 'Total Photos', value: totalPhotos },
            ].map(stat => (
              <div key={stat.label} className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Events Grid */}
        {!events || events.length === 0 ? (
          <div className="bg-gray-900/40 border border-dashed border-gray-700 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No events yet</h3>
            <p className="text-gray-500 mb-6 text-sm max-w-xs mx-auto">Create your first event and start collecting photos from everyone at your next occasion.</p>
            <Link href="/dashboard/create"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create first event
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(event => {
              const photoCount = event.photos?.[0]?.count ?? 0
              const pct = Math.min((photoCount / event.photo_limit) * 100, 100)
              return (
                <Link key={event.id} href={`/dashboard/events/${event.id}`}
                  className="group bg-gray-900/60 border border-gray-800 rounded-2xl p-5 hover:border-amber-500/40 hover:bg-gray-900/80 transition-all">
                  {/* Status + Code */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      event.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-800 text-gray-500 border border-gray-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${event.is_active ? 'bg-green-400' : 'bg-gray-600'}`} />
                      {event.is_active ? 'Active' : 'Closed'}
                    </span>
                    <span className="text-xs font-mono text-gray-600 bg-gray-800/60 px-2 py-1 rounded-lg">{event.code}</span>
                  </div>

                  <h3 className="font-bold text-white text-base mb-1 group-hover:text-amber-400 transition-colors line-clamp-1">{event.name}</h3>

                  <p className="text-xs text-gray-500 mb-4">
                    {event.event_date ? format(new Date(event.event_date), 'MMM d, yyyy') : 'No date set'}
                  </p>

                  {/* Photo progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">{photoCount} photos</span>
                      <span className="text-gray-600">{event.photo_limit} limit</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }} />
                    </div>
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
