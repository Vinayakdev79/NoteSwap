import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
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
    const books = await db.book.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, college: true },
        },
      },
    })
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

    let imageUrl: string | null = null

    if (image) {
      const ext = path.extname(image.name) || '.jpg'
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
      const filePath = path.join(UPLOAD_DIR, uniqueName)
      const bytes = await image.arrayBuffer()
      await writeFile(filePath, Buffer.from(bytes))
      imageUrl = `/uploads/books/${uniqueName}`
    }

    const book = await db.book.create({
      data: {
        title,
        author,
        edition,
        condition,
        price,
        type,
        description,
        imageUrl,
        userId: userId || 'anonymous',
      },
    })

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

    await db.book.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
