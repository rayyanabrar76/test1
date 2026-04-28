'use client';

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import ProductGrid from "@/components/ProductGrid";
import { ClientSection } from "@/components/ClientSection";
import { LandingFAQ } from "@/components/LandingFAQ";
import { Footer } from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { Product } from "@/types/store";

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

  // Standard safety gate to prevent hydration errors
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-red-600 selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. THE LAG FIX: We only run the Scanline effect on Desktop (Laptops/PCs). 
          Fixed overlays with gradients cause heavy scrolling lag on mobile CPUs. */}
      <div className="hidden md:block fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,128,0.06))] bg-[length:100%_2px,3px_100%]" />

      <Header />

      <main className="flex-1 relative">
        <HeroSection />

        <section id="products" className="relative scroll-mt-24">
          <ProductGrid
            products={allProductsFromDb}
            onAddToCart={handleAddToCart}
          />
        </section>

        <CategoriesSection />
            <LandingFAQ />
        <ClientSection />
      </main>
  
      <Footer />

      {/* 2. THE HANG FIX: Ping animations and fixed buttons can stutter on older mobiles. 
          We keep it for large screens only. */}
      <a
        href="https://wa.me/923008440485"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden lg:block fixed bottom-8 right-8 z-[60] group"
      >
        <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="relative bg-red-600 p-4 rounded-xl shadow-[0_10_30px_rgba(220,38,38,0.4)] text-white transition-transform group-hover:scale-110 active:scale-90">
          <Zap className="h-6 w-6 fill-current" />
        </div>
      </a>
    </div>
  );
}
