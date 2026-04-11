"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { NavbarWithCart } from "@/components/NavbarWithCart";
import ProductGrid from "@/components/ProductGrid";
import { Product } from "@/types/store";
import { useCart } from "@/hooks/useCart";
import { MoveLeft } from "lucide-react";

interface SolarClientProps {
  allProductsFromDb: Product[];
}

export default function SolarClient({ allProductsFromDb = [] }: SolarClientProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleCart = (p: Product) => addToCart({ ...p, productId: p.id });

  /**
   * DYNAMIC FILTERING
   * Matches the brands defined in your solarSeries data.
   */
  const { longiProducts, jinkoProducts, canadianProducts } = useMemo(() => {
    const longi: Product[] = [];
    const jinko: Product[] = [];
    const canadian: Product[] = [];

    allProductsFromDb.forEach((p) => {
      // Safely extract brand string (handles 'LONGI', 'Jinko', 'Canadian Solar')
      const brandStr = (typeof p.brand === "string" ? p.brand : "").toLowerCase();

      if (brandStr.includes("longi")) {
        longi.push(p);
      } else if (brandStr.includes("jinko")) {
        jinko.push(p);
      } else if (brandStr.includes("canadian")) {
        canadian.push(p);
      }
    });

    return { longiProducts: longi, jinkoProducts: jinko, canadianProducts: canadian };
  }, [allProductsFromDb]);

  /* ---------------- BRAND TITLE COMPONENT ---------------- */
  const BrandTitle = ({ src, alt, back = false }: { src: string; alt: string; back?: boolean }) => (
    <div className="flex items-center gap-6">
      {back && (
        <button
          onClick={() => router.back()}
          className="group flex items-center justify-center pr-6 border-r border-white/10 text-neutral-500 hover:text-white transition-colors"
        >
          <MoveLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      )}
      <div className="relative h-10 w-40 md:h-12 md:w-52">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain object-left"
          priority={back}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600/30">
      <NavbarWithCart />

      <main className="max-w-[1600px] mx-auto pt-24 pb-10 space-y-0">
        
        {/* LONGI SECTION */}
        {longiProducts.length > 0 ? (
          <ProductGrid
            products={longiProducts}
            title={<BrandTitle src="/images/brands/longi.svg" alt="Longi Solar" back />}
            subtitle="High-Efficiency Monocrystalline"
            onAddToCart={handleCart}
            showFooter={false}
            paddingY="py-10"
          />
        ) : (
          <div className="py-20 text-center text-neutral-800 uppercase tracking-widest text-[10px]">
            Searching Database for LONGI Solar Panels...
          </div>
        )}

        {/* JINKO SECTION */}
        {jinkoProducts.length > 0 ? (
          <ProductGrid
            products={jinkoProducts}
            title={<BrandTitle src="/images/brands/jinko.svg" alt="Jinko Solar" />}
            subtitle="Tiger Neo N-Type Series"
            onAddToCart={handleCart}
            showFooter={false}
            paddingY="py-10"
          />
        ) : (
          <div className="py-20 text-center text-neutral-800 uppercase tracking-widest text-[10px]">
            Searching Database for Jinko Solar Panels...
          </div>
        )}

        {/* CANADIAN SOLAR SECTION */}
        {canadianProducts.length > 0 ? (
          <ProductGrid
            products={canadianProducts}
            title={<BrandTitle src="/images/brands/canadian.png" alt="Canadian Solar" />}
            subtitle="Enterprise Solar Solutions"
            onAddToCart={handleCart}
            showFooter={false}
            paddingY="py-10"
          />
        ) : (
          <div className="py-20 text-center text-neutral-800 uppercase tracking-widest text-[10px]">
            Searching Database for Canadian Solar Panels...
          </div>
        )}

        {/* FOOTER */}
        <footer className="mt-10 py-20 border-t border-white/5 bg-neutral-950/30">
          <div className="flex flex-col items-center text-center px-4">
            <h3 className="text-red-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-4">Procurement</h3>
            <p className="text-3xl md:text-5xl font-light tracking-tighter mb-8 max-w-2xl text-balance">
              Industrial Solar Architecture
            </p>
            <button
              onClick={() => router.push("/request")}
              className="group relative px-10 py-5 bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-red-600 hover:text-white"
            >
              Request Free Quote
            </button>
            <p className="mt-8 text-neutral-600 text-[9px] uppercase tracking-widest">
              Tier-1 Hardware • Global Compliance
            </p>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        html { scroll-behavior: smooth; }
        .product-grid-container {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          margin-bottom: 0 !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .product-grid-container .subtitle {
          font-size: 10px !important;
          font-family: ui-monospace, monospace !important;
          letter-spacing: 0.25em !important;
          color: #737373 !important;
          text-transform: uppercase !important;
          margin-left: 24px !important;
          font-weight: 700 !important;
        }
      `}</style>
    </div>
  );
}