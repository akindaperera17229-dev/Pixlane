import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const expectedPlan = searchParams.get('plan')

    if (!eventId) {
      return NextResponse.json({ error: 'eventId is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: eventRaw, error } = await (supabase as any)
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

    if (error || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if plan matches or is upgraded
    const isUpgraded = expectedPlan ? event.plan === expectedPlan : event.plan !== 'free'

    return NextResponse.json({
      verified: isUpgraded,
      currentPlan: event.plan,
      photoLimit: event.photo_limit,
      videoLimit: event.video_limit,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 })
  }
}
