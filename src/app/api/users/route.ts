import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/users?id=xxx — retrieve user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const email = searchParams.get('email')

    if (!id && !email) {
      return NextResponse.json({ error: 'Provide id or email' }, { status: 400 })
    }

    const { data: user, error } = id
      ? await supabase.from('users').select('*').eq('id', id).single()
      : await supabase.from('users').select('*').eq('email', email!).single()

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

// POST /api/users — create or login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, college, isLogin } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (isLogin) {
      // Login: find existing user
      const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single()

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Account not found. Please sign up first.' }, { status: 404 })
        }
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ user })
    } else {
      // Sign up: create new user
      if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 })
      }

      // Check if user already exists
      const { data: existing, error: findError } = await supabase.from('users').select('*').eq('email', email).maybeSingle()

      if (findError) {
        return NextResponse.json({ error: findError.message }, { status: 500 })
      }

      if (existing) {
        // Auto-login if exists
        return NextResponse.json({ user: existing })
      }

      const { data: user, error: insertError } = await supabase
        .from('users')
        .insert([{ name, email, phone, college, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }])
        .select()
        .single()

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      return NextResponse.json({ user }, { status: 201 })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
