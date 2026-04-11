// Search Utility
// No static product imports — all products come from Prisma via /api/products
import { Product } from "@/types/store";

// Enhanced product with search index
export interface SearchableProduct extends Product {
  searchIndex: string;
  searchScore?: number;
}

// ✅ Fetch all products from the Prisma API route
export async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch("/api/products", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Build comprehensive search index from ALL metadata fields
export function buildSearchIndex(product: Product): string {
  const parts: string[] = [];

  // Core fields
  parts.push(product.name);
  parts.push(product.id);
  parts.push(product.category);
  parts.push(product.description);

  // Dynamically extract ALL metadata fields (future-proof)
  if (product.metadata) {
    Object.entries(product.metadata).forEach(([key, value]) => {
      if (value) {
        parts.push(key);
        parts.push(String(value));
        parts.push(String(value).replace(/[_\-\/]/g, " "));
      }
    });
  }

  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Fuzzy search scoring - ranks results by relevance
export function calculateSearchScore(
  product: SearchableProduct,
  query: string
): number {
  const queryLower = query.toLowerCase().trim();
  const searchIndex = product.searchIndex;

  let score = 0;

  if (product.name.toLowerCase() === queryLower) score += 100;
  if (product.id.toLowerCase() === queryLower) score += 90;
  if (product.name.toLowerCase().startsWith(queryLower)) score += 50;
  if (product.id.toLowerCase().startsWith(queryLower)) score += 45;
  if (product.name.toLowerCase().includes(queryLower)) score += 30;
  if (product.id.toLowerCase().includes(queryLower)) score += 25;
  if (product.category.toLowerCase().includes(queryLower)) score += 20;

  const words = queryLower.split(/\s+/);
  words.forEach((word) => {
    if (word.length > 2) {
      const regex = new RegExp(`\\b${word}`, "i");
      if (regex.test(product.name)) score += 15;
      if (regex.test(product.id)) score += 12;
      if (regex.test(product.category)) score += 10;
      if (regex.test(product.description)) score += 8;
    }
  });

  if (product.metadata) {
    Object.values(product.metadata).forEach((value) => {
      if (value && String(value).toLowerCase().includes(queryLower)) {
        score += 5;
      }
    });
  }

  if (searchIndex.includes(queryLower)) score += 3;
  if (product.name.length < 50) score += 2;

  return score;
}

// Main search function
export function searchProducts(
  products: Product[],
  query: string,
  options?: {
    limit?: number;
    category?: string;
  }
): SearchableProduct[] {
  if (!query.trim()) {
    return products.map((p) => ({
      ...p,
      searchIndex: buildSearchIndex(p),
    }));
  }

  const queryLower = query.toLowerCase().trim();

  let searchableProducts: SearchableProduct[] = products.map((product) => ({
    ...product,
    searchIndex: buildSearchIndex(product),
  }));

  if (options?.category && options.category !== "All") {
    searchableProducts = searchableProducts.filter(
      (p) =>
        p.category.replace(/_/g, " ").toLowerCase() ===
        options.category!.toLowerCase()
    );
  }

  const results = searchableProducts
    .map((product) => ({
      ...product,
      searchScore: calculateSearchScore(product, queryLower),
    }))
    .filter(
      (product) =>
        product.searchScore! > 0 || product.searchIndex.includes(queryLower)
    )
    .sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));

  return options?.limit ? results.slice(0, options.limit) : results;
}

// Extract unique categories dynamically
export function extractCategories(products: Product[]): string[] {
  const categories = new Set<string>();
  products.forEach((product) => {
    if (product.category) {
      categories.add(product.category.replace(/_/g, " "));
    }
  });
  return ["All", ...Array.from(categories).sort()];
}