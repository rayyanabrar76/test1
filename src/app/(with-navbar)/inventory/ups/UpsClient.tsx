"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { NavbarWithCart } from "@/components/NavbarWithCart";
import ProductGrid from "@/components/ProductGrid";
import { Product } from "@/types/store";
import { useCart } from "@/hooks/useCart";
import { MoveLeft } from "lucide-react";

interface UpsClientProps {
  allProductsFromDb: Product[];
}

export default function UpsClient({ allProductsFromDb }: UpsClientProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleCart = (p: Product) => addToCart({ ...p, productId: p.id });

  /**
   * SAFE DATABASE FILTERING
   * We use Type Guards (typeof === 'string') to satisfy TypeScript
   * and prevent .toLowerCase() from crashing on non-string types.
   */
  const apcProducts = allProductsFromDb.filter(p => {
    // Safely extract brand string
    const brandValue = p.brand;
    const brandStr = typeof brandValue === 'string' ? brandValue.toLowerCase() : "";

    // Safely extract series string from metadata
    const seriesValue = p.metadata?.series;
    const seriesStr = typeof seriesValue === 'string' ? seriesValue.toLowerCase() : "";
    
    return (
      brandStr.includes("apc") || 
      seriesStr.includes("surt") || 
      seriesStr.includes("3c3ex") ||
      seriesStr.includes("smart-ups")
    );
  });

  const eatonProducts = allProductsFromDb.filter(p => {
    // Safely extract brand string
    const brandValue = p.brand;
    const brandStr = typeof brandValue === 'string' ? brandValue.toLowerCase() : "";

    // Safely extract series string from metadata
    const seriesValue = p.metadata?.series;
    const seriesStr = typeof seriesValue === 'string' ? seriesValue.toLowerCase() : "";
    
    return (
      brandStr.includes("eaton") || 
      seriesStr.includes("9355") || 
      seriesStr.includes("9390") || 
      seriesStr.includes("9395")
    );
  });

  /* ---------------- BRAND TITLE COMPONENT ---------------- */
  const BrandTitle = ({
    src,
    alt,
    back = false,
    wClass = "w-40 md:w-52",
    hClass = "h-16 md:h-24",
  }: {
    src: string;
    alt: string;
    back?: boolean;
    wClass?: string;
    hClass?: string;
  }) => (
    <div className="flex items-center gap-6">
      {back && (
        <button
          onClick={() => router.back()}
          className="group flex items-center justify-center pr-6 border-r border-white/10 text-neutral-500 hover:text-red-600 transition-colors"
        >
          <MoveLeft
            size={22}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </button>
      )}

      <div className={`relative ${hClass} ${wClass}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={back}
          className="object-contain object-left"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600/30">
      <NavbarWithCart />
      
      <main className="w-screen pt-24 pb-10 space-y-0">
        
        {/* APC SECTION */}
        {apcProducts.length > 0 ? (
          <ProductGrid 
            products={apcProducts} 
            title={
              <BrandTitle 
                src="/images/brands/apc1.png" 
                alt="APC" 
                back 
                wClass="w-56 md:w-72" 
                hClass="h-20 md:h-28"
              />
            } 
            subtitle="Industrial Power Protection"
            onAddToCart={handleCart}
            showFooter={false}
            paddingY="py-10"
          />
        ) : (
          <div className="py-20 text-center text-neutral-900 uppercase tracking-widest text-[10px]">
            Searching Database for APC Power Systems...
          </div>
        )}

        {/* EATON SECTION */}
        {eatonProducts.length > 0 ? (
          <ProductGrid 
            products={eatonProducts} 
            title={
              <BrandTitle 
                src="/images/brands/eaton.svg" 
                alt="Eaton" 
                wClass="w-64 md:w-80"
                hClass="h-24 md:h-32"
              />
            } 
            subtitle="Enterprise UPS Solutions"
            onAddToCart={handleCart}
            showFooter={false}
            paddingY="py-10"
          />
        ) : (
          <div className="py-20 text-center text-neutral-900 uppercase tracking-widest text-[10px]">
            Searching Database for Eaton Enterprise Systems...
          </div>
        )}
      </main>

      {/* FOOTER SECTION */}
      <footer className="mt-10 py-20 border-t border-white/5 bg-neutral-950/30">
        <div className="flex flex-col items-center text-center px-4">
          <h3 className="text-red-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-4">
            Procurement
          </h3>
          <p className="text-3xl md:text-5xl font-light tracking-tighter mb-8 max-w-2xl text-balance">
            Industrial Power Architecture
          </p>
          <button 
            onClick={() => router.push('/request')}
            className="group relative px-10 py-5 bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-red-600 hover:text-white"
          >
            Request Free Quote
          </button>
          <p className="mt-8 text-neutral-600 text-[9px] uppercase tracking-widest">
            Professional Grade Hardware • Global Compliance
          </p>
        </div>
      </footer>       

      {/* STYLES */}
      <style jsx global>{`
        .product-grid-container {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          margin-bottom: 0 !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .product-grid-container .subtitle,
        .product-grid-container span.text-neutral-700 {
          font-size: 10px !important;
          font-family: ui-monospace, SFMono-Regular, monospace !important;
          letter-spacing: 0.25em !important;
          color: #525252 !important;
          text-transform: uppercase !important;
          margin-left: 24px !important;
          font-weight: 700 !important;
        }

        .product-grid-header h2 {
          display: flex !important;
          align-items: center !important;
          margin-bottom: 2rem !important;
        }
      `}</style>
    </div>
  );
}