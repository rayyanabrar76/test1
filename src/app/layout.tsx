// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { CartDrawerContainer } from "@/components/CartDrawerContainer";
import { Providers } from "@/components/Providers";
import CartHydration from "@/components/CartHydration";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from "next/script";

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
  description: "Authorized supplier of Cummins & Perkins generators, industrial solar systems, UPS, and air compressors across Pakistan. Get a quote in 24 hours. Serving Lahore, Karachi, Islamabad.",
  openGraph: {
    title: "Advanced Power Solutions | Industrial Energy Systems",
    description: "Authorized supplier of Cummins & Perkins generators, industrial solar systems, UPS, and air compressors across Pakistan. Get a quote in 24 hours. Serving Lahore, Karachi, Islamabad.",
    url: siteUrl,
    siteName: "Advanced Power Solutions",
    locale: "en_PK",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Advanced Power Solutions | Industrial Energy Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Advanced Power Solutions | Industrial Energy Systems",
    description: "Authorized supplier of Cummins & Perkins generators, industrial solar systems, UPS, and air compressors across Pakistan.",
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Advanced Power Solutions",
    "alternateName": "APS Power Systems",
    "url": siteUrl,
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Advanced Power Solutions",
    "alternateName": "APS",
    "url": siteUrl,
    "logo": `${siteUrl}/aps-logo.png`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "334, 3rd Floor Land Mark Plaza, Jail Road",
      "addressLocality": "Lahore",
      "addressCountry": "PK",
    },
    "areaServed": "PK",
    "sameAs": [
      "https://www.facebook.com/aps8308/",
      "https://www.instagram.com/apspowerpk/",
      "https://www.linkedin.com/company/apspower/",
    ],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="bg-[#050505] text-white antialiased">
        <Providers>
          <CartHydration />
          {children}
          <CartDrawerContainer />
        </Providers>
        <GoogleAnalytics gaId="G-PE9F73EHVK" />
      </body>
    </html>
  );
}
