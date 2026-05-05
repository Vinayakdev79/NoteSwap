import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
          select: { id: true, title: true, subject: true, fileName: true },
        },
      },
    })

    return NextResponse.json({ orders })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/orders — create an order (after payment or free download)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { noteId, amount, userId } = body

    if (!noteId) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 })
    }

    // Check if user already purchased this note
    const existingOrder = await db.order.findFirst({
      where: {
        userId: userId || 'anonymous',
        noteId,
        status: 'completed',
      },
    })

    if (existingOrder) {
      // Already purchased, just return success for re-download
      return NextResponse.json({ order: existingOrder, alreadyPurchased: true })
    }

    const order = await db.order.create({
      data: {
        userId: userId || 'anonymous',
        noteId,
        amount: amount || 0,
        status: 'completed',
      },
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
