import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'notes')

// Ensure upload directory exists
async function ensureDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true })
  } catch {
    // already exists
  }
}

// GET /api/notes — list all notes
export async function GET() {
  try {
    const notes = await db.note.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true, college: true },
        },
      },
    })
    return NextResponse.json({ notes })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/notes — upload a note (multipart form)
export async function POST(req: NextRequest) {
  try {
    await ensureDir()

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string
    const description = formData.get('description') as string || ''
    const subject = formData.get('subject') as string
    const type = formData.get('type') as string || 'sell'
    const price = parseFloat(formData.get('price') as string || '0')
    const userId = formData.get('userId') as string | null

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!subject) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 })
    }
    if (!userId) {
      return NextResponse.json({ error: 'You must be signed in to upload notes. Please sign in and try again.' }, { status: 401 })
    }

    // Verify user exists
    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found. Please sign in again.' }, { status: 401 })
    }

    // Generate unique filename
    const ext = path.extname(file.name) || '.pdf'
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    const filePath = path.join(UPLOAD_DIR, uniqueName)

    // Write file
    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    const note = await db.note.create({
      data: {
        title,
        description,
        subject,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: `/uploads/notes/${uniqueName}`,
        price,
        type,
        userId,
      },
    })

    return NextResponse.json({ note }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/notes?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 })
    }

    await db.note.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
