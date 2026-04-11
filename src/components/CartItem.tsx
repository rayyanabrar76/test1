'use client';

import { Minus, Plus, Trash2, Hash, ArrowUpRight, Zap } from "lucide-react";
import { CartItem as CartItemType } from "@/types/store";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

interface CartItemProps {
  item: CartItemType & { selectedKva?: string | number };
  onUpdateQty: (delta: number) => void;
  onRemove: () => void;
}

export function CartItem({ item, onUpdateQty, onRemove }: CartItemProps) {
  const [hoverTarget, setHoverTarget] = useState<'add' | 'remove' | 'image' | null>(null);

  const isAdding = hoverTarget === 'add';
  const isRemoving = hoverTarget === 'remove';
  const isLastItem = item.qty <= 1;

  const handleMinusClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (isLastItem) {
      onRemove();
    } else {
      onUpdateQty(-1);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: 1,
        x: isRemoving && isLastItem ? [0, -2, 2, -2, 2, 0] : 0,
        backgroundColor: isAdding 
          ? "rgba(255, 255, 255, 0.03)" 
          : isRemoving 
          ? (isLastItem ? "rgba(220, 38, 38, 0.05)" : "rgba(0,0,0,0.8)") 
          : "#050505",
        borderColor: isAdding 
          ? "rgba(255, 255, 255, 0.2)" 
          : isRemoving && isLastItem
          ? "rgba(220, 38, 38, 0.4)" 
          : "rgba(255, 255, 255, 0.05)",
      }}
      transition={isRemoving && isLastItem ? { repeat: Infinity, duration: 0.2 } : { duration: 0.5 }}
      exit={{ opacity: 0, x: 40, filter: "blur(10px)" }}
      className="group relative z-0 isolate flex flex-col sm:flex-row gap-4 sm:gap-6 p-5 sm:p-6 border transition-all duration-700 overflow-hidden"
    >
      
      {/* 1. WRAPPER LINK */}
      <Link 
        href={`/product/${item.productId}`} 
        className="absolute inset-0 z-10"
        aria-label={`View ${item.name}`}
      />

      {/* 2. IMAGE CONTAINER (Shows Variant Image) */}
      <div className="relative aspect-video sm:aspect-square w-full sm:h-28 sm:w-28 overflow-hidden bg-[#0d0d0d] shrink-0 border border-white/10 group-hover:border-white/40 transition-all duration-700 z-20 pointer-events-none">
        <motion.img
          src={item.image} // This will be the variant-specific image if passed from ProductDetails
          alt={`${item.name} - ${item.selectedKva}kVA variant`}
          animate={{
            scale: isAdding ? 1.1 : isRemoving ? 0.9 : 1,
            filter: isRemoving && isLastItem ? "grayscale(1) brightness(0.4) blur(2px)" : "grayscale(0)",
            opacity: isRemoving ? 0.4 : 1
          }}
          className="h-full w-full object-contain p-2"
        />
        
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:10px_10px]" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/5 transition-opacity duration-500">
           <ArrowUpRight className="text-white w-4 h-4" />
        </div>

        <div className="absolute top-0 right-0 bg-white text-black px-1.5 py-0.5 text-[8px] font-black uppercase">
          Qty_{item.qty}
        </div>
      </div>

      {/* 3. SPECIFICATIONS AREA */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1 z-20 pointer-events-none">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-white/20">
            <Hash size={10} strokeWidth={3} />
            <span className="text-[8px] font-mono uppercase tracking-[0.4em]">
              REF_{item.productId.toString().slice(0, 8).toUpperCase()}
            </span>
          </div>
          
          <motion.h3 
            animate={{ color: isRemoving && isLastItem ? "#ef4444" : "#ffffff" }}
            className="text-lg sm:text-2xl font-serif italic tracking-tighter leading-none"
          >
            {item.name}
          </motion.h3>
          
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Variant Identifier */}
            {item.selectedKva && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white text-black text-[9px] font-black uppercase tracking-widest italic">
                {item.selectedKva} kVA
              </div>
            )}
            
            <div className="px-2 py-0.5 border border-white/10 bg-white/[0.02] text-white/40 text-[8px] font-black tracking-widest uppercase">
              {isLastItem && isRemoving ? "TERMINATE_ENTRY" : "ASSET_STATIONED"}
            </div>
          </div>
        </div>

        {/* 4. CONTROLS */}
        <div className="flex items-center justify-between mt-8 sm:mt-4 gap-4 pointer-events-auto relative z-30">
          <div className="flex items-center border border-white/5 bg-white/[0.02]">
            <button
              onMouseEnter={() => setHoverTarget('remove')}
              onMouseLeave={() => setHoverTarget(null)}
              onClick={handleMinusClick}
              className={`h-9 w-9 flex items-center justify-center transition-all duration-300 ${
                isLastItem 
                ? "text-red-500/40 hover:text-red-500 hover:bg-red-500/10" 
                : "text-white/40 hover:text-white hover:bg-white/10"
              }`}
            >
              <Minus size={14} />
            </button>
            
            <div className="w-10 text-center">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={item.qty}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs font-mono font-bold text-white"
                >
                  {item.qty}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <button
              onMouseEnter={() => setHoverTarget('add')}
              onMouseLeave={() => setHoverTarget(null)}
              onClick={(e) => { e.preventDefault(); onUpdateQty(1); }}
              className="h-9 w-9 flex items-center justify-center text-white/40 hover:text-black hover:bg-white transition-all"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[7px] font-mono uppercase tracking-[0.3em] text-white/20">Unit Status</span>
              <span className="font-mono text-[10px] font-bold text-green-500 tracking-widest uppercase italic">In_Stock</span>
            </div>
            
            <button
              className="group/trash flex items-center gap-2 text-white/20 hover:text-red-500 transition-all duration-500"
              onClick={(e) => { e.preventDefault(); onRemove(); }}
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Side Accent Line */}
      <motion.div 
        animate={{ 
          height: isAdding || isRemoving ? "100%" : "0%",
          backgroundColor: isRemoving && isLastItem ? "#ef4444" : "#ffffff",
          opacity: isAdding || (isRemoving && isLastItem) ? 1 : 0
        }}
        className="absolute top-0 right-0 w-[1px] transition-all duration-500" 
      />
    </motion.div>
  );
}