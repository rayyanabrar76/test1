import type { Metadata, ResolvingMetadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailsClient from "@/app/(with-header)/product/ProductDetails";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

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

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) return { title: "Product Not Found" };

  const baseUrl = "https://aps.com.pk";
  const productUrl = `${baseUrl}/product/${id}`;
  const productImage = product.image || "/default-og-image.jpg";

  return {
    title: `${product.name} | APS Industrial Asset`,
    description:
      product.description ||
      `High-quality ${product.name} at APS Industrial Asset.`,
    alternates: { canonical: productUrl },
    openGraph: {
      title: `${product.name} | APS Industrial Asset`,
      description: product.description ?? undefined,
      url: productUrl,
      siteName: "APS Industrial Asset",
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

  const keyword = getCategoryKeyword(product.category);
  const fallbackUrl = getFallbackUrl(product.category);

  // ✅ Use contains instead of equals for flexible category matching
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
    <ProductDetailsClient
      product={product as any}
      relatedProducts={relatedProducts as any}
      fallbackUrl={fallbackUrl}
    />
  );
}