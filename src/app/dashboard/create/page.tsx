'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateEventCode } from '@/lib/utils'
import {
  ArrowLeft,
  Calendar,
  FileText,
  Camera,
  Sparkles,
  Check,
  Video,
  Crown,
  Layers,
} from 'lucide-react'
import Link from 'next/link'
import PricingModal from '@/components/PricingModal'
import ThemeStage from '@/components/ThemeStage'
import Logo from '@/components/Logo'

const POPULAR_OCCASIONS: {
  emoji: string
  title: string
  hint: string
  template: string
}[] = [
  { emoji: '🌴', title: 'Outing / Trip', hint: 'Sunset beach, Ella, road trip waves', template: 'beach' },
  { emoji: '💍', title: 'Wedding / Poruwa', hint: 'Champagne rose gold & bokeh lights', template: 'wedding' },
  { emoji: '🎂', title: 'Birthday Bash', hint: 'Joyful floating sparkles & confetti', template: 'birthday' },
  { emoji: '🎓', title: 'Batch / Uni Event', hint: 'Electric modern aurora waves', template: 'batch' },
  { emoji: '🏮', title: 'Tradition / Festival', hint: 'Avurudu, Vesak glowing lanterns', template: 'festival' },
  { emoji: '🎉', title: 'Party / Night Out', hint: 'Ambient disco pulse glow', template: 'party' },
]

export default function CreateEventPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('beach')
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'wedding'>('free')
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  function handleSelectOccasion(title: string, template: string) {
    setSelectedTemplate(template)
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

    const photoLimit = selectedPlan === 'wedding' ? 9999 : selectedPlan === 'pro' ? 250 : 30
    const videoLimit = selectedPlan === 'wedding' ? 9999 : selectedPlan === 'pro' ? 15 : 3

    // First attempt: insert with all extended fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let res = await (supabase as any)
      .from('events')
      .insert({
        host_id: user.id,
        name: name.trim(),
        description: description.trim() || null,
        event_date: eventDate || null,
        code,
        is_active: true,
        photo_limit: photoLimit,
        video_limit: videoLimit,
        plan: selectedPlan,
        theme_template: selectedTemplate,
      })
      .select()
      .single()

    // Resilient fallback: if the Supabase table hasn't had the new columns migrated yet,
    // retry with core schema so event creation never fails for the host
    if (res.error && (res.error.message?.includes('schema cache') || res.error.message?.includes('column') || res.error.code === 'PGRST204')) {
      console.warn('Events table schema cache missing extended columns; retrying with core schema:', res.error.message)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res = await (supabase as any)
        .from('events')
        .insert({
          host_id: user.id,
          name: name.trim(),
          description: description.trim() || null,
          event_date: eventDate || null,
          code,
          is_active: true,
          photo_limit: photoLimit,
        })
        .select()
        .single()
    }

    if (res.error) {
      setError(res.error.message)
      setLoading(false)
      return
    }

    router.push(`/dashboard/events/${res.data.id}`)
  }

  return (
    <div className="min-h-screen text-[#221513] pb-16 relative theme-stage-active">
      {/* ─── LIVE 4-LAYER THEME PREVIEW ─── */}
      <ThemeStage themeId={selectedTemplate} />

      {/* ─── APP HEADER ─── */}
      <header className="bg-white/85 backdrop-blur-md border-b border-[#FFEAE4] sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 min-h-16 sm:h-20 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-xl bg-white border border-[#FFEAE4] flex items-center justify-center text-[#6E554F] hover:text-[#221513] hover:bg-[#FFEAE4] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-3">
              <Logo size="responsive" href="/" />
              <span className="text-xs text-[#FF7654] font-bold hidden sm:inline">&bull;</span>
              <span className="font-cinzel font-bold text-sm sm:text-base text-[#221513] tracking-wide">Create Event</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPricingModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D43E19] bg-[#FFEAE4] hover:bg-[#FFD5C8] px-3 py-1.5 rounded-xl border border-[#FFD5C8] transition-colors"
          >
            <Crown className="w-3.5 h-3.5 text-[#FF7654]" />
            <span className="capitalize">{selectedPlan} Plan</span>
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <span className="text-xs font-bold text-[#D43E19] bg-[#FFEAE4] px-3 py-1 rounded-full uppercase tracking-wider">
            Step 1 of 1
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#221513] mt-2">
            Set up your shared album
          </h1>
          <p className="text-xs sm:text-sm text-[#6E554F] mt-1">
            Pick a template theme for your animated background and give your event a name.
          </p>
        </div>

        {/* Animated Background Occasion Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold text-[#221513] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#FF7654]" />
              <span>Animated Theme Template</span>
            </label>
            <span className="text-[11px] text-[#FF7654] font-bold">
              Background updates live ✨
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {POPULAR_OCCASIONS.map((occ) => {
              const isSelected = selectedTemplate === occ.template
              return (
                <button
                  key={occ.title}
                  type="button"
                  onClick={() => handleSelectOccasion(occ.title, occ.template)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all backdrop-blur-xs ${
                    isSelected
                      ? 'border-[#FF7654] bg-white/95 shadow-md shadow-[#FF7654]/15 ring-2 ring-[#FF7654]'
                      : 'border-[#FFEAE4] bg-white/75 hover:bg-white'
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
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#FFEAE4] shadow-sm p-6 sm:p-7">
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
                <span>Guest Note / Message (optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Upload your candid photos, funny video clips, and group selfies here!"
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

            {/* Photos & Videos Allowance Info */}
            <div className="bg-[#FFF6F3] border border-[#FFEAE4] rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#FFEAE4] text-[#D43E19] flex items-center justify-center">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#221513]">
                    {selectedPlan === 'free'
                      ? 'Free Plan: 30 Photos + 3 Videos'
                      : selectedPlan === 'pro'
                      ? 'Pro Plan: 250 Photos + 15 Videos'
                      : 'Wedding Plan: Unlimited Photos & Videos'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPricingModal(true)}
                  className="text-xs font-bold text-[#FF7654] hover:underline"
                >
                  Change Plan
                </button>
              </div>

              <p className="text-[11px] text-[#6E554F] leading-relaxed">
                Guests can upload both photos and video clips directly from their smartphones in full quality.
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
                {loading ? 'Creating Album...' : 'Generate Album & QR →'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Pricing & Plan Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        currentPlan={selectedPlan}
        onSelectPlan={(plan) => setSelectedPlan(plan)}
      />
    </div>
  )
}
