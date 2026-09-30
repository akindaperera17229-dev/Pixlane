'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Event, Photo } from '@/types/database'
import { useDropzone } from 'react-dropzone'
import { downloadSinglePhoto, downloadAllPhotosAsZip } from '@/lib/download'
import {
  Upload,
  CheckCircle,
  Camera,
  Images,
  Sparkles,
  ArrowRight,
  User,
  X,
  Lock,
  Loader2,
  Video,
  Play,
  Film,
  Download,
  Share2,
  Check,
  Maximize2,
  Plus,
  ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { formatBytes } from '@/lib/utils'
import ThemeStage from '@/components/ThemeStage'
import Logo from '@/components/Logo'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB per file
const ACCEPTED_TYPES = {
  'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'],
  'video/*': ['.mp4', '.mov', '.webm', '.m4v'],
}

interface GuestUploadPageProps {
  code: string
}

export default function GuestUploadPage({ code }: GuestUploadPageProps) {
  const supabase = createClient()
  const [event, setEvent] = useState<Event | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selected, setSelected] = useState<Photo | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  // Upload drawer state (inline on the single page)
  const [showUploadDrawer, setShowUploadDrawer] = useState(false)
  const [uploaderName, setUploaderName] = useState('')
  const [nameSubmitted, setNameSubmitted] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadedCount, setUploadedCount] = useState(0)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  // Batch download state
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState('')
  const [downloadPercent, setDownloadPercent] = useState(0)
  const [copied, setCopied] = useState(false)

  const load = useCallback(async () => {
    const { data: ev } = await supabase
      .from('events')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()

    if (!ev) {
      setNotFound(true)
      setLoading(false)
      return
    }
    setEvent(ev as unknown as Event)

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

    // Restore nickname from session if already entered
    const saved = sessionStorage.getItem(`pixlane_name_${code}`)
    if (saved) {
      setUploaderName(saved)
      setNameSubmitted(true)
    }
  }, [load, code])

  // Live real-time updates for gallery
  useEffect(() => {
    if (!event) return
    const channel = supabase
      .channel(`event_media:${event.id}`)
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

  // Close lightbox on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function submitName(e: React.FormEvent) {
    e.preventDefault()
    if (!uploaderName.trim()) return
    sessionStorage.setItem(`pixlane_name_${code}`, uploaderName.trim())
    setNameSubmitted(true)
  }

  const onDrop = useCallback((accepted: File[]) => {
    setFiles((prev) => [...prev, ...accepted].slice(0, 15))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  })

  async function handleUpload() {
    if (!event || files.length === 0) return
    setUploading(true)
    setError('')
    let count = 0

    const currentVideosInBatch = files.filter((f) => f.type.startsWith('video/')).length
    const currentUploadedVideos = photos.filter((p) => p.media_type === 'video').length
    const allowedVideoLimit = event.video_limit ?? 3

    if (currentUploadedVideos + currentVideosInBatch > allowedVideoLimit) {
      setError(
        `This album allows up to ${allowedVideoLimit} videos on its plan (${currentUploadedVideos} already uploaded). Please remove some videos or ask the host to upgrade!`
      )
      setUploading(false)
      return
    }

    for (const file of files) {
      const isVideo = file.type.startsWith('video/')
      const mediaType = isVideo ? 'video' : 'photo'
      const ext = file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg')
      const path = `${event.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: storageErr } = await supabase.storage
        .from('photos')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (storageErr) {
        setError(`Upload stopped: ${storageErr.message}`)
        break
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('photos').getPublicUrl(path)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let insertRes = await (supabase.from('photos') as any).insert({
        event_id: event.id,
        uploader_name: uploaderName.trim(),
        file_url: publicUrl,
        file_path: path,
        file_size: file.size,
        media_type: mediaType,
      })

      // Fallback if media_type column does not exist yet in photos table
      if (insertRes.error && (insertRes.error.message?.includes('schema cache') || insertRes.error.message?.includes('column') || insertRes.error.code === 'PGRST204')) {
        insertRes = await (supabase.from('photos') as any).insert({
          event_id: event.id,
          uploader_name: uploaderName.trim(),
          file_url: publicUrl,
          file_path: path,
          file_size: file.size,
        })
      }

      count++
      setUploadedCount(count)
    }

    setUploading(false)
    if (count === files.length) {
      setDone(true)
      setTimeout(() => {
        setDone(false)
        setFiles([])
        setUploadedCount(0)
        setShowUploadDrawer(false)
      }, 2500)
    }
  }

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${event?.name || 'Pixlane'} Event Album`,
          text: `Share and see all photos & videos from ${event?.name || 'our event'}!`,
          url,
        })
      } catch {
        // user cancelled
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

  // ── Render States ──

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDFB] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#FF7654] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !event) {
    return (
      <div className="min-h-screen bg-[#FFFDFB] flex items-center justify-center p-4 text-center">
        <div className="max-w-sm bg-white p-8 rounded-3xl border border-[#FFEAE4] shadow-xs">
          <div className="w-14 h-14 bg-[#FFEAE4] text-[#D43E19] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Camera className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold font-lora text-[#221513] mb-1">Event Not Found</h2>
          <p className="text-xs text-[#6E554F] mb-6">
            Please double-check your event code or scan the QR code again.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#FF7654] text-white px-5 py-2.5 rounded-xl shadow-xs"
          >
            Go to Pixlane Home
          </Link>
        </div>
      </div>
    )
  }

  const isWedding = (event.theme_template || '').toLowerCase() === 'wedding'
  const isParty = (event.theme_template || '').toLowerCase() === 'party'
  const isFestival = (event.theme_template || '').toLowerCase() === 'festival'

  const totalVideos = photos.filter((p) => p.media_type === 'video').length
  const totalPhotos = photos.length - totalVideos
  const uploaders = [...new Set(photos.map((p) => p.uploader_name))]

  return (
    <div className="min-h-screen text-[#221513] pb-24 relative overflow-x-hidden theme-stage-active">
      {/* ─── 4-LAYER THEME STAGE (Background Silhouette + Falling Petals / Effects) ─── */}
      <ThemeStage themeId={event.theme_template} eventName={event.name} paused={!!selected} />

      {/* ─── APP HEADER ─── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#FFEAE4] shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 min-h-16 sm:h-20 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Logo size="responsive" href="/" />
            <div className="truncate pl-2 border-l border-[#FFEAE4]">
              <span className="text-[10px] font-bold text-[#FF7654] uppercase tracking-wider block">
                Live Album
              </span>
              <p className="font-cinzel font-bold text-xs sm:text-sm text-[#221513] truncate">{event.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {photos.length > 0 && (
              <button
                onClick={handleDownloadAll}
                disabled={isDownloadingAll}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold bg-[#FFF6F3] hover:bg-[#FFEAE4] text-[#D43E19] px-3.5 py-2 rounded-xl border border-[#FFD5C8] transition-colors disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloadingAll ? `${downloadPercent}%` : 'Download All (ZIP)'}</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-[#FFF6F3] text-[#6E554F] border border-[#FFEAE4] shadow-xs transition-colors flex items-center gap-1"
              title="Share Album"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline text-xs font-bold">Share</span>
            </button>

            {event.is_active && (
              <button
                onClick={() => setShowUploadDrawer(true)}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold bg-[#FF7654] hover:bg-[#F45732] text-white px-3.5 py-2 rounded-xl shadow-md shadow-[#FF7654]/25 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Media</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT CONTAINER (Relative z-10 so it's strictly above background) ─── */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Event Hero Title Card with Curated Google Fonts */}
        <div className="text-center pt-2 pb-4">
          <div className="inline-flex items-center gap-1.5 bg-white/80 border border-[#FFD5C8] text-[#D43E19] text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-xs backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-[#FF7654]" />
            <span>Shared Event Album</span>
          </div>

          {/* Typography Switcher based on Occasion */}
          <h1
            className={`tracking-tight text-[#221513] mb-2 leading-tight ${
              isWedding
                ? 'font-cursive text-4xl sm:text-6xl text-[#C83B18]'
                : 'font-cinzel text-2xl sm:text-4xl font-bold'
            }`}
          >
            {event.name}
          </h1>

          {event.event_date && (
            <p className="text-xs sm:text-sm font-lora italic text-[#7D574E]">
              {format(new Date(event.event_date), 'MMMM d, yyyy')}
            </p>
          )}

          {event.description && (
            <p className="text-xs sm:text-sm text-[#6E554F] max-w-md mx-auto mt-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#FFEAE4]">
              {event.description}
            </p>
          )}

          {/* Live Sync Status Bar */}
          <div className="flex items-center justify-center gap-4 text-xs font-bold text-[#6E554F] mt-4">
            <span className="flex items-center gap-1 text-[#FF7654]">
              <Images className="w-3.5 h-3.5" />
              <span>{totalPhotos} photos</span>
            </span>
            {totalVideos > 0 && (
              <>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-[#FFA387]">
                  <Film className="w-3.5 h-3.5" />
                  <span>{totalVideos} videos</span>
                </span>
              </>
            )}
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-green-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Live Sync Active</span>
            </span>
          </div>
        </div>

        {/* ─── INLINE UPLOAD SECTION / DRAWER ─── */}
        {showUploadDrawer && event.is_active && (
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl border-2 border-[#FF7654] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold text-[#D43E19] uppercase tracking-wider">
                  Single-Page Upload
                </span>
                <h2 className="font-bold font-lora text-lg text-[#221513]">
                  {nameSubmitted ? `Ready to drop shots, ${uploaderName}! 📸` : "What's your name?"}
                </h2>
              </div>
              <button
                onClick={() => setShowUploadDrawer(false)}
                className="w-8 h-8 rounded-full bg-[#FFF6F3] text-[#6E554F] hover:text-[#221513] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: Name */}
            {!nameSubmitted ? (
              <form onSubmit={submitName} className="space-y-4">
                <p className="text-xs text-[#6E554F]">
                  Enter your name so everyone knows who took these moments:
                </p>
                <div className="relative">
                  <User className="w-4 h-4 text-[#FF7654] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={uploaderName}
                    onChange={(e) => setUploaderName(e.target.value)}
                    placeholder="e.g. Kavindu, Nethmi, Sahan..."
                    required
                    maxLength={30}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FFFDFB] border border-[#FFD5C8] text-[#221513] focus:outline-none focus:ring-2 focus:ring-[#FF7654] text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!uploaderName.trim()}
                  className="w-full bg-[#FF7654] hover:bg-[#F45732] text-white font-bold py-3 rounded-2xl shadow-xs transition-all text-sm"
                >
                  Continue to Select Media →
                </button>
              </form>
            ) : done ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-[#FF7654] mx-auto mb-2 animate-bounce" />
                <h3 className="font-bold font-lora text-lg text-[#221513]">Uploaded to Gallery! 🎉</h3>
                <p className="text-xs text-[#6E554F] mt-1">Your moments are now live in the album below.</p>
              </div>
            ) : (
              /* Step 2: Dropzone */
              <div className="space-y-4">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? 'border-[#FF7654] bg-[#FFEAE4]'
                      : 'border-[#FFD5C8] bg-[#FFFDFB]/80 hover:bg-[#FFF6F3]'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="w-12 h-12 rounded-2xl bg-[#FFEAE4] text-[#D43E19] flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-[#221513]">
                    {isDragActive ? 'Drop them right here!' : 'Tap to choose Photos or Videos'}
                  </p>
                  <p className="text-xs text-[#6E554F] mt-1">
                    Select from library or snap with camera &bull; Full HD (max 50MB)
                  </p>
                </div>

                {/* Selected Previews */}
                {files.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#221513] mb-2">
                      <span>{files.length} items selected ({formatBytes(files.reduce((s, f) => s + f.size, 0))})</span>
                      <button onClick={() => setFiles([])} className="text-red-500 hover:underline">
                        Clear all
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {files.map((file, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-[#221513] border border-[#FFEAE4]">
                          {file.type.startsWith('video/') ? (
                            <div className="w-full h-full flex items-center justify-center text-white">
                              <Play className="w-6 h-6 text-[#FF7654] fill-[#FF7654]" />
                            </div>
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                          )}
                          <button
                            onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                            className="w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center absolute top-1 right-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={uploading || files.length === 0}
                  className="w-full bg-[#FF7654] hover:bg-[#F45732] text-white font-extrabold py-3.5 rounded-2xl shadow-md disabled:opacity-60 transition-all text-sm flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading {uploadedCount} of {files.length}...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload {files.length > 0 ? `${files.length} Items` : 'Now'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Live ZIP Progress Bar */}
        {isDownloadingAll && (
          <div className="bg-[#FFEAE4] border border-[#FFD5C8] rounded-2xl p-4 flex flex-col gap-2">
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

        {/* ─── LIVE GALLERY STREAM (ON THE SAME SINGLE PAGE) ─── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-cinzel text-[#221513]">
              Live Gallery Stream
            </h2>
            {photos.length > 0 && (
              <span className="text-xs font-bold text-[#6E554F]">
                {photos.length} moments captured
              </span>
            )}
          </div>

          {photos.length === 0 ? (
            <div className="bg-white/85 backdrop-blur-md rounded-3xl border border-dashed border-[#FFD5C8] p-12 text-center shadow-xs">
              <div className="w-14 h-14 bg-[#FFEAE4] text-[#D43E19] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Camera className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold font-cinzel text-[#221513] mb-1">No moments yet</h3>
              <p className="text-xs text-[#6E554F] max-w-xs mx-auto mb-4">
                Be the first to upload photos or video clips from {event.name}!
              </p>
              {event.is_active && (
                <button
                  onClick={() => setShowUploadDrawer(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#FF7654] text-white px-5 py-2.5 rounded-xl shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload First Photo or Video</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo, idx) => {
                const isVideo = photo.media_type === 'video'
                return (
                  <div
                    key={photo.id}
                    className="relative group aspect-square rounded-2xl overflow-hidden bg-[#221513] border border-[#FFEAE4] shadow-xs cursor-pointer"
                    onClick={() => setSelected(photo)}
                  >
                    {isVideo ? (
                      <div className="w-full h-full relative">
                        <video
                          src={photo.file_url}
                          className="w-full h-full object-cover opacity-85"
                          preload="metadata"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-9 h-9 rounded-full bg-black/60 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo.file_url}
                        alt={`Photo by ${photo.uploader_name}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}

                    {/* Gradient Overlay & Individual Download Button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5">
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            downloadSinglePhoto(
                              photo.file_url,
                              `pixlane_${event.code}_${idx + 1}_${photo.uploader_name || 'media'}.${
                                isVideo ? 'mp4' : 'jpg'
                              }`
                            )
                          }}
                          className="w-7 h-7 rounded-lg bg-black/50 hover:bg-[#FF7654] text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                          title="Download item"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="truncate">
                        <span className="text-white text-[11px] font-bold truncate block drop-shadow-xs flex items-center gap-1">
                          {isVideo && <Film className="w-3 h-3 text-[#FFA387]" />}
                          <span>{photo.uploader_name}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Contributors */}
        {uploaders.length > 0 && (
          <div className="pt-4 border-t border-[#FFEAE4]">
            <p className="text-xs font-bold text-[#6E554F] uppercase tracking-wider mb-2.5">
              Contributors ({uploaders.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {uploaders.map((name) => {
                const count = photos.filter((p) => p.uploader_name === name).length
                return (
                  <span
                    key={name}
                    className="bg-white/80 border border-[#FFEAE4] text-[#221513] text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF7654]" />
                    <span>{name}</span>
                    <span className="text-[#6E554F] text-[10px] font-mono">({count})</span>
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {/* ─── FULL-SCREEN LIGHTBOX ─── */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md"
          onClick={() => setSelected(null)}
        >
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

      {/* ─── STICKY MOBILE BOTTOM BAR (SINGLE PAGE WORKFLOW) ─── */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#FFEAE4] p-3 md:hidden z-30 flex items-center justify-between gap-2 safe-bottom shadow-lg">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#FFEAE4] bg-[#FFF6F3] text-xs font-bold text-[#6E554F]"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Share'}</span>
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

        {event.is_active && (
          <button
            onClick={() => setShowUploadDrawer(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7654] to-[#FFA387] text-white text-xs font-extrabold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Media</span>
          </button>
        )}
      </div>
    </div>
  )
}
