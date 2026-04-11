import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function DELETE(_: Request, { params }: { params: Promise<{ public_id: string }> }) {
  try {
    const { public_id: rawId } = await params
    const public_id = decodeURIComponent(rawId)
    await cloudinary.uploader.destroy(public_id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}