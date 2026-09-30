'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateEventCode } from '@/lib/utils'
import { ArrowLeft, Calendar, FileText, Camera, Sparkles, Check } from 'lucide-react'
import Link from 'next/link'

const POPULAR_OCCASIONS = [
  { emoji: '🌴', title: 'Outing / Trip', hint: 'Beach, hike, Ella, road trip' },
  { emoji: '💍', title: 'Wedding / Poruwa', hint: 'Ceremony, reception, afterparty' },
  { emoji: '🎂', title: 'Birthday Bash', hint: 'Party, dinner, night celebration' },
  { emoji: '🎓', title: 'Batch / Uni Event', hint: 'Reunion, farewell, sports meet' },
  { emoji: '🏮', title: 'Tradition / Festival', hint: 'Avurudu, Vesak, Dāna, temple' },
  { emoji: '✨', title: 'Other Gatherings', hint: 'Casual meetup, office hangout' },
]

export default function CreateEventPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  function handleSelectOccasion(title: string) {
    setSelectedTag(title)
    if (!name) {
      setName(title)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth')
      return
    }

    const code = generateEventCode()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: err } = await (supabase as any)
      .from('events')
      .insert({
        host_id: user.id,
        name: name.trim(),
        description: description.trim() || null,
        event_date: eventDate || null,
        code,
        is_active: true,
        photo_limit: 30,
      })
      .select()
      .single()

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    router.push(`/dashboard/events/${data.id}`)
  }

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#221513] pb-16">
      {/* ─── APP HEADER ─── */}
      <header className="bg-white border-b border-[#FFEAE4] sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-xl bg-[#FFF6F3] border border-[#FFEAE4] flex items-center justify-center text-[#6E554F] hover:text-[#221513] hover:bg-[#FFEAE4] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#FF7654] flex items-center justify-center text-white">
                <Camera className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-base text-[#221513]">Create Event</span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <span className="text-xs font-bold text-[#D43E19] bg-[#FFEAE4] px-3 py-1 rounded-full uppercase tracking-wider">
            Step 1 of 1
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#221513] mt-2">
            Let&apos;s set up your shared album
          </h1>
          <p className="text-xs sm:text-sm text-[#6E554F] mt-1">
            Pick what kind of occasion this is and give it a cool name.
          </p>
        </div>

        {/* Occasion Pickers */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-[#221513] uppercase tracking-wider mb-2.5">
            Select Occasion Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {POPULAR_OCCASIONS.map((occ) => {
              const isSelected = selectedTag === occ.title
              return (
                <button
                  key={occ.title}
                  type="button"
                  onClick={() => handleSelectOccasion(occ.title)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-[#FF7654] bg-[#FFEAE4] shadow-xs'
                      : 'border-[#FFEAE4] bg-white hover:bg-[#FFF6F3]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl">{occ.emoji}</span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#FF7654] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#221513]">{occ.title}</p>
                  <p className="text-[10px] text-[#6E554F] truncate mt-0.5">{occ.hint}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Event Form */}
        <div className="bg-white rounded-3xl border border-[#FFEAE4] shadow-sm p-6 sm:p-7">
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#221513] uppercase tracking-wider mb-1.5">
                Event Name <span className="text-[#FF7654]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mirissa Beach Trip '26, Sandun & Nethmi Poruwa"
                required
                maxLength={80}
                className="w-full px-4 py-3 rounded-2xl bg-[#FFFDFB] border border-[#FFD5C8] text-[#221513] placeholder-[#A83013]/40 focus:outline-none focus:ring-2 focus:ring-[#FF7654] focus:border-transparent text-sm transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#221513] uppercase tracking-wider mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FF7654]" />
                <span>Event Date (optional)</span>
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#FFFDFB] border border-[#FFD5C8] text-[#221513] focus:outline-none focus:ring-2 focus:ring-[#FF7654] focus:border-transparent text-sm transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#221513] uppercase tracking-wider mb-1.5">
                <FileText className="w-3.5 h-3.5 text-[#FF7654]" />
                <span>Guest Note / Instructions (optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add all your candid shots, selfies, and group pics here!"
                rows={3}
                maxLength={250}
                className="w-full px-4 py-3 rounded-2xl bg-[#FFFDFB] border border-[#FFD5C8] text-[#221513] placeholder-[#A83013]/40 focus:outline-none focus:ring-2 focus:ring-[#FF7654] focus:border-transparent text-sm transition-all resize-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl">
                {error}
              </div>
            )}

            <div className="bg-[#FFF6F3] border border-[#FFEAE4] rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#FF7654] shrink-0 mt-0.5" />
              <p className="text-xs text-[#6E554F] leading-relaxed">
                Free plan includes <strong className="text-[#221513]">30 photos</strong> per album with high-res preservation. You can upgrade anytime for larger gatherings.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                href="/dashboard"
                className="flex-1 text-center py-3.5 rounded-2xl border border-[#FFEAE4] text-[#6E554F] font-bold hover:bg-[#FFF6F3] transition-colors text-sm"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="flex-1 bg-gradient-to-r from-[#FF7654] to-[#FFA387] hover:from-[#F45732] hover:to-[#FF8E72] text-white font-extrabold py-3.5 rounded-2xl shadow-md shadow-[#FF7654]/25 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm"
              >
                {loading ? 'Creating...' : 'Generate Album & QR →'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
