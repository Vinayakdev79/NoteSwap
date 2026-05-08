import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// POST /api/razorpay/create-order — create a Razorpay order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, noteId, userId } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    if (!noteId) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 })
    }

    // Razorpay amount is in paise (multiply by 100)
    const amountInPaise = Math.round(amount * 100)

    // Use Razorpay test key - replace with real keys in production
    const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1234567890'
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'test_secret_key'

    // For demo/test mode, create a simulated order without hitting Razorpay API
    // In production, you would call: fetch('https://api.razorpay.com/v1/orders', { ... })
    const razorpayOrderId = `order_${crypto.randomBytes(12).toString('hex')}`

    return NextResponse.json({
      orderId: razorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      key: RAZORPAY_KEY_ID,
      noteId,
      userId,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/razorpay/verify — verify payment signature
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      noteId,
      userId,
      amount,
    } = body

    // Verify signature
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'test_secret_key'
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    // In demo mode, accept all signatures
    const isSignatureValid = process.env.NODE_ENV === 'development' || expectedSignature === razorpay_signature

    if (!isSignatureValid) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    return NextResponse.json({
      verified: true,
      razorpay_order_id,
      razorpay_payment_id,
      noteId,
      userId,
      amount,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
