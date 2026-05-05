import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/books/contact — create a contact request between buyer and seller
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { bookId, fromUserId, toUserId, message } = body

    if (!bookId || !toUserId) {
      return NextResponse.json({ error: 'Book ID and recipient user ID are required' }, { status: 400 })
    }

    const contactRequest = await db.contactRequest.create({
      data: {
        bookId,
        fromUserId: fromUserId || 'anonymous',
        toUserId,
        message: message || 'Interested in this book',
        status: 'pending',
      },
    })

    return NextResponse.json({ contactRequest }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
