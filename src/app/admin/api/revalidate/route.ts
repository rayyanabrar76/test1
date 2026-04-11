import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST() {
  // Revalidate all store-facing product pages
  revalidatePath('/', 'layout')          // entire site
  revalidatePath('/products')            // products listing page
  revalidatePath('/products/[slug]', 'page') // individual product pages

  return NextResponse.json({ revalidated: true })
}