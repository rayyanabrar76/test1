import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const base = siteUrl ? siteUrl.replace(/\/$/, "") : "";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const staticRoutes = [
    "",
    "/inventory",
    "/company",
  ].map((route) => ({
    url: `${base}${route || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const allProducts = await prisma.product.findMany({
      select: { id: true },
    });

    productRoutes = allProducts.map((product: { id: string }) => ({
      url: `${base}/product/${product.id.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Sitemap: failed to fetch products", error);
  }

  return [...staticRoutes, ...productRoutes];
}