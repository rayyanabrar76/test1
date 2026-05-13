"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { NavbarWithCart } from "@/components/NavbarWithCart";
import ProductGrid from "@/components/ProductGrid";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/store";

interface PanelClientProps {
  allProductsFromDb: Product[];
}

export default function ElectricGearClient({ allProductsFromDb }: PanelClientProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleCart = (p: any) => addToCart({ ...p, productId: p.id });

  const bySubcategory = (...keywords: string[]) =>
    allProductsFromDb.filter((p) => {
      const cat = typeof p.category === "string" ? p.category.toLowerCase() : "";
      const sub = typeof p.metadata?.subcategory === "string" ? p.metadata.subcategory.toLowerCase() : "";
      const series = typeof p.metadata?.series === "string" ? p.metadata.series.toLowerCase() : "";
      return keywords.some((kw) => cat.includes(kw) || sub.includes(kw) || series.includes(kw));
    });

  const coreSwitchgear       = bySubcategory("core switchgear");
  const automationControl    = bySubcategory("automation & control");
  const infrastructureWiring = bySubcategory("infrastructure & wiring");

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <NavbarWithCart />
      
      <main className="max-w-[1600px] mx-auto pt-32 md:pt-24 pb-20 space-y-0">

        {/* POWER SECTION - ID: #power */}
        <section id="power" className="scroll-mt-32">
          <ProductGrid
            products={coreSwitchgear}
            title="Power"
            subtitle="DISTRIBUTION"
            showBackButton={true}
            showFooter={false}
            onAddToCart={handleCart}
            paddingY="py-4 md:py-8"
            titleAs="h1"
          />
        </section>

        {/* CONTROL SECTION - ID: #control */}
        <section id="control" className="scroll-mt-32">
          <ProductGrid 
            products={automationControl} 
            title="Control" 
            subtitle="SYSTEMS"
            showFooter={false}
            onAddToCart={handleCart}
            paddingY="py-4 md:py-8"
          />
        </section>

        {/* INFRASTRUCTURE SECTION - ID: #infrastructure */}
        <section id="infrastructure" className="scroll-mt-32">
          <ProductGrid 
            products={infrastructureWiring} 
            title="Infrastructure" 
            subtitle="& WIRING"
            showFooter={false}
            onAddToCart={handleCart}
            paddingY="py-4 md:py-8"
          />
        </section>

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
          width: 100% !important;
          overflow: hidden !important;
        }

        .product-grid-header {
          padding-left: 1rem !important;
          padding-right: 1rem !important;
          display: flex !important;
          align-items: center !important;
          flex-wrap: nowrap !important;
          width: 100% !important;
        }

        .product-grid-header h2,
        .product-grid-title {
          font-size: 11px !important;
          letter-spacing: 0.1em !important;
          color: #10b981 !important;
          margin-bottom: 0 !important;
          white-space: nowrap !important;
          display: flex !important;
          align-items: center !important;
        }

        .product-grid-container .subtitle,
        .product-grid-container span.text-neutral-700,
        .product-grid-header span {
          font-size: 9px !important;
          letter-spacing: 0.1em !important;
          color: #525252 !important;
          margin-left: 8px !important;
          font-weight: 700 !important;
          white-space: nowrap !important;
        }

        @media (min-width: 768px) {
          .product-grid-header h2,
          .product-grid-title {
            font-size: 10px !important;
            letter-spacing: 0.3em !important;
            margin-bottom: 1.5rem !important;
          }
          .product-grid-container .subtitle,
          .product-grid-header span {
            font-size: 10px !important;
            letter-spacing: 0.25em !important;
            margin-left: 20px !important;
          }
        }

        .product-grid-container img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
}