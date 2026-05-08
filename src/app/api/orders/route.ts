import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const COMMISSION_PER_NOTE = 5 // ₹5 commission per note sale

// GET /api/orders?userId=xxx — get orders for a user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const orders = await db.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        note: {
          select: { id: true, title: true, subject: true, fileName: true, userId: true },
        },
      },
    })

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
    const existingOrder = await db.order.findFirst({
      where: {
        userId,
        noteId,
        status: 'completed',
      },
    })

    if (existingOrder) {
      return NextResponse.json({ order: existingOrder, alreadyPurchased: true })
    }

    // Calculate commission
    const noteAmount = amount || 0
    const commission = noteAmount > 0 ? COMMISSION_PER_NOTE : 0
    const sellerPayout = Math.max(0, noteAmount - commission)

    const order = await db.order.create({
      data: {
        userId,
        noteId,
        amount: noteAmount,
        commission,
        sellerPayout,
        razorpayPaymentId: razorpayPaymentId || null,
        razorpayOrderId: razorpayOrderId || null,
        status: 'completed',
      },
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
