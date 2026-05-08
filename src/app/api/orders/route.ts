import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const COMMISSION_PER_NOTE = 5 // ₹5 commission per note sale

// GET /api/orders?userId=xxx — get orders for a user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, note:notes(id, title, subject, fileName, userId)')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ orders })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/orders — create an order after Razorpay payment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { noteId, amount, userId, razorpayPaymentId, razorpayOrderId } = body

    if (!noteId) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Check if user already purchased this note
    const { data: existingOrder, error: findError } = await supabase
      .from('orders')
      .select('*')
      .eq('userId', userId)
      .eq('noteId', noteId)
      .eq('status', 'completed')
      .maybeSingle()

    if (findError) {
      return NextResponse.json({ error: findError.message }, { status: 500 })
    }

    if (existingOrder) {
      return NextResponse.json({ order: existingOrder, alreadyPurchased: true })
    }

    // Calculate commission
    const noteAmount = amount || 0
    const commission = noteAmount > 0 ? COMMISSION_PER_NOTE : 0
    const sellerPayout = Math.max(0, noteAmount - commission)

    const { data: order, error: insertError } = await supabase
      .from('orders')
      .insert([{
        userId,
        noteId,
        amount: noteAmount,
        commission,
        sellerPayout,
        razorpayPaymentId: razorpayPaymentId || null,
        razorpayOrderId: razorpayOrderId || null,
        status: 'completed',
        createdAt: new Date().toISOString(),
      }])
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
