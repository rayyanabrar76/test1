import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PanelClient from "./panelClient";
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Industrial Switchgear & Power Panels | LV/MV Distribution Solutions",
  description: "High-performance electrical switchgear and panel solutions. Featuring Medium Voltage (MV) panels, Low Voltage (LV) distribution, PFI plants, and Motor Control Centers (MCC) for industrial power infrastructure.",
  keywords: [
    "Industrial Switchgear Pakistan",
    "MV Medium Voltage Panels",
    "LV Low Voltage Panels",
    "Motor Control Center MCC",
    "PFI Plant Pakistan",
    "Bus Tie Duct BTD",
    "Automatic Transfer Switch ATS",
    "Synchronizing Panels",
    "Electrical Panel Manufacturer"
  ],
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL!}/inventory/panels` },
};

export default async function ElectricGearInventoryPage() {
  const allProducts = await prisma.product.findMany({
    where: {
      category: {
        in: ["Core Switchgear", "Automation & Control", "Infrastructure & Wiring"],
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <PanelClient allProductsFromDb={allProducts as any} />
  );
}