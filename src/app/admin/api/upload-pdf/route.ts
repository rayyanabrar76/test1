import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const blob = await put(file.name, file, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: true, 
    })

    return NextResponse.json({ url: blob.url })
 } catch (error) {
  console.error(error)
  return NextResponse.json({ error: String(error) }, { status: 500 }) // ← change this line
}
}
