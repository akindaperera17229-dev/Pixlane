import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const expectedPlan = searchParams.get('plan')

    if (!eventId) {
      return NextResponse.json({ error: 'eventId is required' }, { status: 400 })
    }

    let supabase: any
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      supabase = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
    } else {
      supabase = await createServerClient()
    }

    const { data: eventRaw, error } = await supabase
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

    // Check if the plan is genuinely upgraded to the expected tier
    // Note: If expectedPlan is provided, verified is true ONLY if event.plan === expectedPlan
    // If declined, event.plan remains 'free', so verified will be FALSE!
    const isUpgraded = expectedPlan
      ? event.plan === expectedPlan
      : Boolean(event.plan && event.plan !== 'free')

    return NextResponse.json({
      verified: isUpgraded,
      currentPlan: event.plan || 'free',
      photoLimit: event.photo_limit ?? 60,
      videoLimit: event.video_limit ?? 10,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 })
  }
}
