import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
const base = siteUrl.replace(/\/$/, "");

// Maps product category strings (DB values) to inventory URL slugs
const CATEGORY_SLUG_MAP: Record<string, string> = {
  generators:    "generators",
  solar:         "solar",
  ups:           "ups",
  panels:        "panels",
  aircompressor: "aircompressor",
};

// Generator subcategory drill-downs — first-class SEO targets
const SUBCATEGORY_SLUGS = [
  "generators/cummins",
  "generators/perkins",
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
    {
      url: `${base}/request`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  let categoryRoutes: MetadataRoute.Sitemap = [];
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    // 2. CATEGORY ROUTES — max(updatedAt) per category from DB
    const categoryMaxDates = await prisma.product.groupBy({
      by: ["category"],
      _max: { updatedAt: true },
    });

    // Build a lookup: normalised category key → latest product updatedAt
    const categoryDateMap = new Map<string, Date>();
    for (const row of categoryMaxDates) {
      const key = row.category.toLowerCase().replace(/\s+/g, "");
      const date = row._max.updatedAt ?? new Date();
      categoryDateMap.set(key, date);
    }

    categoryRoutes = Object.entries(CATEGORY_SLUG_MAP).map(([key, slug]) => ({
      url: `${base}/inventory/${slug}`,
      lastModified: categoryDateMap.get(key) ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // 3. PRODUCT ROUTES — pull real updatedAt from DB.
    // Use the DB-stored id as-is. Route handler is case-insensitive
    // (Prisma mode: 'insensitive'), so DB case = canonical URL form.
    const allProducts = await prisma.product.findMany({
      select: { id: true, updatedAt: true },
    });

    productRoutes = allProducts.map((product) => ({
      url: `${base}/product/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Sitemap error: failed to fetch data from database", error);
  }

  // 4. SUBCATEGORY DRILL-DOWN ROUTES
  const subcategoryRoutes: MetadataRoute.Sitemap = SUBCATEGORY_SLUGS.map((slug) => ({
    url: `${base}/inventory/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...mainRoutes, ...categoryRoutes, ...subcategoryRoutes, ...productRoutes];
}