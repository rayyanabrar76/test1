import { prisma } from "@/lib/prisma";
import HomePageClient from "@/components/HomePageClient";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: [
          "aps-sync-panel",
          "smart-ups-surt-series-1-20kva",
          "perkins-industrial-generator-pakistan-50kva-220kva",
          "dari-Piston-compressors-pakistan",
        ],
      },
    },
    orderBy: { name: "asc" },
  });

  return <HomePageClient allProductsFromDb={products as any} />;
}