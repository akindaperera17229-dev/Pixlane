import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import JSZip from 'jszip'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Fetch event
    const { data: eventData, error: eventErr } = await supabase
      .from('events')
      .select('name, code')
      .eq('id', id)
      .single()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const event = eventData as any

    if (eventErr || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Fetch photos
    const { data: photosData, error: photoErr } = await supabase
      .from('photos')
      .select('*')
      .eq('event_id', id)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const photos = (photosData as any[]) || []

    if (photoErr || photos.length === 0) {
      return NextResponse.json({ error: 'No photos to download' }, { status: 400 })
    }

    const zip = new JSZip()
    const folderName = (event.name || 'Pixlane').replace(/[^a-zA-Z0-9_-]/g, '_')
    const folder = zip.folder(folderName) || zip

    await Promise.all(
      photos.map(async (photo, index) => {
        try {
          const res = await fetch(photo.file_url)
          if (res.ok) {
            const arrayBuffer = await res.arrayBuffer()
            const ext = photo.file_url.split('.').pop()?.split('?')[0] || 'jpg'
            const cleanUploader = (photo.uploader_name || 'guest').replace(/[^a-zA-Z0-9_-]/g, '')
            folder.file(`${index + 1}_${cleanUploader}.${ext}`, arrayBuffer)
          }
        } catch (err) {
          console.error('Failed fetching photo for server zip:', err)
        }
      })
    )

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    return new NextResponse(zipBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${folderName}_Pixlane.zip"`,
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Download route error:', error)
    return NextResponse.json({ error: 'Failed to generate download archive' }, { status: 500 })
  }
}
