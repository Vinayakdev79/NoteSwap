import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/users?id=xxx — retrieve user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const email = searchParams.get('email')

    if (!id && !email) {
      return NextResponse.json({ error: 'Provide id or email' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: id ? { id } : { email: email! },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
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
      const user = await db.user.findUnique({ where: { email } })
      if (!user) {
        return NextResponse.json({ error: 'Account not found. Please sign up first.' }, { status: 404 })
      }
      return NextResponse.json({ user })
    } else {
      // Sign up: create new user
      if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 })
      }

      const existing = await db.user.findUnique({ where: { email } })
      if (existing) {
        // Auto-login if exists
        return NextResponse.json({ user: existing })
      }

      const user = await db.user.create({
        data: { name, email, phone, college },
      })

      return NextResponse.json({ user }, { status: 201 })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
