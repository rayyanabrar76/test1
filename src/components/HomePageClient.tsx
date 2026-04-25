'use client';

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Header } from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { Product } from "@/types/store";

// We keep these dynamic to save memory on weak phones
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
      className: "bg-[#0A0A0B] border-red-600/50 text-white rounded-none border-l-4 border-l-red-600 font-sans tracking-widest z-[200]",
    });
  };

  // If not mounted, we return a simple version of the shell 
  // This prevents the "Application Error" while still being fast
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col">
        <div className="h-20 bg-[#050505]" /> {/* Header placeholder */}
        <div className="flex-1" /> 
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-red-600 selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. PERFORMANCE: Hidden on mobile to prevent GPU lag */}
      <div className="hidden lg:block fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,128,0.06))] bg-[length:100%_2px,3px_100%]" />

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
        <ClientSection />
      </main>

      <Footer />

      {/* 2. PERFORMANCE: Floating button hidden on mobile screens to save CPU */}
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
