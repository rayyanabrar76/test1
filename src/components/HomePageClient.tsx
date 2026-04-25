'use client';

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic'; // Optimized loading
import { Header } from "@/components/Header";
import HeroSection from "@/components/HeroSection";
// Static components are moved to Dynamic below for performance
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { Product } from "@/types/store";

// Lazy-load heavy sections so they don't block the initial mobile render
const CategoriesSection = dynamic(() => import("@/components/CategoriesSection"), { ssr: true });
const ProductGrid = dynamic(() => import("@/components/ProductGrid"), { ssr: true });
const ClientSection = dynamic(() => import("@/components/ClientSection"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });

interface HomePageClientProps {
  allProductsFromDb: Product[];
}

export default function HomePageClient({ allProductsFromDb }: HomePageClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    toast({
      title: "ASSET_INITIALIZED",
      description: `${product.name} appended to deployment manifest.`,
      duration: 1500,
      className:
        "bg-[#0A0A0B] border-red-600/50 text-white rounded-none border-l-4 border-l-red-600 font-sans tracking-widest z-[200]",
    });
  };

  const handleViewSpecs = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  // REMOVED: "if (!mounted) return null" 
  // This allows the Hero and Header to show immediately while JS loads in the background.

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-red-600 selection:text-white font-sans overflow-x-hidden">
      
      {/* Scanline Overlay - Hidden on mobile to stop scroll-lag/stuttering */}
      <div className="hidden lg:block fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,128,0.06))] bg-[length:100%_2px,3px_100%]" />

      <Header />

      <main className="flex-1 relative">

        {/* Hero renders immediately for perceived speed */}
        <HeroSection />

        {/* We only render these heavy parts once the page is interactive to save mobile CPU */}
        {mounted && (
          <>
            <section id="products" className="relative scroll-mt-24">
              <ProductGrid
                products={allProductsFromDb}
                onAddToCart={handleAddToCart}
              />
            </section>

            <CategoriesSection />
            <ClientSection />
          </>
        )}
        
      </main>

      <Footer />

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/923008440485"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden lg:block fixed bottom-8 right-8 z-[60] group"
      >
        <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="relative bg-red-600 p-4 rounded-xl shadow-[0_10px_30px_rgba(220,38,38,0.4)] text-white transition-transform group-hover:scale-110 active:scale-90">
          <Zap className="h-6 w-6 fill-current" />
        </div>
      </a>
    </div>
  );
}
