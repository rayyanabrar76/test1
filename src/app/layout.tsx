// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { CartDrawerContainer } from "@/components/CartDrawerContainer";
import { Providers } from "@/components/Providers";
import CartHydration from "@/components/CartHydration";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aps.com.pk";

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
  // ✅ No images needed here anymore
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