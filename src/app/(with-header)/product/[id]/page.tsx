import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailsClient from "@/app/(with-header)/product/ProductDetails";

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { id: true } });
  return products.map((p) => ({ id: p.id }));
}

type Props = {
  params: Promise<{ id: string }>;
};

// Pulling the URL strictly from Environment Variables
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

async function getProduct(id: string) {
  return prisma.product.findFirst({
    where: { id: { equals: id, mode: "insensitive" } },
  });
}

// ✅ Extract keyword from category for flexible matching
function getCategoryKeyword(category: string | null | undefined): string {
  const cat = (category ?? "").toLowerCase();
  if (cat.includes("ups")) return "ups";
  if (cat.includes("solar")) return "solar";
  if (cat.includes("compressor")) return "compressor";
  if (cat.includes("panel") || cat.includes("gear") || cat.includes("switchgear")) return "panel";
  if (cat.includes("cummins")) return "cummins";
  if (cat.includes("yangdong")) return "yangdong";
  return "perkins";
}

function getFallbackUrl(category: string | null | undefined): string {
  const cat = (category ?? "").toLowerCase();
  if (cat.includes("ups")) return "/inventory/ups";
  if (cat.includes("solar")) return "/inventory/solar";
  if (cat.includes("compressor")) return "/inventory/aircompressor";
  if (cat.includes("panel") || cat.includes("gear") || cat.includes("switchgear"))
    return "/inventory/panels";
  return "/inventory/generators";
}

function getCategoryLabel(category: string | null | undefined): string {
  const cat = (category ?? "").toLowerCase();
  if (cat.includes("ups")) return "UPS Systems";
  if (cat.includes("solar")) return "Solar Systems";
  if (cat.includes("compressor")) return "Air Compressors";
  if (cat.includes("panel") || cat.includes("gear") || cat.includes("switchgear"))
    return "Control Panels";
  return "Generators";
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product || !siteUrl) return { title: "Product Not Found" };

  const productUrl = `${siteUrl}/product/${id}`;
  const productImage = product.image || "/default-og-image.jpg";

  return {
    metadataBase: new URL(siteUrl),
    title: `${product.name} Price in Pakistan | APS Industrial Asset`,
    description:
      product.description ||
      `High-quality ${product.name} available for industrial and commercial use in Pakistan.`,
    alternates: { 
        canonical: productUrl,
        languages: {
            'en-PK': productUrl,
        },
    },
    openGraph: {
      title: `${product.name} | Pakistan Industrial Power`,
      description: product.description ?? undefined,
      url: productUrl,
      siteName: "Advanced Power Solutions", 
      images: [
        { url: productImage, width: 1200, height: 630, alt: product.name },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description ?? undefined,
      images: [productImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();
  if (!siteUrl) throw new Error("NEXT_PUBLIC_SITE_URL is not defined");

  // JSON-LD for Google Product Snippet - Locked to Pakistan
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": `${product.name} in Pakistan`,
    "image": product.image ? [product.image] : [],
    "description": product.description || `Industrial grade ${product.name} for Pakistani market.`,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "APS Industrial"
    }
  };

  const keyword = getCategoryKeyword(product.category);
  const fallbackUrl = getFallbackUrl(product.category);
  const categoryLabel = getCategoryLabel(product.category);
  const productUrl = `${siteUrl}/product/${id}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": "Inventory", "item": `${siteUrl}/inventory` },
      { "@type": "ListItem", "position": 3, "name": categoryLabel, "item": `${siteUrl}${fallbackUrl}` },
      { "@type": "ListItem", "position": 4, "name": product.name, "item": productUrl },
    ],
  };

  const relatedProducts = await prisma.product.findMany({
    where: {
      AND: [
        {
          OR: [
            { category: { contains: keyword, mode: "insensitive" } },
            { brand: { contains: keyword, mode: "insensitive" } },
          ],
        },
        { id: { not: product.id } },
      ],
    },
    take: 4,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailsClient
        product={product as any}
        relatedProducts={relatedProducts as any}
        fallbackUrl={fallbackUrl}
        categoryLabel={categoryLabel}
      />
    </>
  );
}