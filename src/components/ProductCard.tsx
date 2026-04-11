'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingBag, Eye, Zap, Plus, CheckCircle2 } from "lucide-react";
import { Product } from "@/types/store";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  aspect?: "square" | "rectangle" | "tall";
  themeColor?: string; 
  index?: number;
}

export function ProductCard({ 
  product, 
  onAddToCart,
  aspect = "rectangle", 
  themeColor = "red-600",
  index = 0 
}: ProductCardProps) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const aspectStyles = {
    square: "aspect-square h-auto",
    rectangle: "h-[220px] sm:h-[280px] md:h-[320px]",
    tall: "h-[350px] md:h-[450px]"
  };

  const textTheme = `text-${themeColor}`;
  const bgTheme = `bg-${themeColor}`;
  const borderTheme = `group-hover:border-${themeColor}/50`;

  // @ts-ignore
  const displayBadges = (product.badges || []).slice(0, 2);

  const handleQuickInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRedirecting(true);
    onAddToCart();
    setTimeout(() => {
      router.push("/cart");
    }, 400);
  };

  const handleSilentAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdded) return;
    onAddToCart();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group relative bg-[#080808] border border-white/5 p-0 transition-all duration-700 hover:border-white/20 overflow-visible shadow-2xl">
      
      {/* --- TOP STATUS HUD --- */}
      <div className="flex justify-between items-center px-3 py-1.5 md:px-4 md:py-2 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full animate-pulse ${bgTheme}`} />
          <span className="text-[5px] md:text-[7px] font-bold text-neutral-400 uppercase tracking-[2px] md:tracking-[3px]">
            {product.category} UNIT // STABLE
          </span>
        </div>
        <span className="text-[5px] md:text-[7px] font-mono text-neutral-600 uppercase tracking-[1px] md:tracking-[2px]">
          ID_{product.id.substring(0, 6).toUpperCase()}
        </span>
      </div>

      {/* --- IMAGE VIEWPORT (Clickable Wrapper) --- */}
      <Link href={`/product/${product.id}`} className={`relative block w-full overflow-hidden bg-[#0A0A0A] ${aspectStyles[aspect]}`}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={index < 2} 
          quality={75}
          className="object-cover group-hover:scale-110 transition-all duration-1000 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Only show gradient on desktop hover */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* DESKTOP ONLY: Technical Data UI Overlay */}
        <div className="hidden md:flex absolute inset-x-0 bottom-0 justify-center p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
          <div className="w-full bg-black/90 backdrop-blur-md border border-white/10 py-3 flex items-center justify-center gap-3 group/link transition-all duration-300 hover:bg-white hover:text-black">
            <Eye size={14} className={textTheme} />
            <span className="text-[10px] font-black uppercase tracking-[4px]">
              Technical Data
            </span>
            <ArrowRight size={12} className="text-white/40 group-hover/link:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>

      {/* --- CONTENT AREA --- */}
      <div className="p-3 md:p-6 relative">
        <div className="mb-3 md:mb-6">
          <span className={`text-[6px] md:text-[8px] font-bold uppercase tracking-[3px] md:tracking-[4px] mb-1 block ${textTheme}`}>
            {product.category} // ARCHITECTURE
          </span>
          <Link href={`/product/${product.id}`} className="block group/name">
            <h3 className="text-sm md:text-xl font-black text-white uppercase tracking-tighter leading-none italic transition-colors duration-200 active:text-red-600 md:active:text-white group-hover/name:text-neutral-400">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* --- TECHNICAL SPECS GRID --- */}
        <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-3 md:pt-4 mb-4 md:mb-6">
          {displayBadges.map((badge: string, idx: number) => {
            const hasColon = badge.includes(':');
            const label = hasColon ? badge.split(':')[0] : `SPEC_0${idx + 1}`;
            const value = hasColon ? badge.split(':')[1] : badge;

            return (
              <div key={idx} className={`flex flex-col gap-0.5 ${idx !== 0 ? 'border-l border-white/5 pl-3 md:pl-4' : ''}`}>
                <span className="text-[5px] md:text-[6px] font-mono text-neutral-500 uppercase tracking-widest italic truncate">
                  {label.trim()}
                </span>
                <div className="flex items-center gap-1 md:gap-1.5">
                  <Zap size={8} className={`${textTheme} shrink-0 opacity-80`} />
                  <span className="text-[8px] md:text-[11px] font-bold text-white uppercase tracking-tighter truncate">
                    {value.trim()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA ACTIONS */}
        <div className="flex gap-2">
          <Button
            onClick={handleQuickInquiry}
            className="flex-1 rounded-none h-10 md:h-12 text-[8px] md:text-[10px] font-black uppercase tracking-[2px] transition-all duration-300 flex items-center justify-center gap-2 bg-white text-black hover:bg-red-600 hover:text-white border-none"
          >
            {isRedirecting ? <span className="animate-pulse">...</span> : <><ShoppingBag size={14} /> Get A Quote</>}
          </Button>

          <Button
            onClick={handleSilentAdd}
            variant="outline"
            className="w-10 md:w-12 h-10 md:h-12 rounded-none p-0 border-white/10 bg-transparent"
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div key="c" initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={16} className="text-green-500" /></motion.div>
              ) : (
                <motion.div key="p" initial={{ scale: 0 }} animate={{ scale: 1 }}><Plus size={16} className="text-white/50" /></motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* DECORATIVE CORNERS */}
      <div className={`absolute bottom-0 right-0 w-2 h-2 md:w-3 md:h-3 border-b border-r border-white/10 transition-colors ${borderTheme}`} />
      <div className={`absolute top-0 left-0 w-2 h-2 md:w-3 md:h-3 border-t border-l border-white/10 transition-colors ${borderTheme}`} />
    </div>
  );
}