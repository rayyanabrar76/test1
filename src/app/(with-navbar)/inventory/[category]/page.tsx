import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Product } from "@/types/store";
import InventoryClient from "../InventoryClient";

// PERFORMANCE: Static with hourly revalidation
export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
const base = siteUrl.replace(/\/$/, "");

// --- Types -----------------------------------------------------------

interface CategoryMeta {
  label: string;
  description: string;
  ogImage: string; // path relative to your /public folder
}

// --- Category config -------------------------------------------------
// One place to update labels, descriptions, and OG images per category

const categoryConfig: Record<string, CategoryMeta> = {
  generators: {
    label: "Industrial Diesel Generators",
    description:
      "Premium industrial diesel generators available at APS Power Solutions. " +
      "Authorized dealer offering 24/7 technical support and professional installation across Pakistan.",
    ogImage: "/og/generators.jpg",
  },
  solar: {
    label: "Solar Power Solutions",
    description:
      "High-efficiency solar power systems and panels at APS Power Solutions. " +
      "Authorized dealer with expert installation and after-sales support across Pakistan.",
    ogImage: "/og/solar.jpg",
  },
  ups: {
    label: "Uninterruptible Power Supply (UPS)",
    description:
      "Industrial and commercial UPS systems at APS Power Solutions. " +
      "Reliable power backup with 24/7 technical support and installation across Pakistan.",
    ogImage: "/og/ups.jpg",
  },
  panels: {
    label: "Control Panels & ATS",
    description:
      "Control panels and automatic transfer switches (ATS) at APS Power Solutions. " +
      "Expert supply and installation for industrial and commercial projects across Pakistan.",
    ogImage: "/og/panels.jpg",
  },
  aircompressor: {
    label: "Industrial Air Compressors",
    description:
      "Heavy-duty industrial air compressors at APS Power Solutions. " +
      "Authorized dealer with professional installation and maintenance support across Pakistan.",
    ogImage: "/og/aircompressor.jpg",
  },
};

const fallbackMeta: CategoryMeta = {
  label: "Power Solutions",
  description:
    "Quality power solutions from APS Power Solutions — authorized dealer with " +
    "24/7 technical support and installation across Pakistan.",
  ogImage: "/og/default.jpg",
};

// --- Metadata --------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const key = params.category?.toLowerCase();
  const meta = categoryConfig[key] ?? fallbackMeta;

  const seoTitle = `${meta.label} in Pakistan | APS Power Solutions`;
  const canonicalUrl = `${base}/inventory/${key}`;
  const ogImageUrl = `${base}${meta.ogImage}`;

  return {
    title: seoTitle,
    description: meta.description,

    // Tell Google: index this page and follow all links on it
    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: seoTitle,
      description: meta.description,
      url: canonicalUrl,
      siteName: "APS Power Solutions",
      locale: "en_PK",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${meta.label} — APS Power Solutions Pakistan`,
        },
      ],
    },

    // Controls WhatsApp, Twitter/X previews
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: meta.description,
      images: [ogImageUrl],
    },
  };
}

// --- JSON-LD schema --------------------------------------------------

function CategorySchema({
  label,
  canonicalUrl,
}: {
  label: string;
  canonicalUrl: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      // BreadcrumbList — shows the path in Google search results
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: base,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Inventory",
            item: `${base}/inventory`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: label,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// --- Page component --------------------------------------------------

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const key = params.category?.toLowerCase();
  const meta = categoryConfig[key] ?? fallbackMeta;
  const canonicalUrl = `${base}/inventory/${key}`;
  const category = key.toUpperCase();

  // Fetch all products — InventoryClient filters client-side by initialCategory
  const allProducts = (await prisma.product.findMany({
    orderBy: { name: "asc" },
  })) as unknown as Product[];

  return (
    <main className="min-h-screen bg-[#050505]">
      <CategorySchema label={meta.label} canonicalUrl={canonicalUrl} />
      <InventoryClient
        allProductsFromDb={allProducts}
        initialCategory={category}
      />
    </main>
  );
}