import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const newId = (body.id as string | undefined)?.trim() || id

    const product = await prisma.product.update({
      where: { id },
      data: {
        id: newId,
        slug: newId,
        name: body.name,
        brand: body.brand || 'APS',
        description: body.description || '',
        image: body.image || '',
        gallery: body.gallery || [],
        category: body.category || 'General',
        pdf_link: body.pdf_link || null,
        pdf_links: body.pdf_links || [],
        metadata: body.metadata || {},
        badges: body.badges || {},   // ← added
      },
    })

    if (newId !== id) revalidatePath(`/product/${id}`)
    revalidatePath(`/product/${newId}`)
    revalidatePath('/')
    return NextResponse.json(product)
  } catch (err) {
    console.error('[PUT /api/products]', err)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.product.delete({ where: { id } })
    revalidatePath(`/product/${id}`)
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/products]', err)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}