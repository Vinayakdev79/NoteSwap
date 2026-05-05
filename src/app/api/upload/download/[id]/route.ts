import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { readFile } from 'fs/promises'
import path from 'path'

// GET /api/upload/download/[id] — download a note file
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const note = await db.note.findUnique({ where: { id } })
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    // Extract filename from fileUrl
    const fileName = path.basename(note.fileUrl)
    const filePath = path.join(process.cwd(), 'uploads', 'notes', fileName)

    const fileBuffer = await readFile(filePath)

    // Increment download count
    await db.note.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    })

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${note.fileName}"`,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'File not found'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
