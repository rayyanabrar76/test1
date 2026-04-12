import { Metadata } from "next";
// Using your pre-configured client
import { prisma } from "@/lib/prisma"; 
import SolarClient from "./SolarClient";
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Solar Solutions | Canadian Solar, Jinko & SolarMax | APS",
  description: "Explore high-efficiency solar panels and hybrid inverters. Featuring Jinko Tiger Neo N-Type, Canadian Solar HiKu7, and SolarMax Falcon Series.",
  keywords: [
    "Canadian Solar Pakistan", 
    "Jinko Solar Tiger Neo", 
    "SolarMax Falcon Hybrid Inverter", 
    "N-Type TOPCon Solar Panels", 
    "Net Metering Solutions Lahore"
  ],
};

export default async function SolarInventoryPage() {
  /**
   * 1. Fetching from Neon via the adapter.
   * We filter for products where the category is 'Solar' 
   * (matching how you did 'UPS' in the other page).
   */
  const products = await prisma.product.findMany({
    where: {
      category: {
        contains: 'Solar',
        mode: 'insensitive'
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  /**
   * 2. Passing data to the Client Component.
   * Using 'as any' to match your UPS logic and bypass type mismatches
   * with the metadata/JSON fields.
   */
  return (
    <main>
      <SolarClient allProductsFromDb={products as any} />
    </main>
  );
}