import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, amount, currency = 'LKR' } = body

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'orderId and amount are required' },
        { status: 400 }
      )
    }

    const merchantId = process.env.PAYHERE_MERCHANT_ID || process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || '1211149'
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || 'test_merchant_secret'
    const isSandbox = (process.env.PAYHERE_MODE || 'sandbox').toLowerCase() === 'sandbox'

    // Format amount to 2 decimal places (e.g. "1900.00")
    const formattedAmount = parseFloat(amount.toString()).toFixed(2)

    // Calculate MD5 of merchant secret in uppercase
    const secretHash = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase()

    // Calculate final hash
    const hash = crypto
      .createHash('md5')
      .update(`${merchantId}${orderId}${formattedAmount}${currency}${secretHash}`)
      .digest('hex')
      .toUpperCase()

    return NextResponse.json({
      hash,
      merchantId,
      amount: formattedAmount,
      currency,
      isSandbox,
    })
  } catch (error: any) {
    console.error('Error generating PayHere hash:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to generate PayHere payment hash' },
      { status: 500 }
    )
  }
}
