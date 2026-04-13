import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const body = await req.json()

  const baseSlug = generateSlug(body.name || 'product')

  // Ensure slug is unique by appending a short timestamp suffix if needed
  const existing = await prisma.product.findUnique({ where: { slug: baseSlug } })
  const slug = existing ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug

  const product = await prisma.product.create({
    data: {
      id: randomUUID(),   // ← added: schema requires id without a default
      slug,
      name: body.name,
      brand: body.brand || 'APS',
      description: body.description || '',
      image: body.image || '',
      category: body.category || 'General',
      gallery: body.gallery || [],
      pdf_link: body.pdf_link || null,
      pdf_links: body.pdf_links || [],
      metadata: body.metadata || {},
    },
  })
  return NextResponse.json(product)
}
