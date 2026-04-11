import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // This connects to Neon

export async function GET() {
  try {
    // 1. Fetch live data from Neon
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' } // Optional: keeps them alphabetized
    });
    
    // 2. Return the database results
    return NextResponse.json(products);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products from database" }, 
      { status: 500 }
    );
  }
}