import type { Metadata, ResolvingMetadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailsClient from "@/app/(with-header)/product/ProductDetails";

// ✅ Fix 3: force fresh data on every request, no caching
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

async function getProduct(id: string) {
  return prisma.product.findFirst({
    where: { id: { equals: id, mode: "insensitive" } },
  });
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

  return <ProductDetailsClient product={product as any} />;
}