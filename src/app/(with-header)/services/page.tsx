import type { Metadata } from "next";
import ServicesContent from "./ServicesContent";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
const url = `${siteUrl}/services`;
const description =
  "Industrial power services in Pakistan: generator installation, ATS/AMF panel integration, AMC contracts, and 24/7 nationwide after-sales support.";

export const metadata: Metadata = {
  title: "Power Services in Pakistan",
  description,
  alternates: { canonical: url },
  openGraph: {
    title: "Power Services in Pakistan | APS Power Systems",
    description,
    url,
    siteName: "Advanced Power Solutions",
    locale: "en_PK",
    type: "website",
  },
};

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Industrial Power Services",
  "description": description,
  "url": url,
  "provider": { "@id": `${siteUrl}/#localbusiness` },
  "areaServed": { "@type": "Country", "name": "Pakistan" },
  "serviceType": "Industrial Power Equipment Supply, Installation & Maintenance",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "APS Service Portfolio",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Diesel & Gas Generators",
          "description": "Heavy-duty diesel and gas generators (50kVA-3000kVA) with installation and load testing.",
          "url": `${siteUrl}/inventory/generators`,
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Critical Power / UPS",
          "description": "Double-conversion online UPS systems (1kVA-800kVA) for data centres, factories, and hospitals.",
          "url": `${siteUrl}/inventory/ups`,
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Solar Panel Systems",
          "description": "Industrial-scale solar systems with net metering and AEDB-certified hybrid inverters.",
          "url": `${siteUrl}/inventory/solar`,
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Industrial Air Compressors",
          "description": "Oil-free, direct-drive, and stationary air compressors for industrial production.",
          "url": `${siteUrl}/inventory/aircompressor`,
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Switchgear & Control Panels",
          "description": "Custom LT/HT panels, ATS/AMF, synchronization, and motor control centres.",
          "url": `${siteUrl}/inventory/panels`,
        },
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Engineering Support & Maintenance",
          "description": "On-site technical support, preventive maintenance, AMC contracts, and breakdown recovery.",
          "url": `${siteUrl}/request`,
        },
      },
    ],
  },
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <ServicesContent />
    </>
  );
}
