'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getEventUrl } from '@/lib/utils'
import { Event, Photo } from '@/types/database'
import { Copy, QrCode, ExternalLink, ArrowLeft, Trash2, ToggleLeft, ToggleRight, Download } from 'lucide-react'
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
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'photos',
        filter: `event_id=eq.${eventId}`,
      }, (payload) => {
        setPhotos((prev) => [payload.new as Photo, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabase, eventId])

  // Generate QR code
  useEffect(() => {
    if (!event) return
    QRCode.toDataURL(getEventUrl(event.code), {
      width: 300,
      margin: 2,
      color: { dark: '#0f766e', light: '#ffffff' },
    }).then(setQrDataUrl)
  }, [event])

  async function copyLink() {
    if (!event) return
    await navigator.clipboard.writeText(getEventUrl(event.code))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
    if (!confirm('Delete this photo?')) return
    await supabase.storage.from('photos').remove([photo.file_path])
    await supabase.from('photos').delete().eq('id', photo.id)
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const shareUrl = getEventUrl(event.code)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-bold text-gray-700 truncate">{event.name}</span>
          <span className={`ml-auto text-xs px-2 py-1 rounded-full font-medium ${
            event.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {event.is_active ? 'Active' : 'Closed'}
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        {/* Left: QR + Share */}
        <aside className="space-y-5">
          {/* QR Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <p className="text-sm font-medium text-gray-600 mb-4">
              <QrCode className="w-4 h-4 inline mr-1" />
              Scan to upload
            </p>
            {qrDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="QR code" className="w-48 h-48 mx-auto rounded-xl" />
            )}
            <p className="mt-3 font-mono text-lg font-bold text-teal-700 tracking-widest">
              {event.code}
            </p>
            {event.event_date && (
              <p className="text-xs text-gray-400 mt-1">
                {format(new Date(event.event_date), 'MMMM d, yyyy')}
              </p>
            )}
          </div>

          {/* Share Link */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <p className="text-sm font-medium text-gray-700">Share link</p>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <span className="text-xs text-gray-500 truncate flex-1">{shareUrl}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyLink}
                className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white text-sm font-medium py-2 rounded-xl hover:bg-teal-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy link'}
              </button>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <p className="text-sm font-medium text-gray-700">Controls</p>
            <button
              onClick={toggleActive}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-sm"
            >
              <span className="text-gray-700">
                {event.is_active ? 'Accepting uploads' : 'Uploads closed'}
              </span>
              {event.is_active
                ? <ToggleRight className="w-5 h-5 text-teal-600" />
                : <ToggleLeft className="w-5 h-5 text-gray-400" />
              }
            </button>
            <a
              href={`/e/${event.code}/gallery`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium py-2.5 rounded-xl hover:border-teal-300 hover:text-teal-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View gallery
            </a>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-medium text-gray-700 mb-3">Stats</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Photos uploaded</span>
              <span className="font-bold text-teal-700">{photos.length} / {event.photo_limit}</span>
            </div>
            <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-teal-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((photos.length / event.photo_limit) * 100, 100)}%` }}
              />
            </div>
          </div>
        </aside>

        {/* Right: Gallery */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Gallery
              {photos.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  {photos.length} photo{photos.length !== 1 ? 's' : ''}
                </span>
              )}
            </h2>
            {photos.length > 0 && (
              <a
                href={`/api/events/${event.id}/download`}
                className="flex items-center gap-2 text-sm text-teal-600 font-medium hover:text-teal-700"
              >
                <Download className="w-4 h-4" />
                Download all
              </a>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : photos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
              <p className="text-gray-400 text-lg mb-2">No photos yet</p>
              <p className="text-sm text-gray-400">Share the link or QR code with your guests to start collecting!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.file_url}
                    alt={`Photo by ${photo.uploader_name}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end opacity-0 group-hover:opacity-100">
                    <div className="w-full flex items-center justify-between px-3 py-2">
                      <span className="text-white text-xs font-medium truncate">
                        {photo.uploader_name}
                      </span>
                      <button
                        onClick={() => deletePhoto(photo)}
                        className="text-red-300 hover:text-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
