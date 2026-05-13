import type { Metadata } from "next";
import CompanyContent from "./CompanyContent";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
const url = `${siteUrl}/company`;
const description =
  "Advanced Power Solutions: 15+ years supplying Cummins & Perkins generators, solar, UPS, and air compressors to factories and hospitals across Pakistan.";

export const metadata: Metadata = {
  title: "Company",
  description,
  alternates: { canonical: url },
  openGraph: {
    title: "Company | APS Power Systems",
    description,
    url,
    siteName: "Advanced Power Solutions",
    locale: "en_PK",
    type: "website",
  },
};

export default function CompanyPage() {
  return <CompanyContent />;
}
