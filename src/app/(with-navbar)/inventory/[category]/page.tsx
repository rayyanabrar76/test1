import React from "react";
import type { Metadata } from "next";
// Import from the same folder now that you moved the file
import InventoryClient from "../InventoryClient";

// PERFORMANCE: Keep it static but revalidate every hour for SEO speed
export const revalidate = 3600;

// Dynamic Base URL logic
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
const base = siteUrl.replace(/\/$/, "");

const categoryLabels: Record<string, string> = {
  generators: "Industrial Diesel Generators",
  solar: "Solar Power Solutions",
  ups: "Uninterruptible Power Supply (UPS)",
  panels: "Control Panels & ATS",
  aircompressor: "Industrial Air Compressors",
};

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const key = params.category?.toLowerCase();
  const label = categoryLabels[key] || params.category;
  
  // SEO TITLE: Targeted specifically for the Pakistan industrial market
  const seoTitle = `${label} in Pakistan | APS Power Solutions`;
  const seoDesc = `Premium quality ${label} available at APS Power. Leading authorized dealer offering 24/7 technical support and professional installation across Pakistan.`;

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: {
      // CANONICAL: Points to the official URL Google should show in search
      canonical: `${base}/inventory/${key}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: `${base}/inventory/${key}`,
      siteName: "APS Power Solutions",
      locale: "en_PK",
      type: "website",
    },
  };
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  // Pass the category to the client component (e.g., "GENERATORS")
  const category = params.category?.toUpperCase();

  // Cast InventoryClient to avoid JSX prop type errors
  const InventoryClientAny = InventoryClient as unknown as React.ComponentType<{
    initialCategory?: string | null;
  }>;

  return (
    <main className="min-h-screen bg-[#050505]">
      <InventoryClientAny initialCategory={category} />
    </main>
  );
}