'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateEventCode } from '@/lib/utils'
import { ArrowLeft, Calendar, FileText, Camera } from 'lucide-react'
import Link from 'next/link'

export default function CreateEventPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }

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
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-teal-700">Pixlane</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create a new event</h1>
          <p className="text-gray-500 mt-1">Fill in the details and we&apos;ll generate your shareable gallery link.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleCreate} className="space-y-6">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Nithya & Kamal's Wedding, Batch Trip 2026"
                required
                maxLength={80}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Event date <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Description <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short message guests will see when they open the upload page…"
                rows={3}
                maxLength={300}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Info note */}
            <div className="bg-teal-50 text-teal-700 text-sm px-4 py-3 rounded-xl">
              📸 Free plan includes up to <strong>30 photos</strong> per event. Upgrade anytime for unlimited.
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                href="/dashboard"
                className="flex-1 text-center py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:border-gray-300 transition-colors text-sm"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="flex-1 bg-teal-600 text-white font-semibold py-3 rounded-xl hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {loading ? 'Creating…' : 'Create event →'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
