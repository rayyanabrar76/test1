import type { Metadata } from "next";
import RequestContent from "./RequestContent";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
const url = `${siteUrl}/request`;
const description =
  "Request a quote for industrial generators, solar systems, UPS, or air compressors. Lahore-based, serving Pakistan nationwide. Response within 24 hours.";

export const metadata: Metadata = {
  title: "Request a Quote",
  description,
  alternates: { canonical: url },
  openGraph: {
    title: "Request a Quote | APS Power Systems",
    description,
    url,
    siteName: "Advanced Power Solutions",
    locale: "en_PK",
    type: "website",
  },
};

export default function RequestPage() {
  return <RequestContent />;
}
