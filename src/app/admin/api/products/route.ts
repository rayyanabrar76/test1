import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const body = await req.json()
  const product = await prisma.product.create({
    data: {
      id: body.slug,
      slug: body.slug,
      name: body.name,
      brand: body.brand || 'APS',
      description: body.description || '',
      price: parseFloat(body.price) || 0,
      image: body.image || '',
      category: body.category || 'General',
      gallery: body.gallery || [],
      pdf_link: body.pdf_link || null,
      pdf_links: body.pdf_links || [],
      badges: body.badges || [],
    },
  })
  return NextResponse.json(product)
}