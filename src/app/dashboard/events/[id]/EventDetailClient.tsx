'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getEventUrl, formatBytes } from '@/lib/utils'
import { Event, Photo } from '@/types/database'
import { downloadSinglePhoto, downloadAllPhotosAsZip } from '@/lib/download'
import { useDropzone } from 'react-dropzone'
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
  Crown,
  Play,
  Film,
  Video,
  Upload,
  X,
  Plus,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import QRCode from 'qrcode'
import ThemeStage from '@/components/ThemeStage'
import Logo from '@/components/Logo'
import PricingModal from '@/components/PricingModal'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB
const ACCEPTED_TYPES = {
  'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'],
  'video/*': ['.mp4', '.mov', '.webm', '.m4v'],
}

interface EventDetailClientProps {
  eventId: string
}

export default function EventDetailClient({ eventId }: EventDetailClientProps) {
  const supabase = createClient()
  const [event, setEvent] = useState<Event | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selected, setSelected] = useState<Photo | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showPricingModal, setShowPricingModal] = useState(false)

  // Host Direct Upload State (Single Page)
  const [showHostUpload, setShowHostUpload] = useState(false)
  const [hostFiles, setHostFiles] = useState<File[]>([])
  const [hostUploading, setHostUploading] = useState(false)
  const [hostUploadedCount, setHostUploadedCount] = useState(0)
  const [hostUploadError, setHostUploadError] = useState('')

  // Batch download state
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

  // Realtime subscription — photos & videos appear live
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

  // Close lightbox on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Generate Peach-branded QR code
  useEffect(() => {
    if (!event) return
    QRCode.toDataURL(getEventUrl(event.code), {
      width: 320,
      margin: 2,
      color: { dark: '#3D0E05', light: '#FFFFFF' },
    }).then(setQrDataUrl)
  }, [event])

  // Host Direct Upload Dropzone
  const onHostDrop = useCallback((accepted: File[]) => {
    setHostFiles((prev) => [...prev, ...accepted].slice(0, 20))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onHostDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  })

  async function handleHostUpload() {
    if (!event || hostFiles.length === 0) return
    setHostUploading(true)
    setHostUploadError('')
    let count = 0

    const currentVideosInBatch = hostFiles.filter((f) => f.type.startsWith('video/')).length
    const currentPhotosInBatch = hostFiles.length - currentVideosInBatch
    const currentUploadedVideos = photos.filter((p) => p.media_type === 'video').length
    const currentUploadedPhotos = photos.filter((p) => p.media_type !== 'video').length
    const allowedVideoLimit = event.video_limit ?? 10
    const allowedPhotoLimit = event.photo_limit ?? 60

    if (event.plan !== 'wedding') {
      if (currentUploadedVideos + currentVideosInBatch > allowedVideoLimit) {
        setHostUploadError(
          `Video limit reached (${allowedVideoLimit} videos on your plan). Upgrade to add more videos!`
        )
        setHostUploading(false)
        return
      }

      if (currentUploadedPhotos + currentPhotosInBatch > allowedPhotoLimit) {
        setHostUploadError(
          `Photo limit reached (${allowedPhotoLimit} photos on your plan). Upgrade to add more photos!`
        )
        setHostUploading(false)
        return
      }
    }

    for (const file of hostFiles) {
      const isVideo = file.type.startsWith('video/')
      const mediaType = isVideo ? 'video' : 'photo'
      let publicFileUrl = ''
      let storagePath = ''

      // Attempt Cloudflare R2 direct pre-signed upload
      try {
        const presignRes = await fetch('/api/storage/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: event.id,
            fileName: file.name,
            contentType: file.type,
            fileSize: file.size,
          }),
        })

        const presignData = await presignRes.json()

        if (presignData.enabled && presignData.uploadUrl) {
          // Direct upload from browser to Cloudflare R2 bucket
          const uploadRes = await fetch(presignData.uploadUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': file.type || 'application/octet-stream',
            },
            body: file,
          })

          if (!uploadRes.ok) {
            throw new Error(`R2 upload failed with status ${uploadRes.status}`)
          }

          publicFileUrl = presignData.publicUrl
          storagePath = presignData.filePath
        }
      } catch (r2Err) {
        console.warn('R2 host upload skipped or failed, falling back to Supabase:', r2Err)
      }

      // If not uploaded to R2, fallback to Supabase Storage
      if (!publicFileUrl) {
        const ext = file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg')
        storagePath = `${event.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: storageErr } = await supabase.storage
          .from('photos')
          .upload(storagePath, file, { cacheControl: '3600', upsert: false })

        if (storageErr) {
          setHostUploadError(`Upload stopped: ${storageErr.message}`)
          break
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('photos').getPublicUrl(storagePath)
        publicFileUrl = publicUrl
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let insertRes = await (supabase.from('photos') as any).insert({
        event_id: event.id,
        uploader_name: 'Host 👑',
        file_url: publicFileUrl,
        file_path: storagePath,
        file_size: file.size,
        media_type: mediaType,
      })

      // Fallback if media_type column not yet in photos table
      if (insertRes.error && (insertRes.error.message?.includes('schema cache') || insertRes.error.message?.includes('column') || insertRes.error.code === 'PGRST204')) {
        insertRes = await (supabase.from('photos') as any).insert({
          event_id: event.id,
          uploader_name: 'Host 👑',
          file_url: publicFileUrl,
          file_path: storagePath,
          file_size: file.size,
        })
      }

      count++
      setHostUploadedCount(count)
    }

    setHostUploading(false)
    if (count === hostFiles.length) {
      setHostFiles([])
      setHostUploadedCount(0)
      setShowHostUpload(false)
      fetchPhotos()
    }
  }

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
          text: `Share your photos and videos for ${event.name}! No app required.`,
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

  async function handlePlanSelect(
    planId: 'free' | 'pro' | 'wedding',
    photoLimit?: number,
    videoLimit?: number
  ) {
    if (!event) return

    if (planId === 'free') {
      // Downgrade or keep on free plan
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('events')
        .update({
          plan: 'free',
          photo_limit: 60,
          video_limit: 10,
        })
        .eq('id', event.id)
        .select()
        .single()
      if (data) setEvent(data as Event)
      return
    }

    // For paid plans ('pro' | 'wedding'):
    // The plan is verified and activated via the server IPN webhook.
    // Apply the verified limits directly to local state
    const resolvedPhotoLimit = photoLimit ?? (planId === 'wedding' ? 9999 : 300)
    const resolvedVideoLimit = videoLimit ?? (planId === 'wedding' ? 9999 : 30)

    setEvent((prev) =>
      prev
        ? {
            ...prev,
            plan: planId,
            photo_limit: resolvedPhotoLimit,
            video_limit: resolvedVideoLimit,
          }
        : prev
    )
    fetchPhotos()
  }

  async function deletePhoto(photo: Photo) {
    if (!confirm('Are you sure you want to delete this media item?')) return
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
  const totalVideos = photos.filter((p) => p.media_type === 'video').length
  const totalPhotos = photos.length - totalVideos
  const videoLimit = event.video_limit ?? 3
  const isWedding = (event.theme_template || '').toLowerCase() === 'wedding'

  return (
    <div className="min-h-screen text-[#221513] pb-24 md:pb-12 relative overflow-hidden theme-stage-active">
      {/* ─── 4-LAYER THEME STAGE (Background Silhouette + Falling Petals / Effects) ─── */}
      <ThemeStage themeId={event.theme_template} eventName={event.name} paused={!!selected} />

      {/* ─── APP HEADER ─── */}
      <header className="bg-white/85 backdrop-blur-md border-b border-[#FFEAE4] sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-16 sm:h-20 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-xl bg-white border border-[#FFEAE4] flex items-center justify-center text-[#6E554F] hover:text-[#221513] hover:bg-[#FFEAE4] transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="hidden sm:block shrink-0">
              <Logo size="responsive" href="/" />
            </div>
            <div className="truncate">
              <h1 className={`text-sm sm:text-base text-[#221513] truncate ${isWedding ? 'font-cursive text-xl' : 'font-cinzel font-bold'}`}>
                {event.name}
              </h1>
              <p className="text-[11px] text-[#6E554F] font-mono">Code: {event.code}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowPricingModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold bg-[#FFEAE4] hover:bg-[#FFD5C8] text-[#D43E19] px-3 py-1.5 rounded-xl border border-[#FFD5C8] transition-colors"
            >
              <Crown className="w-3.5 h-3.5 text-[#FF7654]" />
              <span className="capitalize">{event.plan || 'Free'} Plan</span>
            </button>

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
              <span className="hidden sm:inline">{event.is_active ? 'Live' : 'Closed'}</span>
            </span>

            <button
              onClick={() => setShowHostUpload(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#FF7654] hover:bg-[#F45732] text-white px-3 py-1.5 rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Host Upload</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT CONTAINER (Relative z-10 so it's strictly above background) ─── */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: QR Card & Host Management Controls */}
        <aside className="lg:col-span-4 space-y-5">
          {/* QR Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#FFEAE4] shadow-xs p-6 text-center">
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
              <p className="text-xs font-lora italic text-[#6E554F] mt-1">
                {format(new Date(event.event_date), 'MMMM d, yyyy')}
              </p>
            )}

            <button
              onClick={handleShareNative}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-[#FFF6F3] hover:bg-[#FFEAE4] text-[#D43E19] border border-[#FFD5C8] font-bold text-xs py-2.5 rounded-xl transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share QR with Guests</span>
            </button>
          </div>

          {/* Share Link Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#FFEAE4] shadow-xs p-5 space-y-3">
            <p className="text-xs font-bold text-[#221513] uppercase tracking-wider">
              Guest Link (Single Page)
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

              <Link
                href={`/e/${event.code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 bg-[#FFF6F3] text-[#6E554F] hover:text-[#221513] rounded-xl border border-[#FFEAE4] transition-colors"
                title="Open Public Guest Page (pixlane.site)"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Album Controls */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#FFEAE4] shadow-xs p-5 space-y-3">
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

            <button
              onClick={() => setShowPricingModal(true)}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl bg-[#FFF6F3] border border-[#FFD5C8] hover:bg-[#FFEAE4] transition-colors text-xs font-bold text-[#D43E19]"
            >
              <span className="flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#FF7654]" />
                <span>Plan: {event.plan?.toUpperCase() || 'FREE'}</span>
              </span>
              <span className="text-[11px] underline">Change</span>
            </button>
          </div>

          {/* Stats Progress (Photos + Videos) */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#FFEAE4] shadow-xs p-5 space-y-3">
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-[#6E554F]">Photos Uploaded</span>
                <span className="text-[#D43E19]">
                  {totalPhotos} / {event.photo_limit}
                </span>
              </div>
              <div className="w-full bg-[#FFF6F3] rounded-full h-2 overflow-hidden border border-[#FFEAE4]">
                <div
                  className="bg-gradient-to-r from-[#FF7654] to-[#FFA387] h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min((totalPhotos / event.photo_limit) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-[#6E554F]">Video Clips Uploaded</span>
                <span className="text-[#D43E19]">
                  {totalVideos} / {videoLimit}
                </span>
              </div>
              <div className="w-full bg-[#FFF6F3] rounded-full h-2 overflow-hidden border border-[#FFEAE4]">
                <div
                  className="bg-gradient-to-r from-[#FF7654] to-[#FFA387] h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min((totalVideos / videoLimit) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Plan Limit Alert & Instant Upgrade Button */}
            {(totalPhotos >= event.photo_limit || totalVideos >= videoLimit) && event.plan !== 'wedding' && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFEAE4] to-[#FFF6F3] border border-[#FFD5C8] text-[#221513] space-y-2 mt-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-[#FF7654]" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#D43E19]">Storage Limit Reached</span>
                </div>
                <p className="text-xs text-[#6E554F] leading-relaxed">
                  Your event has reached its {event.plan?.toUpperCase() || 'FREE'} tier capacity. Upgrade to unlock more photos, HD videos, and animated stages!
                </p>
                <button
                  onClick={() => setShowPricingModal(true)}
                  className="w-full py-2.5 bg-gradient-to-r from-[#FF7654] to-[#FFA387] hover:from-[#F45732] hover:to-[#FF8E72] text-white rounded-xl text-xs font-extrabold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Upgrade to Pro / Wedding Pass</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Right Column: Host Upload Drawer + Media Grid */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Host Direct Upload Section (Single Page) */}
          {showHostUpload && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border-2 border-[#FF7654] shadow-xl p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[11px] font-bold text-[#D43E19] uppercase tracking-wider">
                    Host Direct Upload
                  </span>
                  <h3 className="font-bold font-cinzel text-base text-[#221513]">
                    Drop photos & videos directly into your event
                  </h3>
                </div>
                <button
                  onClick={() => setShowHostUpload(false)}
                  className="w-7 h-7 rounded-full bg-[#FFF6F3] text-[#6E554F] hover:text-[#221513] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-[#FF7654] bg-[#FFEAE4]' : 'border-[#FFD5C8] bg-[#FFFDFB] hover:bg-[#FFF6F3]'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-10 h-10 rounded-xl bg-[#FFEAE4] text-[#D43E19] flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-[#221513]">
                  {isDragActive ? 'Drop files here!' : 'Tap or drag photos/videos here'}
                </p>
                <p className="text-[11px] text-[#6E554F] mt-0.5">JPG, PNG, HEIC, MP4, MOV up to 50MB</p>
              </div>

              {hostFiles.length > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between items-center text-xs font-bold text-[#221513] mb-2">
                    <span>{hostFiles.length} files selected ({formatBytes(hostFiles.reduce((s, f) => s + f.size, 0))})</span>
                    <button onClick={() => setHostFiles([])} className="text-red-500 hover:underline">
                      Clear
                    </button>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {hostFiles.map((file, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-[#221513]">
                        {file.type.startsWith('video/') ? (
                          <div className="w-full h-full flex items-center justify-center text-white">
                            <Play className="w-5 h-5 text-[#FF7654] fill-[#FF7654]" />
                          </div>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hostUploadError && (
                <div className="mt-3 p-2.5 bg-red-50 text-red-600 text-xs font-semibold rounded-xl">
                  {hostUploadError}
                </div>
              )}

              <button
                onClick={handleHostUpload}
                disabled={hostUploading || hostFiles.length === 0}
                className="mt-4 w-full bg-[#FF7654] hover:bg-[#F45732] text-white font-bold py-3 rounded-xl shadow-xs disabled:opacity-60 transition-all text-xs flex items-center justify-center gap-1.5"
              >
                {hostUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading {hostUploadedCount} of {hostFiles.length}...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload {hostFiles.length > 0 ? `${hostFiles.length} Files` : 'Now'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Gallery Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold font-cinzel text-[#221513]">
                Event Gallery ({photos.length})
              </h2>
              <p className="text-xs text-[#6E554F]">
                {totalPhotos} photos &bull; {totalVideos} videos live on this single page
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHostUpload(true)}
                className="inline-flex items-center gap-1 bg-white hover:bg-[#FFF6F3] text-[#221513] border border-[#FFEAE4] font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#FF7654] stroke-[3]" />
                <span>Upload</span>
              </button>

              {photos.length > 0 && (
                <button
                  onClick={handleDownloadAll}
                  disabled={isDownloadingAll}
                  className="inline-flex items-center justify-center gap-1.5 bg-[#FF7654] hover:bg-[#F45732] text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-all disabled:opacity-60"
                >
                  {isDownloadingAll ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{downloadProgress || 'Preparing ZIP...'}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download All (ZIP)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Download Progress Bar Overlay */}
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

          {/* Photo & Video Gallery Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-48 bg-white/80 rounded-3xl border border-[#FFEAE4]">
              <div className="w-8 h-8 border-3 border-[#FF7654] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : photos.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-dashed border-[#FFD5C8] p-12 text-center shadow-xs">
              <div className="w-14 h-14 bg-[#FFEAE4] text-[#D43E19] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Camera className="w-7 h-7" />
              </div>
              <p className="text-base font-bold font-lora text-[#221513] mb-1">No moments yet</p>
              <p className="text-xs text-[#6E554F] max-w-xs mx-auto mb-5">
                Share your QR code or upload directly above to see photos and videos appear live.
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setShowHostUpload(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#FF7654] text-white px-4 py-2 rounded-xl shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Moments</span>
                </button>
                <button
                  onClick={copyLink}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#FFF6F3] border border-[#FFEAE4] text-[#6E554F] px-4 py-2 rounded-xl"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy Guest Link'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo, i) => {
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

                    {/* Overlay Gradient on Hover / Mobile Touch */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            downloadSinglePhoto(
                              photo.file_url,
                              `pixlane_${event.code}_${i + 1}_${photo.uploader_name || 'media'}.${
                                isVideo ? 'mp4' : 'jpg'
                              }`
                            )
                          }}
                          className="w-7 h-7 rounded-lg bg-black/50 hover:bg-[#FF7654] text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                          title="Download item"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deletePhoto(photo)
                          }}
                          className="w-7 h-7 rounded-lg bg-black/50 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* ─── MOBILE STICKY BOTTOM BAR (SINGLE PAGE WORKFLOW) ─── */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#FFEAE4] p-3 md:hidden z-30 flex items-center justify-between gap-2 safe-bottom shadow-lg">
        <button
          onClick={copyLink}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#FFEAE4] bg-[#FFF6F3] text-xs font-bold text-[#6E554F]"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Share QR'}</span>
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

        <button
          onClick={() => setShowHostUpload(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#FF7654] text-white text-xs font-extrabold shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Upload</span>
        </button>
      </div>

      {/* ─── PRICING & PLAN MODAL ─── */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        currentPlan={event.plan || 'free'}
        eventId={event.id}
        eventName={event.name}
        onSelectPlan={(plan, photoLimit, videoLimit) =>
          handlePlanSelect(plan, photoLimit, videoLimit)
        }
      />
    </div>
  )
}
