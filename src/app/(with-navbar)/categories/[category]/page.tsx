import React from "react";
import type { Metadata } from "next";
// Change the import to this:
import InventoryClient from "@/app/(with-navbar)/inventory/InventoryClient";

export const dynamic = 'force-dynamic';

const categoryLabels: Record<string, string> = {
  power_core: "Power Core",
  control_logic: "Control Logic",
  distribution: "Distribution",
  armoring: "Armoring",
};

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const key = params.category?.toLowerCase();
  const label = categoryLabels[key] || params.category;

  return {
    title: `${label} | APS Categories`,
    description: `Browse APS assets in category ${label}.`,
    alternates: {
      canonical: `/categories/${params.category}`,
    },
  };
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = params.category?.toUpperCase();

  // Cast InventoryClient to a generic component type to avoid JSX prop type error
  const InventoryClientAny = InventoryClient as unknown as React.ComponentType<{
    initialCategory?: string | null;
  }>;

  return <InventoryClientAny initialCategory={category} />;
}