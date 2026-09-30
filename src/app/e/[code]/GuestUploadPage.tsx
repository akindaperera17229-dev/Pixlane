'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Event } from '@/types/database'
import { useDropzone } from 'react-dropzone'
import { Upload, CheckCircle, Camera, Images } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { formatBytes } from '@/lib/utils'

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15 MB per file
const ACCEPTED_TYPES = { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic'] }

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

      if (!data) { setNotFound(true); return }
      const ev = data as unknown as Event
      setEvent(ev)

      const { count } = await supabase
        .from('photos')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', ev.id)
      setPhotoCount(count ?? 0)
    }
    load()

    // Restore name from session
    const saved = sessionStorage.getItem(`pixlane_name_${code}`)
    if (saved) { setUploaderName(saved); setNameSubmitted(true) }
  }, [supabase, code])

  function submitName(e: React.FormEvent) {
    e.preventDefault()
    if (!uploaderName.trim()) return
    sessionStorage.setItem(`pixlane_name_${code}`, uploaderName.trim())
    setNameSubmitted(true)
  }

  const onDrop = useCallback((accepted: File[]) => {
    setFiles((prev) => [...prev, ...accepted].slice(0, 10)) // max 10 files at once
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
      const ext = file.name.split('.').pop()
      const path = `${event.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: storageErr } = await supabase.storage
        .from('photos')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (storageErr) { setError(`Upload failed: ${storageErr.message}`); break }

      const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(path)

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
    if (count === files.length) setDone(true)
  }

  // ── Render states ──

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Event not found</h2>
          <p className="text-gray-500 mb-6">Double-check the link or QR code and try again.</p>
          <Link href="/" className="text-teal-600 hover:underline text-sm">← Go to Pixlane</Link>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!event.is_active) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-4xl mb-4">🔒</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Uploads are closed</h2>
          <p className="text-gray-500">The host has closed this event. Check back later!</p>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <CheckCircle className="w-16 h-16 text-teal-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Photos uploaded! 🎉</h2>
          <p className="text-gray-500 mb-6">
            Your {files.length} photo{files.length !== 1 ? 's' : ''} are now in the gallery.
            Everyone can see them!
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href={`/e/${code}/gallery`}
              className="bg-teal-600 text-white font-medium py-3 px-6 rounded-xl hover:bg-teal-700 transition-colors"
            >
              <Images className="w-4 h-4 inline mr-2" />
              View the gallery
            </Link>
            <button
              onClick={() => { setFiles([]); setDone(false); setUploadedCount(0) }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Upload more photos
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">{event.name}</p>
            {event.event_date && (
              <p className="text-xs text-gray-400">{format(new Date(event.event_date), 'MMMM d, yyyy')}</p>
            )}
          </div>
          <Link href={`/e/${code}/gallery`} className="text-sm text-teal-600 font-medium whitespace-nowrap">
            Gallery →
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8 space-y-6">
        {event.description && (
          <div className="bg-teal-50 border border-teal-100 text-teal-700 text-sm px-4 py-3 rounded-xl">
            {event.description}
          </div>
        )}

        {/* Step 1: Name */}
        {!nameSubmitted ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-1">What&apos;s your name?</h2>
            <p className="text-sm text-gray-500 mb-4">
              So everyone knows who took these amazing shots 📸
            </p>
            <form onSubmit={submitName} className="space-y-4">
              <input
                type="text"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                placeholder="e.g. Kavindu, Nithya, Sahan..."
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={!uploaderName.trim()}
                className="w-full bg-teal-600 text-white font-semibold py-3 rounded-xl hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                Continue →
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Step 2: Upload */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">
                  Upload your photos, {uploaderName.split(' ')[0]} 👋
                </h2>
                <button
                  onClick={() => { setNameSubmitted(false); setFiles([]) }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Not you?
                </button>
              </div>

              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-teal-400 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className={`w-8 h-8 mx-auto mb-3 ${isDragActive ? 'text-teal-500' : 'text-gray-300'}`} />
                {isDragActive ? (
                  <p className="text-teal-600 font-medium">Drop them here!</p>
                ) : (
                  <>
                    <p className="text-gray-600 font-medium">Tap to choose photos</p>
                    <p className="text-sm text-gray-400 mt-1">or drag & drop · JPG, PNG, HEIC · max 15 MB each</p>
                  </>
                )}
              </div>

              {/* Preview */}
              {files.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      {files.length} photo{files.length !== 1 ? 's' : ''} selected
                    </p>
                    <button onClick={() => setFiles([])} className="text-xs text-red-400 hover:text-red-600">
                      Clear all
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {files.map((f, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={URL.createObjectURL(f)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full text-xs flex items-center justify-center hover:bg-black/70"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Total: {formatBytes(files.reduce((s, f) => s + f.size, 0))}
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
              )}

              {/* Limit warning */}
              {photoCount >= event.photo_limit && (
                <div className="mt-4 bg-amber-50 text-amber-700 text-sm px-4 py-3 rounded-xl">
                  ⚠️ This event has reached its photo limit ({event.photo_limit} photos).
                </div>
              )}

              {/* Upload button */}
              <button
                onClick={handleUpload}
                disabled={uploading || files.length === 0 || photoCount >= event.photo_limit}
                className="mt-4 w-full bg-teal-600 text-white font-semibold py-3 rounded-xl hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {uploading
                  ? `Uploading ${uploadedCount} / ${files.length}…`
                  : `Upload ${files.length > 0 ? files.length + ' ' : ''}photo${files.length !== 1 ? 's' : ''}`
                }
              </button>
            </div>

            {/* View gallery link */}
            <Link
              href={`/e/${code}/gallery`}
              className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center hover:border-teal-200 transition-colors"
            >
              <Images className="w-5 h-5 text-teal-500 mx-auto mb-1" />
              <p className="text-sm font-medium text-gray-700">See the shared gallery</p>
              <p className="text-xs text-gray-400 mt-0.5">{photoCount} photo{photoCount !== 1 ? 's' : ''} so far</p>
            </Link>
          </>
        )}
      </main>
    </div>
  )
}
