import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import InventoryClient from "./InventoryClient";
import { Product } from "@/types/store";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aps.com.pk"),
  title: "Industrial Inventory | APS Advanced Power Solutions Pakistan",
  description: "Official APS Inventory: Perkins & Cummins Generators, Solar Energy, and Industrial UPS. Serving Lahore's industrial sectors with 24/7 maintenance support.",
  keywords: [
    "Industrial Generators Lahore",
    "APS Power Solutions Pakistan",
    "Perkins Generator Suppliers Punjab",
    "Cummins Power Maintenance Lahore",
    "Solar Energy Solutions Sheikhupura Road"
  ],
  alternates: { canonical: "/inventory" },
  openGraph: {
    title: "APS Industrial Inventory | Powering Pakistan",
    description: "Verified registry of high-performance energy solutions by APS Pakistan.",
    url: "/inventory",
    siteName: "Advanced Power Solutions",
    images: [{ url: "/og-inventory.jpg", width: 1200, height: 630 }],
    locale: "en_PK",
    type: "website",
  },
};

export default async function InventoryPage() {
  const domain = "https://www.aps.com.pk";

  // Fetch ALL products in one query — client will split by category
  const allProducts = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  const jsonLd = { /* ...your existing jsonLd unchanged... */ };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InventoryClient allProductsFromDb={allProducts as any} />
    </>
  );
}