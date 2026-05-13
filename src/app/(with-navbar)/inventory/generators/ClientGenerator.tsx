"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { NavbarWithCart } from "@/components/NavbarWithCart";
import ProductGrid from "@/components/ProductGrid";
import { InventoryBreadcrumb } from "@/components/InventoryBreadcrumb";
import { Product } from "@/types/store";
import { useCart } from "@/hooks/useCart";
import { MoveLeft } from "lucide-react";

interface GeneratorsClientProps {
  allProductsFromDb: Product[];
}

export default function GeneratorsClient({ allProductsFromDb }: GeneratorsClientProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleCart = (p: Product) => addToCart({ ...p, productId: p.id });
  const handleView = (p: Product) => router.push(`/product/${p.id}`);

  const byBrand = (brandName: string) =>
    allProductsFromDb.filter((p) => {
      const brand = typeof p.brand === "string" ? p.brand.toLowerCase() : "";
      return brand === brandName.toLowerCase();
    });

  const perkinsSeries  = byBrand("Perkins");
  const cumminsSeries  = byBrand("Cummins");
  const yangdongSeries = byBrand("Yangdong");

  /* ---------------- BRAND TITLE ---------------- */
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

  /* ---------------- PAGE ---------------- */
  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600/30">
      <NavbarWithCart />

      <main className="w-screen pt-24 pb-10 space-y-0">
        <InventoryBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Inventory", href: "/inventory" },
            { label: "Generators" },
          ]}
        />
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white px-4 md:px-8 pt-8 mb-4">
          Diesel Generators in Pakistan
        </h1>
        {/* PERKINS */}
        <ProductGrid
          products={perkinsSeries}
          title={
            <BrandTitle
              src="/images/brands/perkins.png"
              alt="Perkins"
              back
              wClass="w-56 md:w-72"
              hClass="h-20 md:h-28"
            />
          }
          subtitle=""
          onAddToCart={handleCart}
          footerTitle="View All Series"
          viewAllLink="/inventory/generators/perkins"
          paddingY="py-2"
        />

        {/* CUMMINS */}
        <ProductGrid
          products={cumminsSeries}
          title={
            <BrandTitle
              src="/images/brands/cummins2.svg"
              alt="Cummins"
              wClass="w-64 md:w-80"
              hClass="h-24 md:h-32"
            />
          }
          subtitle=""
          onAddToCart={handleCart}
          footerTitle="View All Series"
          viewAllLink="/inventory/generators/cummins"
          paddingY="py-2"
        />

        {/* YANGDONG */}
        <ProductGrid
          products={yangdongSeries}
          title={
            <BrandTitle
              src="/images/brands/yangdong.png"
              alt="Yangdong"
              wClass="w-64 md:w-80"
              hClass="h-24 md:h-32"
            />
          }
          subtitle=""
          onAddToCart={handleCart}
          showFooter={false}
          paddingY="py-2"
        />
      </main>

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

      {/* GLOBAL GRID OVERRIDES */}
      <style jsx global>{`
        .product-grid-container {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .product-grid-header {
          padding-top: 2rem !important; 
          margin-top: 0 !important;
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
          margin-bottom: 1rem !important;
        }
      `}</style>
    </div>
  );
}