'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Event } from '@/types/database'
import { useDropzone } from 'react-dropzone'
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
  Calendar,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { formatBytes } from '@/lib/utils'

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25 MB per file
const ACCEPTED_TYPES = {
  'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'],
}

interface GuestUploadPageProps {
  code: string
}

export default function GuestUploadPage({ code }: GuestUploadPageProps) {
  const supabase = createClient()
  const [event, setEvent] = useState<Event | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [uploaderName, setUploaderName] = useState('')
  const [nameSubmitted, setNameSubmitted] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadedCount, setUploadedCount] = useState(0)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [photoCount, setPhotoCount] = useState(0)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('code', code.toUpperCase())
        .single()

      if (!data) {
        setNotFound(true)
        return
      }
      const ev = data as unknown as Event
      setEvent(ev)

      const { count } = await supabase
        .from('photos')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', ev.id)
      setPhotoCount(count ?? 0)
    }
    load()

    // Restore nickname from session if already entered
    const saved = sessionStorage.getItem(`pixlane_name_${code}`)
    if (saved) {
      setUploaderName(saved)
      setNameSubmitted(true)
    }
  }, [supabase, code])

  function submitName(e: React.FormEvent) {
    e.preventDefault()
    if (!uploaderName.trim()) return
    sessionStorage.setItem(`pixlane_name_${code}`, uploaderName.trim())
    setNameSubmitted(true)
  }

  const onDrop = useCallback((accepted: File[]) => {
    setFiles((prev) => [...prev, ...accepted].slice(0, 15)) // up to 15 files per batch
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

    for (const file of files) {
      const ext = file.name.split('.').pop() || 'jpg'
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
      await (supabase.from('photos') as any).insert({
        event_id: event.id,
        uploader_name: uploaderName.trim(),
        file_url: publicUrl,
        file_path: path,
        file_size: file.size,
      })

      count++
      setUploadedCount(count)
    }

    setUploading(false)
    if (count === files.length) {
      setDone(true)
    }
  }

  // ── Render States ──

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#FFFDFB] flex items-center justify-center p-4 text-center">
        <div className="max-w-sm bg-white p-8 rounded-3xl border border-[#FFEAE4] shadow-xs">
          <div className="w-14 h-14 bg-[#FFEAE4] text-[#D43E19] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Camera className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-[#221513] mb-1">Event Not Found</h2>
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

  if (!event) {
    return (
      <div className="min-h-screen bg-[#FFFDFB] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#FF7654] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!event.is_active) {
    return (
      <div className="min-h-screen bg-[#FFFDFB] flex items-center justify-center p-4 text-center">
        <div className="max-w-sm bg-white p-8 rounded-3xl border border-[#FFEAE4] shadow-xs">
          <div className="w-14 h-14 bg-gray-100 text-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-[#221513] mb-1">Uploads Are Closed</h2>
          <p className="text-xs text-[#6E554F] mb-6">
            The host has closed submissions for {event.name}. You can still browse the gallery!
          </p>
          <Link
            href={`/e/${code}/gallery`}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#FF7654] text-white px-5 py-2.5 rounded-xl shadow-xs"
          >
            <Images className="w-4 h-4" />
            <span>View Gallery</span>
          </Link>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#FFFDFB] flex items-center justify-center p-4 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#FFEAE4] shadow-lg shadow-[#FF7654]/10">
          <div className="w-16 h-16 bg-[#FFEAE4] text-[#D43E19] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9" />
          </div>
          <span className="text-xs font-bold text-[#D43E19] bg-[#FFEAE4] px-3 py-1 rounded-full uppercase tracking-wider">
            All Done!
          </span>
          <h2 className="text-2xl font-black text-[#221513] mt-2 mb-2">
            Photos Added to Gallery! 🎉
          </h2>
          <p className="text-xs sm:text-sm text-[#6E554F] mb-8">
            Your {files.length} photo{files.length !== 1 ? 's' : ''} have been saved in 100% original quality.
            Everyone at the event can see them now!
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href={`/e/${code}/gallery`}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF7654] to-[#FFA387] hover:from-[#F45732] hover:to-[#FF8E72] text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md shadow-[#FF7654]/25 transition-all text-sm"
            >
              <Images className="w-4 h-4" />
              <span>See Shared Gallery</span>
            </Link>

            <button
              onClick={() => {
                setFiles([])
                setDone(false)
                setUploadedCount(0)
              }}
              className="text-xs font-bold text-[#6E554F] hover:text-[#221513] py-2"
            >
              + Upload more photos
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#221513] pb-16">
      {/* ─── APP HEADER ─── */}
      <header className="bg-white border-b border-[#FFEAE4] sticky top-0 z-40 shadow-xs">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#FF7654] to-[#FFA387] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Camera className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div className="truncate">
              <p className="font-extrabold text-sm text-[#221513] truncate">{event.name}</p>
              {event.event_date && (
                <p className="text-[11px] text-[#6E554F]">
                  {format(new Date(event.event_date), 'MMM d, yyyy')}
                </p>
              )}
            </div>
          </div>

          <Link
            href={`/e/${code}/gallery`}
            className="flex items-center gap-1.5 text-xs font-bold bg-[#FFF6F3] hover:bg-[#FFEAE4] text-[#D43E19] px-3.5 py-2 rounded-xl border border-[#FFD5C8] transition-colors shrink-0"
          >
            <Images className="w-3.5 h-3.5" />
            <span>Gallery</span>
          </Link>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-xl mx-auto px-4 py-6 space-y-5">
        {/* Host Note Banner */}
        {event.description && (
          <div className="bg-[#FFF6F3] border border-[#FFEAE4] rounded-2xl p-4 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#FF7654] shrink-0 mt-0.5" />
            <p className="text-xs text-[#6E554F] leading-relaxed">
              <strong className="text-[#221513]">Host note:</strong> {event.description}
            </p>
          </div>
        )}

        {/* STEP 1: Nickname */}
        {!nameSubmitted ? (
          <div className="bg-white rounded-3xl border border-[#FFEAE4] shadow-xs p-6 sm:p-7">
            <div className="w-10 h-10 rounded-2xl bg-[#FFEAE4] text-[#D43E19] flex items-center justify-center mb-3">
              <User className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-lg text-[#221513]">What&apos;s your name?</h2>
            <p className="text-xs text-[#6E554F] mt-1 mb-5">
              So your friends know who captured these awesome shots!
            </p>

            <form onSubmit={submitName} className="space-y-4">
              <input
                type="text"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                placeholder="e.g. Kavindu, Nethmi, Sahan..."
                required
                maxLength={30}
                className="w-full px-4 py-3.5 rounded-2xl bg-[#FFFDFB] border border-[#FFD5C8] text-[#221513] placeholder-[#A83013]/40 focus:outline-none focus:ring-2 focus:ring-[#FF7654] focus:border-transparent text-sm transition-all"
              />

              <button
                type="submit"
                disabled={!uploaderName.trim()}
                className="w-full bg-gradient-to-r from-[#FF7654] to-[#FFA387] hover:from-[#F45732] hover:to-[#FF8E72] text-white font-extrabold py-3.5 rounded-2xl shadow-md shadow-[#FF7654]/25 hover:shadow-lg disabled:opacity-60 transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>Continue to Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: Dropzone & Image Selection */
          <div className="bg-white rounded-3xl border border-[#FFEAE4] shadow-xs p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#D43E19] uppercase tracking-wider">
                  Ready to drop
                </span>
                <h2 className="font-extrabold text-base text-[#221513]">
                  Uploading as {uploaderName} 📸
                </h2>
              </div>

              <button
                onClick={() => {
                  setNameSubmitted(false)
                  setFiles([])
                }}
                className="text-xs font-bold text-[#6E554F] hover:text-[#221513] bg-[#FFF6F3] px-2.5 py-1 rounded-lg border border-[#FFEAE4]"
              >
                Change name
              </button>
            </div>

            {/* Tap to Pick Dropzone (Optimized for Smartphones) */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-[#FF7654] bg-[#FFEAE4]'
                  : 'border-[#FFD5C8] bg-[#FFFDFB] hover:bg-[#FFF6F3]'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-14 h-14 rounded-2xl bg-[#FFEAE4] text-[#D43E19] flex items-center justify-center mx-auto mb-3">
                <Upload className="w-7 h-7" />
              </div>

              {isDragActive ? (
                <p className="text-sm font-extrabold text-[#D43E19]">Drop your photos right here!</p>
              ) : (
                <>
                  <p className="text-sm font-extrabold text-[#221513]">
                    Tap to take or choose photos
                  </p>
                  <p className="text-xs text-[#6E554F] mt-1">
                    Select from gallery or snap with camera &bull; Full HD quality
                  </p>
                </>
              )}
            </div>

            {/* Selected Photos Thumbnails */}
            {files.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#221513]">
                    {files.length} photo{files.length !== 1 ? 's' : ''} selected (
                    {formatBytes(files.reduce((sum, f) => sum + f.size, 0))})
                  </span>
                  <button
                    onClick={() => setFiles([])}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Clear all
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl overflow-hidden bg-[#FFEAE4] border border-[#FFEAE4] shadow-xs"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() =>
                          setFiles((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center absolute top-1 right-1 hover:bg-black/80"
                      >
                        <X className="w-3.5 h-3.5" />
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

            {/* Upload Action Button */}
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className="w-full bg-gradient-to-r from-[#FF7654] to-[#FFA387] hover:from-[#F45732] hover:to-[#FF8E72] text-white font-extrabold py-3.5 rounded-2xl shadow-md shadow-[#FF7654]/25 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    Uploading {uploadedCount} of {files.length}...
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>
                    Upload {files.length > 0 ? `${files.length} Photo${files.length !== 1 ? 's' : ''}` : 'Photos'}
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {/* View Gallery Link Card */}
        <Link
          href={`/e/${code}/gallery`}
          className="block bg-white rounded-3xl border border-[#FFEAE4] hover:border-[#FFB7A2] p-4 text-center shadow-xs transition-colors"
        >
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#FF7654]">
            <Images className="w-4 h-4" />
            <span>Open Event Gallery ({photoCount} photos)</span>
          </div>
        </Link>
      </main>
    </div>
  )
}
