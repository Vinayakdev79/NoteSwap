import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'

// GET /api/serve-upload?path=notes/xxx.pdf or path=books/xxx.jpg
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const filePath = searchParams.get('path')

    if (!filePath) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    }

    // Prevent directory traversal
    const sanitized = filePath.replace(/(^\.+|[\\/]\.+)/g, '')
    const fullPath = path.join(process.cwd(), 'uploads', sanitized)

    // Check file exists
    await stat(fullPath)

    const fileBuffer = await readFile(fullPath)

    // Determine content type
    const ext = path.extname(fullPath).toLowerCase()
    const contentTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.txt': 'text/plain',
    }

    const contentType = contentTypes[ext] || 'application/octet-stream'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error: unknown) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
