'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateEventCode } from '@/lib/utils'
import Link from 'next/link'

const OCCASION_TYPES = [
  { emoji: '💍', label: 'Wedding / Poruwa' },
  { emoji: '🎂', label: 'Birthday' },
  { emoji: '🎓', label: 'Graduation / Batch' },
  { emoji: '🏝️', label: 'Trip / Outing' },
  { emoji: '🙏', label: 'Almsgiving / Dāna' },
  { emoji: '🎉', label: 'Party / Other' },
]

export default function CreateEventPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [selectedOccasion, setSelectedOccasion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  function pickOccasion(label: string) {
    setSelectedOccasion(label)
    if (!name) setName(label)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }
    const code = generateEventCode()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: err } = await (supabase as any)
      .from('events')
      .insert({ host_id: user.id, name: name.trim(), description: description.trim() || null, event_date: eventDate || null, code, is_active: true, photo_limit: 30 })
      .select().single()
    if (err) { setError(err.message); setLoading(false); return }
    router.push(`/dashboard/events/${data.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <header className="border-b border-gray-800/60 bg-gray-950/90 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>
            <span className="font-bold text-white text-sm">Pixlane</span>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Create a new event</h1>
          <p className="text-gray-400 mt-1 text-sm">Fill in the details below to get your shareable gallery link.</p>
        </div>

        {/* Occasion picker */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-400 mb-3">What&apos;s the occasion?</p>
          <div className="grid grid-cols-3 gap-2">
            {OCCASION_TYPES.map(({ emoji, label }) => (
              <button key={label} type="button" onClick={() => pickOccasion(label)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-sm transition-all ${
                  selectedOccasion === label
                    ? 'border-amber-500/60 bg-amber-500/10 text-amber-400'
                    : 'border-gray-800 bg-gray-900/40 text-gray-400 hover:border-gray-700 hover:text-gray-300'
                }`}>
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs leading-tight text-center">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-7">
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Event name <span className="text-amber-500">*</span>
              </label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Nithya & Kamal's Poruwa, Batch Trip Ella 2026"
                required maxLength={80}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Event date <span className="text-gray-600 font-normal">(optional)</span>
              </label>
              <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Message to guests <span className="text-gray-600 font-normal">(optional)</span>
              </label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="A short message guests will see when they open the upload page…"
                rows={3} maxLength={300}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors resize-none" />
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}

            <div className="bg-amber-500/5 border border-amber-500/20 text-amber-400/80 text-sm px-4 py-3 rounded-xl">
              📸 Free plan includes up to <strong className="text-amber-400">30 photos</strong> per event.
            </div>

            <div className="flex gap-3 pt-1">
              <Link href="/dashboard"
                className="flex-1 text-center py-3 rounded-xl border border-gray-700 text-gray-400 font-medium hover:border-gray-600 hover:text-gray-300 transition-colors text-sm">
                Cancel
              </Link>
              <button type="submit" disabled={loading || !name.trim()}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 rounded-xl hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20 text-sm">
                {loading ? 'Creating…' : 'Create event →'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
