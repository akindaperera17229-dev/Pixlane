import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Camera, Plus, Calendar, Images, ArrowRight, Sparkles, LogOut, QrCode } from 'lucide-react'
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

  const firstName = user.user_metadata?.full_name?.split(' ')[0] || 'Friend'
  const totalPhotos = events?.reduce((sum, e) => sum + ((e.photos?.[0]?.count) ?? 0), 0) ?? 0

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#221513] pb-24 md:pb-12">
      {/* ─── APP HEADER ─── */}
      <header className="bg-white border-b border-[#FFEAE4] sticky top-0 z-40 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#FF7654] to-[#FFA387] flex items-center justify-center text-white shadow-xs">
              <Camera className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-lg text-[#221513] tracking-tight">Pixlane</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[#FFF6F3] border border-[#FFEAE4] px-3 py-1.5 rounded-full text-xs font-bold text-[#6E554F]">
              <span className="w-2 h-2 rounded-full bg-[#FF7654]" />
              <span>{user.email}</span>
            </div>

            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs font-bold text-[#6E554F] hover:text-[#D43E19] bg-[#FFF6F3] hover:bg-[#FFEAE4] px-3 py-1.5 rounded-xl border border-[#FFEAE4] transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome & Stats Banner */}
        <div className="bg-gradient-to-br from-[#FFEAE4] via-[#FFF5F2] to-[#FFFDFB] border border-[#FFD5C8] rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D43E19] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Host Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#221513] tracking-tight">
                Hey, {firstName}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-[#6E554F] mt-1">
                Manage your shared albums, display QR codes, and download high-res photos.
              </p>
            </div>

            <Link
              href="/dashboard/create"
              className="inline-flex items-center justify-center gap-2 bg-[#FF7654] hover:bg-[#F45732] text-white font-extrabold text-sm px-5 py-3 rounded-2xl shadow-md shadow-[#FF7654]/25 hover:shadow-lg transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create New Event</span>
            </Link>
          </div>

          {/* Quick Stat Chips */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t border-[#FFD5C8]/60">
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-[#FFEAE4] text-center">
              <span className="text-xl sm:text-2xl font-black text-[#221513]">
                {events?.length ?? 0}
              </span>
              <p className="text-[11px] font-bold text-[#6E554F] mt-0.5 uppercase tracking-wider">
                Total Events
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-[#FFEAE4] text-center">
              <span className="text-xl sm:text-2xl font-black text-[#FF7654]">
                {events?.filter((e) => e.is_active).length ?? 0}
              </span>
              <p className="text-[11px] font-bold text-[#6E554F] mt-0.5 uppercase tracking-wider">
                Active Now
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-[#FFEAE4] text-center">
              <span className="text-xl sm:text-2xl font-black text-[#D43E19]">
                {totalPhotos}
              </span>
              <p className="text-[11px] font-bold text-[#6E554F] mt-0.5 uppercase tracking-wider">
                Photos Collected
              </p>
            </div>
          </div>
        </div>

        {/* ─── EVENTS LIST ─── */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-[#221513]">Your Event Albums</h2>
          {events && events.length > 0 && (
            <span className="text-xs font-bold text-[#6E554F]">
              {events.length} {events.length === 1 ? 'event' : 'events'}
            </span>
          )}
        </div>

        {!events || events.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-[#FFD5C8] p-12 sm:p-16 text-center shadow-xs">
            <div className="w-16 h-16 bg-[#FFEAE4] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#D43E19]">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-[#221513] mb-2">No events created yet</h3>
            <p className="text-xs sm:text-sm text-[#6E554F] mb-6 max-w-sm mx-auto">
              Going on an outing, hosting a birthday or wedding? Set up your first shared gallery in seconds.
            </p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 bg-[#FF7654] hover:bg-[#F45732] text-white font-extrabold text-sm px-6 py-3 rounded-2xl shadow-md shadow-[#FF7654]/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Event</span>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {events.map((event) => {
              const photoCount = (event.photos as unknown as { count: number }[])?.[0]?.count ?? 0
              const percentage = Math.min((photoCount / event.photo_limit) * 100, 100)

              return (
                <Link
                  key={event.id}
                  href={`/dashboard/events/${event.id}`}
                  className="group bg-white rounded-3xl border border-[#FFEAE4] hover:border-[#FFB7A2] p-5 shadow-xs hover:shadow-lg hover:shadow-[#FF7654]/10 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Row: Status & Code Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          event.is_active
                            ? 'bg-[#FFEAE4] text-[#D43E19]'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            event.is_active ? 'bg-[#FF7654] animate-pulse' : 'bg-gray-400'
                          }`}
                        />
                        {event.is_active ? 'Accepting Photos' : 'Closed'}
                      </span>

                      <span className="font-mono text-xs font-bold text-[#6E554F] bg-[#FFF6F3] border border-[#FFEAE4] px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <QrCode className="w-3 h-3 text-[#FF7654]" />
                        {event.code}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-[#221513] group-hover:text-[#FF7654] transition-colors line-clamp-1 mb-1">
                      {event.name}
                    </h3>

                    {event.description && (
                      <p className="text-xs text-[#6E554F] line-clamp-2 mb-3">
                        {event.description}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-[#6E554F] mb-4">
                      <Calendar className="w-3.5 h-3.5 text-[#FF7654]" />
                      <span>
                        {event.event_date
                          ? format(new Date(event.event_date), 'MMM d, yyyy')
                          : 'No date specified'}
                      </span>
                    </div>
                  </div>

                  {/* Footer with photo bar */}
                  <div className="pt-3 border-t border-[#FFEAE4]">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="flex items-center gap-1 text-[#FF7654]">
                        <Images className="w-3.5 h-3.5" />
                        <span>{photoCount} photos</span>
                      </span>
                      <span className="text-[#6E554F] font-normal">
                        Max {event.photo_limit}
                      </span>
                    </div>

                    <div className="w-full bg-[#FFF6F3] rounded-full h-2 overflow-hidden border border-[#FFEAE4]">
                      <div
                        className="bg-gradient-to-r from-[#FF7654] to-[#FFA387] h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      {/* ─── MOBILE STICKY FLOATING ACTION BUTTON ─── */}
      <div className="fixed bottom-6 right-6 md:hidden z-30">
        <Link
          href="/dashboard/create"
          className="flex items-center gap-2 bg-[#FF7654] text-white font-extrabold text-sm px-5 py-3.5 rounded-full shadow-lg shadow-[#FF7654]/40 active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>New Event</span>
        </Link>
      </div>
    </div>
  )
}
