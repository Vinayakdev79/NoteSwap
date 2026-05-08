import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// PUT /api/users/payment-details — update seller's UPI and bank details
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, upiId, accountName, accountNumber, ifscCode } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Validate at least UPI is provided
    if (!upiId && !accountNumber) {
      return NextResponse.json({ error: 'Please provide UPI ID or bank account details' }, { status: 400 })
    }

    // Validate UPI format if provided
    if (upiId && !upiId.includes('@')) {
      return NextResponse.json({ error: 'Invalid UPI ID. Must contain @' }, { status: 400 })
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({
        upiId: upiId || null,
        accountName: accountName || null,
        accountNumber: accountNumber || null,
        ifscCode: ifscCode || null,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ user })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
