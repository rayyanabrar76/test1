'use client';

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import ProductGrid from "@/components/ProductGrid";
import { ClientSection } from "@/components/ClientSection";
import { Footer } from "@/components/Footer";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ShieldCheck, Cog, Zap, Globe } from "lucide-react";
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

  const handleViewSpecs = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-red-600 selection:text-white font-sans overflow-x-hidden">
      {/* Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,128,0.06))] bg-[length:100%_2px,3px_100%]" />

      <Header />

      <main className="flex-1 relative">

        {/* 1. Hero Section */}
        <HeroSection />

           {/* 4. Product Catalog */}
        <section id="products" className="relative scroll-mt-24">
          <ProductGrid
            products={allProductsFromDb}
            onAddToCart={handleAddToCart}
          />
        </section>

        {/* 2. Primary Navigation Categories */}
        <CategoriesSection />

        {/* Visual Spacer */}
        <div className="relative h-24 bg-gradient-to-b from-transparent to-[#050505] -mt-24 z-10" />

        {/* 3. Industrial Stats / Trust Signals */}
        <section className="bg-[#050505] border-y border-white/5 py-12 relative z-20">
          <div className="container mx-auto px-6">
            <div className="flex md:grid md:grid-cols-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700 pb-4 md:pb-0">
              {[
                { icon: <ShieldCheck className="h-4 w-4" />, label: "ISO 9001 CERTIFIED" },
                { icon: <Cog className="h-4 w-4" />, label: "PRECISION ENGINEERING" },
                { icon: <Zap className="h-4 w-4" />, label: "3000 KVA CAPACITY" },
                { icon: <Globe className="h-4 w-4" />, label: "NATIONWIDE LOGISTICS" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="min-w-[70%] md:min-w-full snap-center flex flex-col md:flex-row items-center justify-center gap-3 text-center md:text-left"
                >
                  <div className="p-2 rounded-lg bg-white/5 text-red-600 border border-white/5 shrink-0">
                    {stat.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[3px] text-white leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Client Logos / Social Proof */}
        <ClientSection />

      </main>

      {/* 6. Footer & Brand Story */}
      <Footer />

      {/* WhatsApp Floating Action Button */}
      <a
        href="https://wa.me/923008440485"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[60] group"
      >
        <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="relative bg-red-600 p-4 rounded-xl shadow-[0_10px_30px_rgba(220,38,38,0.4)] text-white transition-transform group-hover:scale-110 active:scale-90">
          <Zap className="h-6 w-6 fill-current" />
        </div>
      </a>
    </div>
  );
}