'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getEventUrl } from '@/lib/utils'
import { Event, Photo } from '@/types/database'
import { downloadSinglePhoto, downloadAllPhotosAsZip } from '@/lib/download'
import {
  Copy,
  QrCode,
  ArrowLeft,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Download,
  Share2,
  Images,
  ExternalLink,
  Check,
  Sparkles,
  Camera,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import QRCode from 'qrcode'

interface EventDetailClientProps {
  eventId: string
}

export default function EventDetailClient({ eventId }: EventDetailClientProps) {
  const supabase = createClient()
  const [event, setEvent] = useState<Event | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  // Download state
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState('')
  const [downloadPercent, setDownloadPercent] = useState(0)

  const fetchEvent = useCallback(async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()
    if (data) setEvent(data)
  }, [supabase, eventId])

  const fetchPhotos = useCallback(async () => {
    const { data } = await supabase
      .from('photos')
      .select('*')
      .eq('event_id', eventId)
      .order('uploaded_at', { ascending: false })
    if (data) setPhotos(data)
    setLoading(false)
  }, [supabase, eventId])

  useEffect(() => {
    fetchEvent()
    fetchPhotos()
  }, [fetchEvent, fetchPhotos])

  // Realtime subscription — photos appear live
  useEffect(() => {
    const channel = supabase
      .channel(`photos:event_id=eq.${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'photos',
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          setPhotos((prev) => [payload.new as Photo, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, eventId])

  // Generate Peach-branded QR code
  useEffect(() => {
    if (!event) return
    QRCode.toDataURL(getEventUrl(event.code), {
      width: 320,
      margin: 2,
      color: { dark: '#3D0E05', light: '#FFFFFF' },
    }).then(setQrDataUrl)
  }, [event])

  async function copyLink() {
    if (!event) return
    await navigator.clipboard.writeText(getEventUrl(event.code))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleShareNative() {
    if (!event) return
    const url = getEventUrl(event.code)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${event.name} on Pixlane`,
          text: `Share your photos for ${event.name}! No app required.`,
          url,
        })
      } catch {
        copyLink()
      }
    } else {
      copyLink()
    }
  }

  async function toggleActive() {
    if (!event) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('events')
      .update({ is_active: !event.is_active })
      .eq('id', event.id)
      .select()
      .single()
    if (data) setEvent(data as Event)
  }

  async function deletePhoto(photo: Photo) {
    if (!confirm('Are you sure you want to delete this photo from the event?')) return
    await supabase.storage.from('photos').remove([photo.file_path])
    await supabase.from('photos').delete().eq('id', photo.id)
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
  }

  async function handleDownloadAll() {
    if (!event || photos.length === 0 || isDownloadingAll) return
    setIsDownloadingAll(true)
    setDownloadProgress('Preparing files...')
    setDownloadPercent(5)

    try {
      await downloadAllPhotosAsZip(
        photos,
        event.name,
        (progressText, percent) => {
          setDownloadProgress(progressText)
          setDownloadPercent(percent)
        }
      )
    } catch (err) {
      console.error('Client zip failed, redirecting to server endpoint:', err)
      window.location.href = `/api/events/${event.id}/download`
    } finally {
      setIsDownloadingAll(false)
      setDownloadProgress('')
      setDownloadPercent(0)
    }
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#FFFDFB] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#FF7654] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const shareUrl = getEventUrl(event.code)

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#221513] pb-24 md:pb-12">
      {/* ─── APP HEADER ─── */}
      <header className="bg-white border-b border-[#FFEAE4] sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-xl bg-[#FFF6F3] border border-[#FFEAE4] flex items-center justify-center text-[#6E554F] hover:text-[#221513] hover:bg-[#FFEAE4] transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="truncate">
              <h1 className="font-extrabold text-sm sm:text-base text-[#221513] truncate">
                {event.name}
              </h1>
              <p className="text-[11px] text-[#6E554F] font-mono">Code: {event.code}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                event.is_active ? 'bg-[#FFEAE4] text-[#D43E19]' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  event.is_active ? 'bg-[#FF7654]' : 'bg-gray-400'
                }`}
              />
              <span className="hidden sm:inline">{event.is_active ? 'Accepting' : 'Closed'}</span>
            </span>

            {/* Note: NO target="_blank" — opens smoothly in same tab */}
            <Link
              href={`/e/${event.code}/gallery`}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#FF7654] hover:bg-[#F45732] text-white px-3 py-1.5 rounded-xl shadow-xs transition-colors"
            >
              <Images className="w-3.5 h-3.5" />
              <span>Live Gallery</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: QR Card & Host Management Controls */}
        <aside className="lg:col-span-4 space-y-5">
          {/* QR Card */}
          <div className="bg-white rounded-3xl border border-[#FFEAE4] shadow-xs p-6 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D43E19] bg-[#FFEAE4] px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan to Upload</span>
            </div>

            {qrDataUrl && (
              <div className="bg-[#FFFDFB] border border-[#FFEAE4] p-3 rounded-2xl inline-block shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt={`QR Code for ${event.name}`}
                  className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-xl"
                />
              </div>
            )}

            <p className="mt-4 font-mono text-xl font-extrabold text-[#D43E19] tracking-widest">
              {event.code}
            </p>

            {event.event_date && (
              <p className="text-xs text-[#6E554F] mt-1">
                {format(new Date(event.event_date), 'MMMM d, yyyy')}
              </p>
            )}

            <button
              onClick={handleShareNative}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-[#FFF6F3] hover:bg-[#FFEAE4] text-[#D43E19] border border-[#FFD5C8] font-bold text-xs py-2.5 rounded-xl transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share QR with Friends</span>
            </button>
          </div>

          {/* Share Link Card */}
          <div className="bg-white rounded-3xl border border-[#FFEAE4] shadow-xs p-5 space-y-3">
            <p className="text-xs font-bold text-[#221513] uppercase tracking-wider">
              Guest Upload Link
            </p>

            <div className="flex items-center gap-2 bg-[#FFFDFB] border border-[#FFEAE4] rounded-xl px-3 py-2">
              <span className="text-xs text-[#6E554F] truncate flex-1 font-mono">
                {shareUrl}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={copyLink}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#FF7654] hover:bg-[#F45732] text-white text-xs font-bold py-2.5 rounded-xl shadow-xs transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              {/* Note: NO target="_blank" — opens smoothly in same tab */}
              <Link
                href={`/e/${event.code}`}
                className="flex items-center justify-center w-10 bg-[#FFF6F3] text-[#6E554F] hover:text-[#221513] rounded-xl border border-[#FFEAE4] transition-colors"
                title="Open Guest Upload Page"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Album Controls */}
          <div className="bg-white rounded-3xl border border-[#FFEAE4] shadow-xs p-5 space-y-3">
            <p className="text-xs font-bold text-[#221513] uppercase tracking-wider">
              Album Controls
            </p>

            <button
              onClick={toggleActive}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl bg-[#FFFDFB] border border-[#FFEAE4] hover:bg-[#FFF6F3] transition-colors text-xs font-bold text-[#221513]"
            >
              <span>{event.is_active ? 'Accepting Uploads' : 'Uploads Paused'}</span>
              {event.is_active ? (
                <ToggleRight className="w-6 h-6 text-[#FF7654]" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-gray-400" />
              )}
            </button>

            {/* Note: NO target="_blank" — opens smoothly in same tab */}
            <Link
              href={`/e/${event.code}/gallery`}
              className="w-full flex items-center justify-center gap-2 border border-[#FFD5C8] bg-[#FFF6F3] text-[#D43E19] text-xs font-bold py-2.5 rounded-xl hover:bg-[#FFEAE4] transition-colors"
            >
              <Images className="w-3.5 h-3.5" />
              <span>Open Live Gallery View</span>
            </Link>
          </div>

          {/* Stats Progress */}
          <div className="bg-white rounded-3xl border border-[#FFEAE4] shadow-xs p-5">
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="text-[#6E554F]">Photos Uploaded</span>
              <span className="text-[#D43E19]">
                {photos.length} / {event.photo_limit}
              </span>
            </div>
            <div className="w-full bg-[#FFF6F3] rounded-full h-2 overflow-hidden border border-[#FFEAE4]">
              <div
                className="bg-gradient-to-r from-[#FF7654] to-[#FFA387] h-full rounded-full transition-all"
                style={{
                  width: `${Math.min((photos.length / event.photo_limit) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </aside>

        {/* Right Column: Photos Grid & Download Action */}
        <div className="lg:col-span-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-extrabold text-[#221513]">
                Event Photos ({photos.length})
              </h2>
              <p className="text-xs text-[#6E554F]">
                Real-time gallery stream from your guests
              </p>
            </div>

            {/* Batch ZIP Download Action */}
            {photos.length > 0 && (
              <button
                onClick={handleDownloadAll}
                disabled={isDownloadingAll}
                className="inline-flex items-center justify-center gap-2 bg-[#FF7654] hover:bg-[#F45732] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all disabled:opacity-60"
              >
                {isDownloadingAll ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{downloadProgress || 'Preparing ZIP...'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download All (ZIP)</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Download Progress Bar Overlay */}
          {isDownloadingAll && (
            <div className="bg-[#FFEAE4] border border-[#FFD5C8] rounded-2xl p-4 mb-5 flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-[#D43E19]">
                <span>{downloadProgress}</span>
                <span>{downloadPercent}%</span>
              </div>
              <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#FF7654] h-full rounded-full transition-all duration-200"
                  style={{ width: `${downloadPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Photo Gallery Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-48 bg-white rounded-3xl border border-[#FFEAE4]">
              <div className="w-8 h-8 border-3 border-[#FF7654] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : photos.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-[#FFD5C8] p-12 text-center shadow-xs">
              <div className="w-14 h-14 bg-[#FFEAE4] rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#D43E19]">
                <Camera className="w-7 h-7" />
              </div>
              <p className="text-base font-extrabold text-[#221513] mb-1">No photos yet</p>
              <p className="text-xs text-[#6E554F] max-w-xs mx-auto mb-5">
                Share your QR code or upload link with guests to start seeing photos here live.
              </p>
              <button
                onClick={copyLink}
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#FF7654] text-white px-4 py-2 rounded-xl shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy Guest Link'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo, i) => (
                <div
                  key={photo.id}
                  className="relative group aspect-square rounded-2xl overflow-hidden bg-[#FFEAE4] border border-[#FFEAE4] shadow-xs"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.file_url}
                    alt={`Photo by ${photo.uploader_name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Overlay Gradient on Hover / Mobile Touch */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5">
                    {/* Top Row: Individual Download Button */}
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() =>
                          downloadSinglePhoto(
                            photo.file_url,
                            `pixlane_${event.code}_${i + 1}_${photo.uploader_name || 'photo'}.jpg`
                          )
                        }
                        className="w-7 h-7 rounded-lg bg-black/50 hover:bg-[#FF7654] text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                        title="Download this picture"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deletePhoto(photo)}
                        className="w-7 h-7 rounded-lg bg-black/50 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom Row: Uploader Name */}
                    <div className="truncate">
                      <span className="text-white text-[11px] font-bold truncate block drop-shadow-xs">
                        {photo.uploader_name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ─── MOBILE STICKY BOTTOM BAR ─── */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#FFEAE4] p-3 md:hidden z-30 flex items-center justify-between gap-2 safe-bottom">
        <button
          onClick={copyLink}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#FFEAE4] bg-[#FFF6F3] text-xs font-bold text-[#6E554F]"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Link'}</span>
        </button>

        {photos.length > 0 && (
          <button
            onClick={handleDownloadAll}
            disabled={isDownloadingAll}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#FFF6F3] border border-[#FFD5C8] text-xs font-bold text-[#D43E19]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloadingAll ? 'Zipping...' : 'Download ZIP'}</span>
          </button>
        )}

        <Link
          href={`/e/${event.code}/gallery`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#FF7654] text-white text-xs font-bold shadow-xs"
        >
          <Images className="w-3.5 h-3.5" />
          <span>Gallery</span>
        </Link>
      </div>
    </div>
  )
}
