import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // This connects to Neon

export async function GET() {
  try {
    // 1. Fetch live data from Neon
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' } // Optional: keeps them alphabetized
    });

    // 2. Return the database results with cache headers so browsers and the
    //    Vercel edge cache the response for 10 min (stale-while-revalidate
    //    keeps it warm for another 5 min while a fresh copy fetches).
    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products from database" },
      { status: 500 }
    );
  }
}