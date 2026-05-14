"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { NavbarWithCart } from "@/components/NavbarWithCart";
import ProductGrid from "@/components/ProductGrid";
import { InventoryBreadcrumb } from "@/components/InventoryBreadcrumb";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/store";

interface CumminsClientProps {
  allProductsFromDb: Product[];
}

export default function CumminsClient({ allProductsFromDb }: CumminsClientProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  /**
   * STRONG FILTER LOGIC
   * Uses Regex Negative Lookbehind (?<!\d) to ensure that if we search for "22kva",
   * it does NOT match "220kva". It ensures no digit exists immediately before the number.
   */
  const sections = useMemo(() => {
    const getStrongRange = (kvas: string[]) => {
      return allProductsFromDb.filter((p) => {
        return kvas.some((kva) => {
          const numericValue = kva.replace("kva", "");
          const regex = new RegExp(`(?<!\\d)${numericValue}kva`, "i");
          return regex.test(p.id);
        });
      });
    };

    return [
      {
        id: "residential",
        title: "Residential Range",
        subtitle: "20kVA - 60kVA",
        data: getStrongRange(["22kva", "27kva", "33kva", "45kva", "60kva"]),
        showBack: true,
      },
      {
        id: "industrial",
        title: "Industrial Range",
        subtitle: "100kVA - 220kVA",
        data: getStrongRange(["100kva", "150kva", "220kva"]),
      },
      {
        id: "high-capacity",
        title: "High Capacity",
        subtitle: "275kVA - 550kVA",
        data: getStrongRange(["275kva", "350kva", "550kva"]),
      },
    ].filter((section) => section.data.length > 0);
  }, [allProductsFromDb]);

  const handleCart = useCallback(
    (p: any) => addToCart({ ...p, productId: p.id }),
    [addToCart]
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-red-600/30">
      <NavbarWithCart />

      <main className="max-w-[1600px] mx-auto pt-32 md:pt-24 pb-0">
        <InventoryBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Inventory", href: "/inventory" },
            { label: "Generators", href: "/inventory/generators" },
            { label: "Cummins" },
          ]}
        />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white px-4 md:px-8 pt-6 mb-2 leading-tight">
          Cummins Generators in Pakistan
        </h1>
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-32">
            <ProductGrid
              products={section.data}
              title={section.title}
              subtitle={section.subtitle}
              showBackButton={section.showBack || false}
              showFooter={false}
              onAddToCart={handleCart}
              paddingY="py-4 md:py-8"
            />
          </section>
        ))}

        {/* CUMMINS BRAND FOOTER WITH LOGO BACKGROUND */}
        <footer className="relative mt-10 py-24 border-t border-white/5 bg-neutral-950 overflow-hidden">
          {/* Red Logo Watermark Background (Cummins Official Red) */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url('/images/brands/cummins.png')`,
              backgroundPosition: 'center',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              filter: 'brightness(0) saturate(100%) invert(27%) sepia(85%) saturate(3145%) hue-rotate(346deg) brightness(91%) contrast(98%)' 
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center px-4">
            <h3 className="text-red-600 text-[10px] font-bold tracking-[0.4em] uppercase mb-4">
              Cummins Power Generation
            </h3>
            <p className="text-3xl md:text-5xl font-light tracking-tighter mb-8 max-w-2xl text-balance">
              The Heart of Reliability for Every Industry.
            </p>
            <button 
              onClick={() => router.push('/request')}
              className="group relative px-10 py-5 bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#da291c] hover:text-white"
            >
              Request Free Quote
            </button>
            <p className="mt-8 text-neutral-600 text-[9px] uppercase tracking-widest">
              G-Drive Engines • PowerCommand® Systems • Worldwide Warranty
            </p>

            {/* COPYRIGHT SECTION */}
            <div className="mt-12 pt-8 border-t border-white/5 w-full max-w-sm">
              <p className="text-neutral-700 text-[8px] uppercase tracking-[0.3em]">
                © {new Date().getFullYear()} Advanced Power Solution. All Rights Reserved.
              </p>
            </div>
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
          color: #dc2626 !important;
          margin-bottom: 0 !important;
          white-space: nowrap !important;
          display: flex !important;
          align-items: center !important;
        }

        .product-grid-container .subtitle,
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
      `}</style>
    </div>
  );
}