import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const product = await prisma.product.update({
    where: { slug: id }, // PUT still uses slug (correct, from editing.slug)
    data: {
      name: body.name,
      brand: body.brand || 'APS',
      description: body.description || '',
      image: body.image || '',
      gallery: body.gallery || [],
      category: body.category || 'General',
      pdf_link: body.pdf_link || null,
      pdf_links: body.pdf_links || [],
      metadata: body.metadata || {},
    },
  })

  revalidatePath(`/product/${id}`)
  revalidatePath('/')
  return NextResponse.json(product)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.product.delete({ where: { id: id } }) // ✅ fixed: id not slug
  revalidatePath('/')
  return NextResponse.json({ success: true })
}