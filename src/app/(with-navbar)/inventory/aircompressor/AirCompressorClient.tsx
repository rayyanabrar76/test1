"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { NavbarWithCart } from "@/components/NavbarWithCart";
import ProductGrid from "@/components/ProductGrid";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/store";
import { MoveLeft } from "lucide-react";

interface AirCompressorClientProps {
  allProductsFromDb: Product[];
}

export default function AirCompressorClient({ allProductsFromDb }: AirCompressorClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleCart = (p: any) => addToCart({ ...p, productId: p.id });

  /* ---------------- BRAND TITLE HELPER ---------------- */
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

  /* ---------------- DATA GROUPING ---------------- */
  const byBrand = (brandName: string) =>
    allProductsFromDb.filter((p) => {
      const brand = typeof p.brand === "string" ? p.brand.toLowerCase() : "";
      return brand === brandName.toLowerCase();
    });

  const dariProducts  = byBrand("DARI");
  const pumaProducts  = byBrand("Puma");
  const dukasProducts = byBrand("DUKAS");

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600/30">
      <NavbarWithCart />

      <main className="w-screen pt-24 pb-20 space-y-0">
        
        {/* DARI SERIES - ID: #dari */}
        {dariProducts.length > 0 && (
          <section id="dari" className="scroll-mt-32">
            <ProductGrid
              products={dariProducts}
              title={
                <BrandTitle
                  src="/images/brands/dari.svg"
                  alt="Dari"
                  back
                  wClass="w-48 md:w-80"
                  hClass="h-24 md:h-32"
                />
              }
              subtitle=""
              onAddToCart={handleCart}
              showFooter={false}
              paddingY="py-10"
            />
          </section>
        )}

        {/* PUMA SERIES - ID: #puma */}
        {pumaProducts.length > 0 && (
          <section id="puma" className="scroll-mt-32">
            <ProductGrid
              products={pumaProducts}
              title={
                <BrandTitle
                  src="/images/brands/puma.svg"
                  alt="Puma"
                  wClass="w-72 md:w-[450px]"
                  hClass="h-24 md:h-32"
                />
              }
              subtitle=""
              onAddToCart={handleCart}
              showFooter={false}
              paddingY="py-10"
            />
          </section>
        )}

        {/* DUKAS SERIES - ID: #dukas */}
        {dukasProducts.length > 0 && (
          <section id="dukas" className="scroll-mt-32">
            <ProductGrid
              products={dukasProducts}
              title={
                <BrandTitle
                  src="/images/brands/dukas.svg"
                  alt="Dukas"
                  wClass="w-72 md:w-[450px]"
                  hClass="h-24 md:h-32"
                />
              }
              subtitle=""
              onAddToCart={handleCart}
              showFooter={false}
              paddingY="py-10"
            />
          </section>
        )}

        {/* QUOTE FOOTER SECTION */}
        <footer className="mt-10 py-20 border-t border-white/5 bg-neutral-950/30">
          <div className="flex flex-col items-center text-center px-4">
            <h3 className="text-red-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-4">
              Procurement
            </h3>
            <p className="text-3xl md:text-5xl font-light tracking-tighter mb-8 max-w-2xl text-balance">
              Have a Question?
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
      </main>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

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
          margin-bottom: 2.5rem !important;
        }

        .product-grid-container img {
          filter: contrast(1.1) brightness(0.9);
        }
      `}</style>
    </div>
  );
}