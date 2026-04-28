import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

// No hardcoded strings. This follows your Vercel/Env settings.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
const base = siteUrl.replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  // 1. MAIN STATIC ROUTES
  const mainRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/inventory`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/company`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 2. CATEGORY ROUTES
  const categories = [
    "generators",
    "solar",
    "ups",
    "panels",
    "aircompressor"
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${base}/inventory/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. PRODUCT ROUTES (The 71+ items)
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const allProducts = await prisma.product.findMany({
      select: { id: true },
    });

    productRoutes = allProducts.map((product) => ({
      url: `${base}/product/${product.id.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Sitemap error: failed to fetch products from database", error);
  }

  return [...mainRoutes, ...categoryRoutes, ...productRoutes];
}