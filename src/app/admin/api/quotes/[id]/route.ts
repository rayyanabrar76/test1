import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const quote = await prisma.quote.update({
    where: { id },
    data: { status: body.status },
  })
  return NextResponse.json(quote)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.quote.delete({ where: { id } })
  return NextResponse.json({ success: true })
}