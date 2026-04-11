import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const customer = await prisma.user.update({
    where: { id },
    data: {
      name: body.name,
      email: body.email,
      companyName: body.companyName,
    },
  })
  return NextResponse.json(customer)
}