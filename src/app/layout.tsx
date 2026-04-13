// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { CartDrawerContainer } from "@/components/CartDrawerContainer";
import { Providers } from "@/components/Providers";
import CartHydration from "@/components/CartHydration";

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error("NEXT_PUBLIC_SITE_URL is not set in environment variables");
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Advanced Power Solutions | Industrial Energy Systems",
    template: "%s | APS Power Systems",
  },
  description: "Advanced Power Solutions (APS) delivers industrial-grade generators engineered for 24/7 reliability.",
  openGraph: {
    title: "Advanced Power Solutions | Industrial Energy Systems",
    description: "Advanced Power Solutions (APS) delivers industrial-grade generators engineered for 24/7 reliability.",
    url: siteUrl,
    siteName: "Advanced Power Solutions",
    locale: "en_PK",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Advanced Power Solutions | Industrial Energy Systems",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-white antialiased">
        <Providers>
          <CartHydration />
          {children}
          <CartDrawerContainer />
        </Providers>
      </body>
    </html>
  );
}