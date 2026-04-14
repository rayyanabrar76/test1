"use client";

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Truck, ArrowUpRight, MoveLeft } from "lucide-react";
import { Product } from "@/types/store";
import { ProductCard } from "./ProductCard";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  title?: string | React.ReactNode;
  subtitle?: string;
  showFooter?: boolean;
  footerLabel?: string;
  footerTitle?: string;
  viewAllLink?: string; // NEW PROP
  aspect?: "square" | "rectangle" | "tall";
  themeColor?: string;
  bgClassName?: string;
  paddingY?: string;
  containerWidth?: string;
  cardWidth?: string;
  gapClassName?: string;
  showArrows?: boolean;
  showBackButton?: boolean; 
}

const ProductGrid = ({ 
  products, 
  onAddToCart,
  title = "Featured",
  subtitle = "Collection",
  showFooter = true,
  footerLabel = "Full Catalog",
  footerTitle = "Shop All Products",
  viewAllLink = "/inventory", // DEFAULT VALUE
  aspect = "rectangle",
  themeColor = "red-600",
  bgClassName = "bg-black",
  paddingY = "py-12 md:py-24",
  containerWidth = "container",
  cardWidth = "flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_33.33%]",
  gapClassName = "-ml-4 md:-ml-6",
  showArrows = true,
  showBackButton = false 
}: ProductGridProps) => {
  const router = useRouter();
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: products.length > 3,
    align: 'start',
    skipSnaps: false,
    dragFree: false,
    containScroll: 'trimSnaps',
    watchDrag: true, 
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const themeHex = themeColor === 'red-600' ? '#dc2626' : 'currentColor';

  return (
    <section className={`relative ${paddingY} ${bgClassName} overflow-hidden border-t border-white/5`}>
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className={`${containerWidth} relative z-10 mx-auto px-4`}>
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="h-[1px] w-8" 
                style={{ backgroundColor: themeHex, boxShadow: `0 0 10px ${themeHex}` }}
              />
              <span className="text-[10px] font-bold text-white tracking-[0.3em] uppercase">
                Available
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:gap-6">
              {showBackButton && (
                <button 
                  onClick={() => router.back()}
                  className="group flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300"
                  aria-label="Go back"
                >
                  <MoveLeft 
                    size={18} 
                    className="text-zinc-500 group-hover:text-emerald-500 transition-transform group-hover:-translate-x-1" 
                  />
                </button>
              )}
              
              <h2 className="text-3xl sm:text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase italic flex flex-wrap items-baseline">
                <span className="whitespace-nowrap">{title}</span> 
                {subtitle && (
                  <span className="text-neutral-700 not-italic font-light text-xl sm:text-2xl md:text-5xl ml-2 md:ml-4 whitespace-nowrap">
                    {subtitle}
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-full">
               <Truck size={12} style={{ color: themeHex }} />
               <span className="text-[9px] text-white font-bold uppercase tracking-widest">Fast delivery</span>
            </div>
          </div>
        </div>

        {/* CAROUSEL */}
        <div className="relative px-0">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className={`flex ${gapClassName}`}>
              {products.map((product) => (
                <div key={product.id} className={`${cardWidth} pl-4 md:pl-6 min-w-0`}>
                  <ProductCard 
                    product={product} 
                    onAddToCart={() => onAddToCart(product)} 
                    aspect={aspect}
                    themeColor={themeColor}
                  />
                </div>
              ))}
            </div>
          </div>

          {showArrows && products.length > 3 && (
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between z-50 pointer-events-none">
              <button 
                onClick={scrollPrev} 
                className="pointer-events-auto w-12 h-12 flex items-center justify-center bg-black/80 backdrop-blur-md border border-white/10 text-white hover:border-white transition-all"
              >
                <ArrowLeft size={20} />
              </button>

              <button 
                onClick={scrollNext} 
                className="pointer-events-auto w-12 h-12 flex items-center justify-center bg-black/80 backdrop-blur-md border border-white/10 text-white hover:border-white transition-all"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* FOOTER ACTION */}
        {showFooter && (
  <div className="mt-12 md:mt-16 flex flex-col items-center">
            {products.length > 3 && (
              <div className="w-full max-w-[200px] h-[1px] bg-white/10 relative mb-8">
                <motion.div 
                  className="absolute h-[1px] top-0"
                  style={{ backgroundColor: themeHex }}
                  animate={{ width: `${((selectedIndex + 1) / products.length) * 100}%` }}
                />
              </div>
            )}

            <Link href={viewAllLink} className="w-full md:w-auto">
              <button className="view-all-button w-full md:w-auto group flex items-center justify-between gap-8 md:gap-16 px-6 md:px-12 py-5 md:py-8 border border-white/10 bg-transparent hover:border-white transition-all duration-300">
                <div className="text-left">
                  <p className="text-[8px] font-bold uppercase tracking-[3px] mb-1" style={{ color: themeHex }}>
                    {footerLabel}
                  </p>
                  <h3 className="text-xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
                    {footerTitle}
                  </h3>
                </div>
                <ArrowUpRight className="w-6 h-6 md:w-10 md:h-10 text-white group-hover:rotate-45 transition-transform" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;