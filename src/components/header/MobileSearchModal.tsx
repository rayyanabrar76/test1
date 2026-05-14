"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type SearchableProduct } from "@/lib/search-utils";

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  displayProducts: SearchableProduct[];
  onProductSelect: (p: SearchableProduct) => void;
}

export default function MobileSearchModal({
  isOpen,
  onClose,
  query,
  onQueryChange,
  onKeyDown,
  displayProducts,
  onProductSelect,
}: MobileSearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input shortly after mount so iOS Safari opens the keyboard.
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
      if (inputRef.current) {
        const val = inputRef.current.value;
        inputRef.current.value = "";
        inputRef.current.value = val;
      }
    }, 10);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[1000] bg-black flex flex-col overflow-hidden"
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="px-6 pt-12 pb-6 border-b border-red-900/30 bg-[#050505] shrink-0">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                    <span className="text-[10px] font-black text-white tracking-[0.3em] uppercase italic">Inventory_Scan</span>
                  </div>
                  <span className="text-[6px] font-bold text-white/30 uppercase tracking-[0.5em] mt-1 ml-3">Node: APS_SECURE_01</span>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/10 text-white/40 active:scale-90">
                <X size={20} />
              </button>
            </div>
            <div className="relative group">
              <div className="absolute -inset-[1px] bg-red-600/30 rounded-xl blur-[2px] opacity-100" />
              <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-4">
                <Search className="h-4 w-4 text-red-600 shrink-0" />
                <input
                  ref={inputRef}
                  autoFocus
                  placeholder="SEARCH PROTOCOL..."
                  className="w-full bg-transparent pl-4 text-sm font-black uppercase tracking-widest text-white outline-none placeholder:text-white/10"
                  value={query}
                  onChange={onQueryChange}
                  onKeyDown={onKeyDown}
                  enterKeyHint="search"
                />
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 bg-[#050505]">
            <div className="px-4 py-6 space-y-2 pb-32">
              {displayProducts.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onProductSelect(item);
                  }}
                  className="group relative w-full p-2 flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-lg active:bg-white/[0.08] active:border-red-600/50 transition-all"
                >
                  <div className="h-14 w-16 bg-black border border-white/10 relative shrink-0 rounded overflow-hidden">
                    <Image src={item.image} alt={item.name} fill sizes="100px" className="object-contain p-2" />
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-600/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[6px] font-bold text-red-600 uppercase tracking-widest">Active_Asset</span>
                      <div className="h-[1px] w-4 bg-white/10" />
                    </div>
                    <h3 className="text-[11px] font-black text-white uppercase italic leading-tight line-clamp-1 tracking-tighter">{item.name}</h3>
                    <p className="text-[8px] font-bold uppercase text-white/30 tracking-[0.2em] mt-1">{item.category}</p>
                  </div>
                  <div className="pr-2">
                    <ArrowRight size={14} className="text-white/10 group-active:text-red-600" />
                  </div>
                </motion.div>
              ))}
              {displayProducts.length === 0 && (
                <div className="py-20 flex flex-col items-center">
                  <div className="w-12 h-[1px] bg-red-600/30 mb-4" />
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">Zero_Matches_Found</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-white/5 bg-black flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-1 h-3 bg-red-600" />
              <span className="text-[8px] font-black text-white/60 uppercase tracking-widest italic">APS_MOBILE_SCANNER</span>
            </div>
            <span className="text-[7px] font-mono text-white/20 tracking-tighter">REF: 2026-XQ-4</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
