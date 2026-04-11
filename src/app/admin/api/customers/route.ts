import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const customers = await prisma.user.findMany({
      include: { _count: { select: { quotes: true } } },
    })
    return NextResponse.json(customers)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}