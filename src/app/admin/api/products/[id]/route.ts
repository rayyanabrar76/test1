import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const product = await prisma.product.update({
    where: { slug: id },
    data: {
      name: body.name,
      slug: body.slug,
      brand: body.brand || 'APS',
      description: body.description || '',
      price: parseFloat(body.price) || 0,
      image: body.image || '',
      gallery: body.gallery || [],
      category: body.category || 'General',
      pdf_link: body.pdf_link || null,
      pdf_links: body.pdf_links || [],
    },
  })

  // Revalidate both old and new slug in case slug changed
  revalidatePath(`/product/${id}`)
  revalidatePath(`/product/${body.slug}`)
  revalidatePath('/')

  return NextResponse.json(product)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.product.delete({ where: { slug: id } })
  revalidatePath('/')
  return NextResponse.json({ success: true })
}