import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    // PayHere sends data as application/x-www-form-urlencoded
    const formData = await request.formData()
    const merchant_id = formData.get('merchant_id')?.toString() || ''
    const order_id = formData.get('order_id')?.toString() || ''
    const payment_id = formData.get('payment_id')?.toString() || ''
    const payhere_amount = formData.get('payhere_amount')?.toString() || ''
    const payhere_currency = formData.get('payhere_currency')?.toString() || 'LKR'
    const status_code = formData.get('status_code')?.toString() || ''
    const md5sig = formData.get('md5sig')?.toString() || ''
    const custom_1 = formData.get('custom_1')?.toString() || '' // eventId
    const custom_2 = formData.get('custom_2')?.toString() || '' // selectedPlan ('pro' | 'wedding')

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || 'test_merchant_secret'

    // Calculate verification hash
    const secretHash = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase()

    const calculatedSig = crypto
      .createHash('md5')
      .update(`${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${secretHash}`)
      .digest('hex')
      .toUpperCase()

    // Verify authenticity
    const isAuthentic = md5sig.toUpperCase() === calculatedSig

    if (!isAuthentic && process.env.NODE_ENV === 'production') {
      console.error('Invalid PayHere IPN Signature:', { md5sig, calculatedSig })
      return NextResponse.json({ error: 'Invalid MD5 Signature' }, { status: 400 })
    }

    console.log(`PayHere IPN Received: Order ${order_id}, Status: ${status_code}, Event: ${custom_1}`)

    // status_code: 2 = Success, 0 = Pending, -1 = Canceled, -2 = Failed, -3 = Chargedback
    if (status_code === '2' && custom_1) {
      const plan = custom_2 === 'wedding' ? 'wedding' : 'pro'
      const photoLimit = plan === 'wedding' ? 9999 : 300
      const videoLimit = plan === 'wedding' ? 9999 : 30

      // Use Supabase Service Role client to bypass RLS for server webhook
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const { error: updateErr } = await supabaseAdmin
        .from('events')
        .update({
          plan,
          photo_limit: photoLimit,
          video_limit: videoLimit,
        })
        .eq('id', custom_1)

      if (updateErr) {
        console.error('Failed to update event in Supabase from PayHere IPN:', updateErr)
        return NextResponse.json({ error: updateErr.message }, { status: 500 })
      }

      console.log(`Successfully upgraded event ${custom_1} to ${plan} plan via PayHere IPN!`)
    } else {
      console.warn(
        `PayHere IPN Payment Declined/Unsuccessful: Order ${order_id}, Status: ${status_code}, Event: ${custom_1}. Plan was NOT modified.`
      )
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error: any) {
    console.error('PayHere IPN Processing Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
