import { Metadata } from "next";
// This is your pre-configured client that uses 'ws' and '@prisma/adapter-neon'
import { prisma } from "@/lib/prisma"; 
import Clientups from "./UpsClient";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "APC UPS Power Solutions | Smart-UPS & Symmetra Modular",
  description: "Industrial UPS systems in Pakistan: APC Smart-UPS, Symmetra modular, and Eaton solutions for data centres, factories, and hospitals. Get a quote in 24 hours.",
  keywords: ["APC UPS Pakistan", "Schneider Electric", "Smart-UPS", "Eaton UPS"],
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL!}/inventory/ups` },
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