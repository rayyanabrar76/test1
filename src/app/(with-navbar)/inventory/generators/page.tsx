import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import GeneratorsClient from "./ClientGenerator";

export const metadata: Metadata = {
  title: "Power Systems & Industrial Generators | Perkins & Cummins",
  description: "Explore our premium generator inventory featuring Perkins and Cummins power systems. Engineered for resilience in industrial and commercial infrastructure.",
  keywords: ["Perkins Generators", "Cummins Power Systems", "Industrial Generators", "Power Density"],
};

export default async function GeneratorsInventoryPage() {
  const allProducts = await prisma.product.findMany({
    where: {
      brand: {
        in: ["Perkins", "Cummins", "Yangdong"],
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <GeneratorsClient allProductsFromDb={allProducts as any} />
  );
}