import { Metadata } from "next";
// This is your pre-configured client that uses 'ws' and '@prisma/adapter-neon'
import { prisma } from "@/lib/prisma"; 
import Clientups from "./UpsClient";
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "APC UPS Power Solutions | Smart-UPS & Symmetra Modular",
  description: "Enterprise-grade APC UPS systems in Pakistan. High-efficiency Schneider Electric power architecture.",
  keywords: ["APC UPS Pakistan", "Schneider Electric", "Smart-UPS", "Eaton UPS"],
};

export default async function UpsInventoryPage() {
  /**
   * 1. Fetching from Neon via the adapter.
   * Because we are using the Serverless driver, this is optimized 
   * for fast cold-starts in Next.js.
   */
  const products = await prisma.product.findMany({
    where: {
      // You can filter by category here if your seed script 
      // labeled them as 'UPS'
      category: {
        contains: 'UPS',
        mode: 'insensitive'
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  /**
   * 2. The 'as any' cast is the most direct way to bypass the 
   * JSON-to-ProductVariant array mismatch we saw in your logs.
   */
  return (
    <main>
      <Clientups allProductsFromDb={products as any} />
    </main>
  );
}