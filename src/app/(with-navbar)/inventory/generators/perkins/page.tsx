import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PerkinsClient from "./PerkinsClient";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Perkins Diesel Generator Price in Pakistan | 10kVA - 1375kVA",
  description: "Official Perkins powered APS Series generators in Pakistan. Ultra-silent, fuel-efficient diesel generators from 10kVA to 1375kVA. Best prices for Lahore, Karachi, and Islamabad.",
  keywords: [
    "Perkins Generator Price in Pakistan", 
    "Silent Diesel Generator Pakistan", 
    "Perkins 50kVA price", 
    "Perkins 100kVA generator", 
    "APS Series Perkins",
    "Industrial Power Solutions Pakistan"
  ],
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL!}/inventory/generators/perkins` },
  openGraph: {
    title: "Perkins Powered APS Series | High-Performance Generators",
    description: "The gold standard for residential and industrial power in Pakistan.",
    images: ["/images/generators/perkins.png"],
  },
};

export default async function PerkinsInventoryPage() {
  const allProducts = await prisma.product.findMany({
    where: {
      brand: {
        equals: "Perkins",
        mode: "insensitive",
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <main>
      <PerkinsClient allProductsFromDb={allProducts as any} />
    </main>
  );
}