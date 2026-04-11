"use client";

import { useRouter } from "next/navigation";
import { NavbarWithCart } from "@/components/NavbarWithCart";
import ProductGrid from "@/components/ProductGrid";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/store";

interface InventoryClientProps {
  allProductsFromDb: Product[];
}

export default function InventoryClient({ allProductsFromDb }: InventoryClientProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleCart = (p: any) => addToCart({ ...p, productId: p.id });

  const byCategory = (...keywords: string[]) =>
    allProductsFromDb.filter((p) => {
      const cat = typeof p.category === "string" ? p.category.toLowerCase() : "";
      const brand = typeof p.brand === "string" ? p.brand.toLowerCase() : "";
      return keywords.some((kw) => cat.includes(kw) || brand.includes(kw));
    });

  const perkinsSeries     = byCategory("perkins");
  const cumminsSeries     = byCategory("cummins");
  const yangdongSeries    = byCategory("yangdong");
  const upsSeries         = byCategory("ups");
  const solarSeries       = byCategory("solar");
  const aircompressorSeries = byCategory("air compressor", "aircompressor", "compressor");
  const electricgearSeries  = byCategory("panel", "electric gear", "electricgear");

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-emerald-500/30">
      <NavbarWithCart />
      
     <main className="max-w-[1600px] mx-auto pt-24 md:pt-24 pb-10 md:pb-20 space-y-4 md:space-y-8">
        
        {/* 01. GENERATORS SECTION */}
        <section id="generators" className="scroll-mt-32">
          <ProductGrid 
            products={[...perkinsSeries, ...cumminsSeries, ...yangdongSeries]} 
           title="Generators"
            subtitle="gas & diesel"
            showBackButton={true} 
            footerTitle="View All Series"
            viewAllLink="/inventory/generators"
            onAddToCart={handleCart}
            paddingY="py-2 md:py-4"
          />
        </section>

        {/* 02. SOLAR SECTION */}
        <section id="solar" className="scroll-mt-32">
          <ProductGrid 
            products={solarSeries} 
            title="Solar"
            subtitle="systems"
            footerTitle="View All Series"
            viewAllLink="/inventory/solar"
            onAddToCart={handleCart}
            paddingY="py-2 md:py-4"
          />
        </section>

        {/* 03. UPS SECTION */}
        <section id="ups" className="scroll-mt-32">
          <ProductGrid 
            products={upsSeries} 
            title="UPS"
            subtitle="Systems"
            footerTitle="View All Series"
            viewAllLink="/inventory/ups"
            onAddToCart={handleCart}
            paddingY="py-2 md:py-4"
          />
        </section>

        {/* 04. AIR COMPRESSOR SECTION */}
        <section id="air" className="scroll-mt-32">
          <ProductGrid 
            products={aircompressorSeries} 
             title="Air"
            subtitle="compressors"
            footerTitle="View All Series"
            viewAllLink="/inventory/aircompressor"
            onAddToCart={handleCart}
            paddingY="py-2 md:py-4"
          />
        </section>

        {/* 05. PANELS SECTION */}
        <section id="panels" className="scroll-mt-32">
          <ProductGrid 
            products={electricgearSeries} 
            title="Electric Panels"
            subtitle="& Gear"
            footerTitle="View All Series"
            viewAllLink="/inventory/panels"
            onAddToCart={handleCart}
            paddingY="py-2 md:py-4"
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
              className="group relative px-10 py-5 bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-red-500 hover:text-white"
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
          /* BRING VIEW ALL CLOSER: Overriding the mt-12 md:mt-32 in ProductGrid */
        .mt-12.md\:mt-32 {
          margin-top: 2rem !important; /* Mobile gap */
        }

        /* --- INITIAL STATE: ALWAYS WHITE --- */
        .inventory-link-header {
          color: #ffffff !important;
          text-decoration: none !important;
          transition: color 0.3s ease-in-out !important;
          display: flex !important;
          align-items: center !important;
        }

        /* --- HOVER COLORS --- */
        .state-crimson:hover { color: #b91c1c !important; }
        .state-yellow:hover  { color: #eab308 !important; }
        .state-blue:hover    { color: #0284c7 !important; }
        .state-orange:hover  { color: #ea580c !important; }
        .state-purple:hover  { color: #9333ea !important; }

        .link-arrow {
          opacity: 1; /* Arrow is now always visible */
          transform: translateX(0); /* Arrow is stationary by default */
          transition: all 0.2s ease-in-out;
          margin-left: 8px; /* Consistent spacing */
          display: inline-block;
          font-family: sans-serif;
        }

        /* Subtle nudge on hover to indicate interactivity */
        .inventory-link-header:hover .link-arrow {
          transform: translateX(4px);
        }

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