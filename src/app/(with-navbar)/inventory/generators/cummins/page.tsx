import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CumminsClient from "./CumminsClient";
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Cummins Diesel Generator Price in Pakistan | 25kVA - 2500kVA",
  description: "Official Cummins powered generators in Pakistan by Advanced Power Solution. High-reliability, heavy-duty diesel generators from 25kVA to 2500kVA. Expert installation and support across Pakistan.",
  keywords: [
    "Cummins Generator Price in Pakistan", 
    "Cummins 100kVA Price Pakistan", 
    "Heavy Duty Diesel Generators", 
    "Cummins 500kVA Price", 
    "Industrial Cummins Generators Lahore",
    "Cummins Silent Generator Karachi"
  ],
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL!}/inventory/generators/cummins` },
  openGraph: {
    title: "Cummins Global Power Series | Reliability Without Compromise",
    description: "Industrial-grade Cummins power solutions for the Pakistani market.",
    images: ["/images/generators/cummins.png"],
  },
};

export default async function CumminsInventoryPage() {
  const allProducts = await prisma.product.findMany({
    where: {
      brand: {
        equals: "Cummins",
        mode: "insensitive",
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <main>
      <CumminsClient allProductsFromDb={allProducts as any} />
    </main>
  );
}