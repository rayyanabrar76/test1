import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
const base = siteUrl.replace(/\/$/, "");

// Category slugs with their last-touched dates
// Update these manually whenever you make meaningful changes to a category
const categories: { slug: string; updatedAt: Date }[] = [
  { slug: "generators",   updatedAt: new Date("2025-01-01") },
  { slug: "solar",        updatedAt: new Date("2025-01-01") },
  { slug: "ups",          updatedAt: new Date("2025-01-01") },
  { slug: "panels",       updatedAt: new Date("2025-01-01") },
  { slug: "aircompressor",updatedAt: new Date("2025-01-01") },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // 1. MAIN STATIC ROUTES
  const mainRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/services`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/inventory`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/company`,
      lastModified: new Date("2025-01-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 2. CATEGORY ROUTES — real dates, not new Date()
  const categoryRoutes: MetadataRoute.Sitemap = categories.map(({ slug, updatedAt }) => ({
    url: `${base}/inventory/${slug}`,
    lastModified: updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. PRODUCT ROUTES — pull real updatedAt from DB
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        updatedAt: true, // ← real timestamp instead of new Date()
      },
    });

    productRoutes = allProducts.map((product) => ({
      url: `${base}/product/${product.id.toLowerCase()}`,
      lastModified: product.updatedAt,   // ← actual last-modified date
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Sitemap error: failed to fetch products from database", error);
  }

  return [...mainRoutes, ...categoryRoutes, ...productRoutes];
}