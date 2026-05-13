"use client";

import { useRouter } from "next/navigation";
import { NavbarWithCart } from "@/components/NavbarWithCart";
import ProductGrid from "@/components/ProductGrid";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/store";

// Exported so [category]/page.tsx can import it without a cast
export interface InventoryClientProps {
  allProductsFromDb: Product[];
  // When set (e.g. "GENERATORS"), only that section renders.
  // Used by /inventory/[category] page. Omit on the main /inventory page.
  initialCategory?: string | null;
}

export default function InventoryClient({
  allProductsFromDb,
  initialCategory,
}: InventoryClientProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  // Typed: no `any` leak
  const handleCart = (p: Product) =>
    addToCart({ ...p, productId: p.id });

  const byCategory = (...keywords: string[]) =>
    allProductsFromDb.filter((p) => {
      const cat =
        typeof p.category === "string" ? p.category.toLowerCase() : "";
      const brand =
        typeof p.brand === "string" ? p.brand.toLowerCase() : "";
      return keywords.some((kw) => cat.includes(kw) || brand.includes(kw));
    });

  const perkinsSeries       = byCategory("perkins");
  const cumminsSeries       = byCategory("cummins");
  const yangdongSeries      = byCategory("yangdong");
  const upsSeries           = byCategory("ups");
  const solarSeries         = byCategory("solar");
  const aircompressorSeries = byCategory("air compressor", "aircompressor", "compressor");
  const electricgearSeries  = byCategory("panel", "electric gear", "electricgear");

  // When initialCategory is set, only show the matching section.
  // This makes the component reusable for both /inventory and /inventory/[category].
  const cat = initialCategory?.toUpperCase() ?? null;
  const show = (sectionKey: string) => cat === null || cat === sectionKey;

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-emerald-500/30">
      <NavbarWithCart />

      <main className="max-w-[1600px] mx-auto pt-24 md:pt-24 pb-10 md:pb-20 space-y-4 md:space-y-8">
        <h1 className="sr-only">Industrial Power Equipment in Pakistan</h1>

        {/* 01. GENERATORS */}
        {show("GENERATORS") && (
          <section id="generators" className="scroll-mt-32">
            <ProductGrid
              products={[...perkinsSeries, ...cumminsSeries, ...yangdongSeries]}
              title="Generators"
              subtitle="gas & diesel"
              showBackButton={cat !== null} // show back button on category pages only
              footerTitle="View All Series"
              viewAllLink="/inventory/generators"
              onAddToCart={handleCart}
              paddingY="py-2 md:py-4"
            />
          </section>
        )}

        {/* 02. SOLAR */}
        {show("SOLAR") && (
          <section id="solar" className="scroll-mt-32">
            <ProductGrid
              products={solarSeries}
              title="Solar"
              subtitle="systems"
              showBackButton={cat !== null}
              footerTitle="View All Series"
              viewAllLink="/inventory/solar"
              onAddToCart={handleCart}
              paddingY="py-2 md:py-4"
            />
          </section>
        )}

        {/* 03. UPS */}
        {show("UPS") && (
          <section id="ups" className="scroll-mt-32">
            <ProductGrid
              products={upsSeries}
              title="UPS"
              subtitle="Systems"
              showBackButton={cat !== null}
              footerTitle="View All Series"
              viewAllLink="/inventory/ups"
              onAddToCart={handleCart}
              paddingY="py-2 md:py-4"
            />
          </section>
        )}

        {/* 04. AIR COMPRESSOR */}
        {show("AIRCOMPRESSOR") && (
          <section id="air" className="scroll-mt-32">
            <ProductGrid
              products={aircompressorSeries}
              title="Air"
              subtitle="compressors"
              showBackButton={cat !== null}
              footerTitle="View All Series"
              viewAllLink="/inventory/aircompressor"
              onAddToCart={handleCart}
              paddingY="py-2 md:py-4"
            />
          </section>
        )}

        {/* 05. PANELS */}
        {show("PANELS") && (
          <section id="panels" className="scroll-mt-32">
            <ProductGrid
              products={electricgearSeries}
              title="Electric Panels"
              subtitle="& Gear"
              showBackButton={cat !== null}
              footerTitle="View All Series"
              viewAllLink="/inventory/panels"
              onAddToCart={handleCart}
              paddingY="py-2 md:py-4"
            />
          </section>
        )}

        {/* QUOTE FOOTER — hidden on category-specific pages to keep focus */}
        {cat === null && (
          <footer className="mt-10 py-20 border-t border-white/5 bg-neutral-950/30">
            <div className="flex flex-col items-center text-center px-4">
              <h3 className="text-red-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-4">
                Procurement
              </h3>
              <p className="text-3xl md:text-5xl font-light tracking-tighter mb-8 max-w-2xl text-balance">
                Have a Question?
              </p>
              <button
                onClick={() => router.push("/request")}
                className="group relative px-10 py-5 bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-red-500 hover:text-white"
              >
                Request Free Quote
              </button>
              <p className="mt-8 text-neutral-600 text-[9px] uppercase tracking-widest">
                Professional Grade Hardware • Global Compliance
              </p>
            </div>
          </footer>
        )}

      </main>

      <style jsx global>{`
        html { scroll-behavior: smooth; }

        .product-grid-container {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          margin-top: 0 !important;
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
          letter-spacing: 0.15em !important;
          margin-bottom: 0 !important;
          white-space: nowrap !important;
          display: flex !important;
          align-items: center !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
        }

        .mt-12.md\:mt-32 { margin-top: 2rem !important; }

        .inventory-link-header {
          color: #ffffff !important;
          text-decoration: none !important;
          transition: color 0.3s ease-in-out !important;
          display: flex !important;
          align-items: center !important;
        }

        .state-crimson:hover { color: #b91c1c !important; }
        .state-yellow:hover  { color: #eab308 !important; }
        .state-blue:hover    { color: #0284c7 !important; }
        .state-orange:hover  { color: #ea580c !important; }
        .state-purple:hover  { color: #9333ea !important; }

        .link-arrow {
          opacity: 1;
          transform: translateX(0);
          transition: all 0.2s ease-in-out;
          margin-left: 8px;
          display: inline-block;
          font-family: sans-serif;
        }

        .inventory-link-header:hover .link-arrow { transform: translateX(4px); }

        .product-grid-container .subtitle,
        .product-grid-container span.text-neutral-700,
        .product-grid-header span:not(.link-arrow) {
          font-size: 9px !important;
          letter-spacing: 0.1em !important;
          color: #404040 !important;
          margin-left: 12px !important;
          font-weight: 700 !important;
          white-space: nowrap !important;
          text-transform: uppercase !important;
        }

        @media (min-width: 768px) {
          .product-grid-header h2,
          .product-grid-title {
            font-size: 10px !important;
            letter-spacing: 0.2em !important;
          }
        }
      `}</style>
    </div>
  );
}