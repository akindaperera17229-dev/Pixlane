'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Event, Photo } from '@/types/database'
import { downloadSinglePhoto, downloadAllPhotosAsZip } from '@/lib/download'
import {
  Camera,
  Upload,
  Download,
  Share2,
  X,
  ArrowLeft,
  Images,
  Sparkles,
  Check,
  Loader2,
  Maximize2,
  Play,
  Film,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import ThemeStage from '@/components/ThemeStage'

interface GalleryPageProps {
  code: string
}

export default function GalleryPage({ code }: GalleryPageProps) {
  const supabase = createClient()
  const [event, setEvent] = useState<Event | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selected, setSelected] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  // Batch download state
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState('')
  const [downloadPercent, setDownloadPercent] = useState(0)

  const load = useCallback(async () => {
    const { data: ev } = await supabase
      .from('events')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()
    if (ev) setEvent(ev as unknown as Event)

    const { data: ph } = await supabase
      .from('photos')
      .select('*')
      .eq('event_id', (ev as unknown as Event)?.id)
      .order('uploaded_at', { ascending: false })
    if (ph) setPhotos(ph as unknown as Photo[])
    setLoading(false)
  }, [supabase, code])

  useEffect(() => {
    load()
  }, [load])

  // Live real-time updates
  useEffect(() => {
    if (!event) return
    const channel = supabase
      .channel(`gallery:${event.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'photos',
          filter: `event_id=eq.${event.id}`,
        },
        (payload) => {
          setPhotos((prev) => [payload.new as Photo, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, event])

  // Keyboard navigation for Lightbox
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${event?.name || 'Pixlane'} Gallery`,
          text: `Check out the photos and video clips from ${event?.name || 'our event'}!`,
          url,
        })
      } catch {
        // user cancelled or fallback
      }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function handleDownloadAll() {
    if (!event || photos.length === 0 || isDownloadingAll) return
    setIsDownloadingAll(true)
    setDownloadProgress('Starting...')
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
      console.error('Client zip failed, falling back to server route:', err)
      window.location.href = `/api/events/${event.id}/download`
    } finally {
      setIsDownloadingAll(false)
      setDownloadProgress('')
      setDownloadPercent(0)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#140E0C] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#FF7654] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#140E0C] text-white flex items-center justify-center p-4 text-center">
        <div className="max-w-sm bg-[#221513] border border-[#3D0E05] p-8 rounded-3xl">
          <div className="w-14 h-14 bg-[#3D0E05] text-[#FF7654] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Camera className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold mb-1">Event not found</h2>
          <p className="text-xs text-white/60 mb-6">
            The event code might be incorrect or removed by the host.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#FF7654] text-white px-5 py-2.5 rounded-xl"
          >
            Go to Pixlane Home
          </Link>
        </div>
      </div>
    )
  }

  const uploaders = [...new Set(photos.map((p) => p.uploader_name))]
  const totalVideos = photos.filter((p) => p.media_type === 'video').length
  const totalPhotos = photos.length - totalVideos

  return (
    <div className="min-h-screen text-[#FFFDFB] pb-24 md:pb-12 selection:bg-[#FF7654] selection:text-white relative overflow-hidden">
      {/* ─── 4-LAYER ANIMATED THEME STAGE (Auto-pauses when lightbox is open) ─── */}
      <ThemeStage themeId={event.theme_template} paused={!!selected} />

      {/* ─── APP HEADER ─── */}
      <header className="sticky top-0 bg-[#140E0C]/90 backdrop-blur-xl border-b border-white/10 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              href={`/e/${code}`}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Back to Upload"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="truncate">
              <h1 className="font-extrabold text-sm sm:text-base text-white truncate">
                {event.name}
              </h1>
              {event.event_date && (
                <p className="text-[11px] text-white/60">
                  {format(new Date(event.event_date), 'MMMM d, yyyy')}
                </p>
              )}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {photos.length > 0 && (
              <button
                onClick={handleDownloadAll}
                disabled={isDownloadingAll}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/15 text-white px-3.5 py-2 rounded-xl border border-white/15 transition-colors disabled:opacity-50"
              >
                {isDownloadingAll ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{downloadPercent}%</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-[#FF7654]" />
                    <span>Download All (ZIP)</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-colors"
              title="Share Gallery"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <Link
              href={`/e/${code}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-[#FF7654] to-[#FFA387] hover:from-[#F45732] hover:to-[#FF8E72] text-white px-3.5 py-2 rounded-xl shadow-md shadow-[#FF7654]/25 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Add Photos & Videos</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Gallery Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-bold text-white/80">
            <span className="flex items-center gap-1.5 text-[#FF7654]">
              <Images className="w-4 h-4" />
              <span>{totalPhotos} photos</span>
            </span>

            {totalVideos > 0 && (
              <>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5 text-[#FFA387]">
                  <Film className="w-4 h-4" />
                  <span>{totalVideos} videos</span>
                </span>
              </>
            )}

            <span>&bull;</span>
            <span>{uploaders.length} contributors</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Live Sync Active</span>
          </div>
        </div>

        {/* Live ZIP Download Feedback Bar */}
        {isDownloadingAll && (
          <div className="bg-[#221513] border border-[#FF7654]/40 rounded-2xl p-4 mb-6 backdrop-blur-md">
            <div className="flex justify-between text-xs font-bold text-[#FF7654] mb-2">
              <span>{downloadProgress}</span>
              <span>{downloadPercent}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#FF7654] to-[#FFA387] h-full rounded-full transition-all duration-200"
                style={{ width: `${downloadPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {photos.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md mx-auto backdrop-blur-md">
            <div className="w-14 h-14 bg-[#3D0E05] text-[#FF7654] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Camera className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-white mb-1">No moments added yet</h3>
            <p className="text-xs text-white/60 mb-6">
              Be the first to share photos or video clips from {event.name}!
            </p>
            <Link
              href={`/e/${code}`}
              className="inline-flex items-center gap-2 bg-[#FF7654] hover:bg-[#F45732] text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#FF7654]/25 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Photos or Videos Now</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Masonry Photo & Video Grid */}
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
              {photos.map((photo, idx) => {
                const isVideo = photo.media_type === 'video'
                const ext = photo.file_url.split('.').pop()?.toLowerCase() || ''
                const isLikelyVideo = isVideo || ['mp4', 'mov', 'webm', 'm4v'].includes(ext)

                return (
                  <div
                    key={photo.id}
                    className="break-inside-avoid relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 group cursor-pointer shadow-xs backdrop-blur-xs"
                    onClick={() => setSelected(photo)}
                  >
                    {isLikelyVideo ? (
                      <div className="relative aspect-[3/4] bg-[#221513] flex items-center justify-center overflow-hidden">
                        <video
                          src={photo.file_url}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-95 transition-opacity"
                          preload="metadata"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo.file_url}
                        alt={`Photo by ${photo.uploader_name}`}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}

                    {/* Gradient Overlay & Individual Download Button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5">
                      {/* Top Download Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            downloadSinglePhoto(
                              photo.file_url,
                              `pixlane_${event.code}_${idx + 1}_${photo.uploader_name || 'media'}.${
                                isLikelyVideo ? 'mp4' : 'jpg'
                              }`
                            )
                          }}
                          className="w-8 h-8 rounded-xl bg-black/60 hover:bg-[#FF7654] text-white flex items-center justify-center backdrop-blur-md transition-colors"
                          title="Download item"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Bottom Metadata */}
                      <div className="flex items-center justify-between text-[11px] text-white">
                        <span className="font-bold truncate drop-shadow-xs flex items-center gap-1">
                          {isLikelyVideo && <Film className="w-3 h-3 text-[#FFA387]" />}
                          <span>{photo.uploader_name}</span>
                        </span>
                        <Maximize2 className="w-3.5 h-3.5 text-white/70" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Contributors Section */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">
                Contributors ({uploaders.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {uploaders.map((name) => {
                  const count = photos.filter((p) => p.uploader_name === name).length
                  return (
                    <span
                      key={name}
                      className="bg-white/5 border border-white/10 text-white/90 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF7654]" />
                      <span>{name}</span>
                      <span className="text-white/40 text-[10px] font-mono">({count})</span>
                    </span>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </main>

      {/* ─── FULL-SCREEN LIGHTBOX (Supports Photos AND Videos!) ─── */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md"
          onClick={() => setSelected(null)}
        >
          {/* Lightbox Top Bar */}
          <div
            className="flex items-center justify-between w-full max-w-4xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-white/80">
              <span className="text-[#FF7654]">By {selected.uploader_name}</span>
              <span>&bull;</span>
              <span className="text-white/50">
                {format(new Date(selected.uploaded_at), 'MMM d, h:mm a')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const isVid = selected.media_type === 'video'
                  downloadSinglePhoto(
                    selected.file_url,
                    `pixlane_${event.code}_${selected.uploader_name || 'media'}.${isVid ? 'mp4' : 'jpg'}`
                  )
                }}
                className="flex items-center gap-1.5 text-xs font-bold bg-[#FF7654] hover:bg-[#F45732] text-white px-3.5 py-2 rounded-xl shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download High-Res</span>
              </button>

              <button
                onClick={() => setSelected(null)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Media Container */}
          <div
            className="flex-1 flex items-center justify-center p-2 sm:p-4 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            {selected.media_type === 'video' ? (
              <video
                src={selected.file_url}
                controls
                autoPlay
                playsInline
                className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl bg-black"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selected.file_url}
                alt={`Photo by ${selected.uploader_name}`}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />
            )}
          </div>

          <div className="text-center text-xs text-white/40 pb-2">
            Tap anywhere outside or press Escape to close
          </div>
        </div>
      )}

      {/* ─── STICKY MOBILE BOTTOM BAR ─── */}
      <div className="fixed bottom-0 inset-x-0 bg-[#140E0C]/95 backdrop-blur-md border-t border-white/10 p-3 sm:hidden z-30 flex items-center justify-between gap-2 safe-bottom">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/80"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Share'}</span>
        </button>

        {photos.length > 0 && (
          <button
            onClick={handleDownloadAll}
            disabled={isDownloadingAll}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-[#FF7654]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloadingAll ? `${downloadPercent}%` : 'Download All'}</span>
          </button>
        )}

        <Link
          href={`/e/${code}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7654] to-[#FFA387] text-white text-xs font-bold shadow-xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Add Media</span>
        </Link>
      </div>
    </div>
  )
}
