import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

function toId(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(products)
  } catch (err) {
    console.error('[GET /api/products]', err)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const baseId = toId(body.id || body.name || 'product')
    const existing = await prisma.product.findUnique({ where: { id: baseId } })
    const finalId = existing ? `${baseId}-${Date.now().toString(36)}` : baseId

    const product = await prisma.product.create({
      data: {
        id: finalId,
        slug: finalId,
        name: body.name,
        brand: body.brand || 'APS',
        description: body.description || '',
        image: body.image || '',
        category: body.category || 'General',
        gallery: body.gallery || [],
        pdf_link: body.pdf_link || null,
        pdf_links: body.pdf_links || [],
        metadata: body.metadata || {},
        badges: body.badges || {},   // ← added
      },
    })
    return NextResponse.json(product)
  } catch (err) {
    console.error('[POST /api/products]', err)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}