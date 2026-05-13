"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { NavbarWithCart } from "@/components/NavbarWithCart";
import ProductGrid from "@/components/ProductGrid";
import { InventoryBreadcrumb } from "@/components/InventoryBreadcrumb";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/store";

interface PerkinsClientProps {
  allProductsFromDb: Product[];
}

export default function PerkinsClient({ allProductsFromDb }: PerkinsClientProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  /**
   * STRONG FILTER LOGIC
   * Uses Regex Negative Lookbehind (?<!\d) to ensure that if we search for "10kva",
   * it does NOT match "110kva". It ensures no digit exists immediately before the number.
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
        subtitle: "10kVA - 30kVA",
        data: getStrongRange(["10kva", "14kva", "16kva", "20kva", "30kva"]),
        showBack: true,
      },
      {
        id: "commercial",
        title: "Commercial Range",
        subtitle: "50kVA - 80kVA",
        data: getStrongRange(["50kva", "60kva", "80kva"]),
      },
      {
        id: "industrial",
        title: "Industrial Range",
        subtitle: "110kVA - 220kVA",
        data: getStrongRange(["110kva", "150kva", "165kva", "220kva"]),
      },
      {
        id: "high-capacity",
        title: "High Capacity",
        subtitle: "250kVA - 385kVA",
        data: getStrongRange(["250kva", "330kva", "385kva"]),
      },
      {
        id: "prime-power",
        title: "Prime Power Range",
        subtitle: "400kVA - 660kVA",
        data: getStrongRange(["400kva", "500kva", "550kva", "660kva"]),
      },
      {
        id: "heavy-duty",
        title: "Heavy Duty Range",
        subtitle: "820kVA - 1375kVA",
        data: getStrongRange(["820kva", "1100kva", "1250kva", "1375kva"]),
      },
    ].filter((section) => section.data.length > 0);
  }, [allProductsFromDb]);

  const handleCart = useCallback(
    (p: any) => addToCart({ ...p, productId: p.id }),
    [addToCart]
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-amber-500/30">
      <NavbarWithCart />

      <main className="max-w-[1600px] mx-auto pt-28 md:pt-24 pb-0">
        <InventoryBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Inventory", href: "/inventory" },
            { label: "Generators", href: "/inventory/generators" },
            { label: "Perkins" },
          ]}
        />
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white px-4 md:px-8 pt-8 mb-4">
          Perkins Generators in Pakistan
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

        {/* PERKINS BRAND FOOTER WITH LOGO BACKGROUND */}
        <footer className="relative mt-10 py-24 border-t border-white/5 bg-neutral-950 overflow-hidden">
          {/* Blue Logo Watermark Background */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url('/images/brands/perkins.png')`,
              backgroundPosition: 'center',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              filter: 'brightness(0) saturate(100%) invert(21%) sepia(91%) saturate(2363%) hue-rotate(193deg) brightness(93%) contrast(101%)' 
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center px-4">
            <h3 className="text-blue-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-4">
              Perkins UK Technology
            </h3>
            <p className="text-3xl md:text-5xl font-light tracking-tighter mb-8 max-w-2xl text-balance">
              The Gold Standard for Power in Pakistan.
            </p>
            <button 
              onClick={() => router.push('/request')}
              className="group relative px-10 py-5 bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#00549c] hover:text-white"
            >
              Request Free Quote
            </button>
            <p className="mt-8 text-neutral-600 text-[9px] uppercase tracking-widest">
              Professional Installation • 24/7 After-Sales Support • Genuine Parts
            </p>

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
          color: #f59e0b !important;
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