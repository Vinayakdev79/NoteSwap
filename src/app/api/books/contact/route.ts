import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/books/contact — create a contact request between buyer and seller
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { bookId, fromUserId, toUserId, message } = body

    if (!bookId || !toUserId) {
      return NextResponse.json({ error: 'Book ID and recipient user ID are required' }, { status: 400 })
    }

    const { data: contactRequest, error } = await supabase
      .from('contact_requests')
      .insert([{
        bookId,
        fromUserId: fromUserId || 'anonymous',
        toUserId,
        message: message || 'Interested in this book',
        status: 'pending',
        createdAt: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ contactRequest }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
