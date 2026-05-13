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

export default function ServicesPage() {
  return <ServicesContent />;
}
