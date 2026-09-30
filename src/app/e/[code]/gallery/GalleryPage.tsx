'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Event, Photo } from '@/types/database'
import { Camera, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface GalleryPageProps {
  code: string
}

export default function GalleryPage({ code }: GalleryPageProps) {
  const supabase = createClient()
  const [event, setEvent] = useState<Event | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selected, setSelected] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)

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

  useEffect(() => { load() }, [load])

  // Live updates
  useEffect(() => {
    if (!event) return
    const channel = supabase
      .channel(`gallery:${event.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'photos',
        filter: `event_id=eq.${event.id}`,
      }, (payload) => {
        setPhotos((prev) => [payload.new as Photo, ...prev])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase, event])

  // Close lightbox with Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg">Event not found</p>
        </div>
      </div>
    )
  }

  // Group photos by uploader
  const uploaders = [...new Set(photos.map((p) => p.uploader_name))]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 bg-gray-950/90 backdrop-blur border-b border-gray-800 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">{event.name}</p>
              {event.event_date && (
                <p className="text-xs text-gray-400">
                  {format(new Date(event.event_date), 'MMMM d, yyyy')}
                </p>
              )}
            </div>
          </div>
          <Link
            href={`/e/${code}`}
            className="flex items-center gap-2 bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-teal-500 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Add photos
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats bar */}
        <div className="flex items-center gap-6 mb-8 text-sm text-gray-400">
          <span>{photos.length} photo{photos.length !== 1 ? 's' : ''}</span>
          <span>{uploaders.length} contributor{uploaders.length !== 1 ? 's' : ''}</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live
          </span>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-600 text-lg mb-2">No photos yet</p>
            <p className="text-gray-700 text-sm mb-6">Be the first to share your shots!</p>
            <Link
              href={`/e/${code}`}
              className="bg-teal-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-teal-500 transition-colors"
            >
              Upload photos
            </Link>
          </div>
        ) : (
          <>
            {/* Masonry-style grid */}
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer group relative"
                  onClick={() => setSelected(photo)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.file_url}
                    alt={`Photo by ${photo.uploader_name}`}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium">{photo.uploader_name}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contributors */}
            <div className="mt-12 border-t border-gray-800 pt-8">
              <p className="text-sm text-gray-500 mb-4">Contributors</p>
              <div className="flex flex-wrap gap-2">
                {uploaders.map((name) => {
                  const count = photos.filter((p) => p.uploader_name === name).length
                  return (
                    <span key={name} className="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-full">
                      {name} · {count}
                    </span>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setSelected(null)}
          >
            <X className="w-7 h-7" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected.file_url}
            alt=""
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full">
            By {selected.uploader_name} · {format(new Date(selected.uploaded_at), 'MMM d, h:mm a')}
          </div>
        </div>
      )}
    </div>
  )
}
