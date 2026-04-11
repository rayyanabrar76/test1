import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import AirCompressorClient from "./AirCompressorClient";

export const metadata: Metadata = {
  title: "Industrial Air Compressors | Dari, Puma & Dukas Systems",
  description: "Premium industrial air solutions in Pakistan. Authorized dealer for Dari Italian compressors, Puma professional pumps, and Dukas VSD screw systems. 14-Bar high-pressure & energy-efficient air stations.",
  keywords: [
    "Dari Air Compressor Pakistan", 
    "Puma Industrial Compressor",
    "Dukas Screw Compressor VSD", 
    "High Pressure Air Compressor 14 Bar",
    "Italian Air Compressor Pakistan",
    "Two Stage Piston Compressor",
    "Industrial Air Audit Pakistan",
    "Laser Cutting Air Station"
  ],
};

export default async function AirCompressorInventoryPage() {
  const allProducts = await prisma.product.findMany({
    where: {
      brand: {
        in: ["DARI", "Puma", "DUKAS"],
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <AirCompressorClient allProductsFromDb={allProducts as any} />
  );
}