import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import InventoryClient from "./InventoryClient";
import { Product } from "@/types/store";

// Revalidate every hour — static speed with fresh data, NOT force-dynamic
export const revalidate = 3600;

// Single source of truth for base URL — same as the rest of your codebase
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
const base = siteUrl.replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(base || "https://www.aps.com.pk"),
  title: "Industrial Inventory | APS Advanced Power Solutions Pakistan",
  description:
    "Official APS Inventory: Perkins & Cummins Generators, Solar Energy, and Industrial UPS. " +
    "Serving Lahore's industrial sectors with 24/7 maintenance support.",
  // Note: Google ignores the keywords tag — keeping for legacy reasons only
  keywords: [
    "Industrial Generators Lahore",
    "APS Power Solutions Pakistan",
    "Perkins Generator Suppliers Punjab",
    "Cummins Power Maintenance Lahore",
    "Solar Energy Solutions Sheikhupura Road",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${base}/inventory`,
  },
  openGraph: {
    title: "APS Industrial Inventory | Powering Pakistan",
    description: "Verified registry of high-performance energy solutions by APS Pakistan.",
    url: `${base}/inventory`,
    siteName: "APS Power Solutions",
    images: [
      {
        url: `${base}/og/inventory.jpg`,
        width: 1200,
        height: 630,
        alt: "APS Power Solutions — Industrial Inventory Pakistan",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "APS Industrial Inventory | Powering Pakistan",
    description: "Verified registry of high-performance energy solutions by APS Pakistan.",
    images: [`${base}/og/inventory.jpg`],
  },
};

// JSON-LD: Organization + ItemList for the inventory page
function InventorySchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "APS Power Solutions",
        url: base,
        areaServed: {
          "@type": "Country",
          name: "Pakistan",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          availableLanguage: ["English", "Urdu"],
          hoursAvailable: "Mo-Su 00:00-24:00",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: base,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Inventory",
            item: `${base}/inventory`,
          },
        ],
      },
      // Tells Google this page is a collection of products
      {
        "@type": "CollectionPage",
        name: "APS Industrial Inventory",
        url: `${base}/inventory`,
        description:
          "Complete inventory of industrial generators, solar systems, UPS, air compressors, and control panels by APS Power Solutions Pakistan.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function InventoryPage() {
  // Prisma returns JSON fields (like `variants`) as JsonValue.
  // Cast to Product[] since our runtime shape matches.
  const allProducts = (await prisma.product.findMany({
    orderBy: { name: "asc" },
  })) as unknown as Product[];

  return (
    <>
      <InventorySchema />
      <InventoryClient allProductsFromDb={allProducts} />
    </>
  );
}