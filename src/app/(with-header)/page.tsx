import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import HomePageClient from "@/components/HomePageClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aps.com.pk";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Advanced Power Solutions",
  url: siteUrl,
  logo: `${siteUrl}/aps-logo.png`,
  sameAs: ["https://www.linkedin.com", "https://www.facebook.com"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Office #205, Asad Business Centre, Model Town",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
  },
};

export const metadata: Metadata = {
  title: "Advanced Power Solutions | Industrial Power Systems Pakistan",
  description: "Enterprise-grade power solutions in Pakistan.",
};

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HomePageClient allProductsFromDb={products as any} />
    </>
  );
}