import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'books')

async function ensureDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true })
  } catch {
    // already exists
  }
}

// GET /api/books — list all books
export async function GET() {
  try {
    const { data: books, error } = await supabase
      .from('books')
      .select('*, user:users(id, name, email, phone, college)')
      .order('createdAt', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ books })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/books — create a book listing
export async function POST(req: NextRequest) {
  try {
    await ensureDir()

    const formData = await req.formData()
    const title = formData.get('title') as string
    const author = formData.get('author') as string
    const edition = formData.get('edition') as string || null
    const condition = formData.get('condition') as string || 'Good'
    const type = formData.get('type') as string || 'sell'
    const price = parseFloat(formData.get('price') as string || '0')
    const description = formData.get('description') as string || ''
    const image = formData.get('image') as File | null
    const userId = formData.get('userId') as string | null

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!author) {
      return NextResponse.json({ error: 'Author is required' }, { status: 400 })
    }
    if (!userId) {
      return NextResponse.json({ error: 'You must be signed in to list books. Please sign in and try again.' }, { status: 401 })
    }

    // Verify user exists
    const { data: user, error: userError } = await supabase.from('users').select('*').eq('id', userId).maybeSingle()
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }
    if (!user) {
      return NextResponse.json({ error: 'User not found. Please sign in again.' }, { status: 401 })
    }

    let imageUrl: string | null = null

    if (image) {
      const ext = path.extname(image.name) || '.jpg'
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
      const filePath = path.join(UPLOAD_DIR, uniqueName)
      const bytes = await image.arrayBuffer()
      await writeFile(filePath, Buffer.from(bytes))
      imageUrl = `/uploads/books/${uniqueName}`
    }

    const { data: book, error: insertError } = await supabase
      .from('books')
      .insert([{
        title,
        author,
        edition,
        condition,
        price,
        type,
        description,
        imageUrl,
        userId,
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }])
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ book }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/books?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 })
    }

    const { error } = await supabase.from('books').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
