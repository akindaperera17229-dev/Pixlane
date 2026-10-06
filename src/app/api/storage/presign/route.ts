import { NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL, isR2Configured } from '@/lib/r2'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    if (!isR2Configured || !r2Client) {
      return NextResponse.json(
        { enabled: false, message: 'Cloudflare R2 is not configured in .env.local' },
        { status: 200 }
      )
    }

    const body = await request.json()
    const { eventId, fileName, contentType, fileSize } = body

    if (!eventId || !fileName) {
      return NextResponse.json(
        { error: 'eventId and fileName are required' },
        { status: 400 }
      )
    }

    // Verify event exists and check storage limits
    const supabase = await createClient()
    const { data: eventRaw, error: eventErr } = await (supabase as any)
      .from('events')
      .select('id, plan, photo_limit, video_limit')
      .eq('id', eventId)
      .single()

    const event = eventRaw as {
      id: string
      plan?: string | null
      photo_limit?: number | null
      video_limit?: number | null
    } | null

    if (eventErr || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Strict server-side plan limit enforcement
    const isVideo = contentType?.startsWith('video/')
    const photoLimit = event.photo_limit ?? 60
    const videoLimit = event.video_limit ?? 10

    if (event.plan !== 'wedding') {
      const { count } = await supabase
        .from('photos')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('media_type', isVideo ? 'video' : 'photo')

      const currentCount = count ?? 0
      const limit = isVideo ? videoLimit : photoLimit

      if (currentCount >= limit) {
        return NextResponse.json(
          {
            error: `${isVideo ? 'Video' : 'Photo'} limit reached for this event (${currentCount}/${limit} on ${event.plan || 'Free'} plan). Upgrade to add more!`,
          },
          { status: 403 }
        )
      }
    }

    const ext = fileName.split('.').pop() || (isVideo ? 'mp4' : 'jpg')
    const uniqueKey = `events/${eventId}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`

    const putCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: contentType || 'application/octet-stream',
    })

    // Pre-signed URL valid for 1 hour
    const uploadUrl = await getSignedUrl(r2Client, putCommand, { expiresIn: 3600 })
    
    // Construct public CDN URL
    const publicUrlBase = R2_PUBLIC_URL.replace(/\/+$/, '')
    const publicUrl = publicUrlBase ? `${publicUrlBase}/${uniqueKey}` : uploadUrl.split('?')[0]

    return NextResponse.json({
      enabled: true,
      uploadUrl,
      publicUrl,
      filePath: uniqueKey,
      storageType: 'r2',
    })
  } catch (error: any) {
    console.error('Error generating R2 presigned URL:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}
