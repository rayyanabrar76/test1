"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type SearchableProduct } from "@/lib/search-utils";

interface DesktopSearchOverlayProps {
  onClose: () => void;
  query: string;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  displayProducts: SearchableProduct[];
  onProductSelect: (p: SearchableProduct) => void;
}

// Mounted only when the overlay should be open (parent gates).
export default function DesktopSearchOverlay({
  onClose,
  query,
  onQueryChange,
  onKeyDown,
  displayProducts,
  onProductSelect,
}: DesktopSearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input on mount.
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
      if (inputRef.current) {
        const val = inputRef.current.value;
        inputRef.current.value = "";
        inputRef.current.value = val;
      }
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  // Click-outside + Escape close. Listeners attached for the lifetime
  // of the mounted component (parent unmounts on close).
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <motion.div
      key="search-pill"
      initial={{ opacity: 0, scaleX: 0.6, y: -4 }}
      animate={{ opacity: 1, scaleX: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      style={{ originX: 1 }}
      className="absolute inset-0 z-[110] hidden lg:flex items-center justify-center bg-transparent px-4 md:px-12 lg:px-24"
    >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
          <div ref={containerRef} className="relative w-full max-w-4xl flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="w-full flex items-center gap-4 border border-white/10 rounded-full py-3 px-6 focus-within:border-red-600/60 transition-colors duration-300"
            >
              <Search className="h-4 w-4 text-red-600 shrink-0" />
              <input
                ref={inputRef}
                placeholder="ENTER PROTOCOL OR ASSET NAME..."
                className="flex-1 bg-transparent text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] text-white outline-none placeholder:text-white/10 min-w-0"
                value={query}
                onChange={onQueryChange}
                onKeyDown={onKeyDown}
              />
              <button
                onClick={onClose}
                aria-label="Close search"
                className="shrink-0 text-white/20 hover:text-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>

            <AnimatePresence>
              {query.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full mt-4 w-full bg-[#070707]/95 backdrop-blur-2xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] rounded-[2rem] overflow-hidden z-[200]"
                >
                  <ScrollArea className="h-[400px]">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {displayProducts.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          onClick={() => onProductSelect(item)}
                          className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-colors cursor-pointer group rounded-xl"
                        >
                          <div className="h-10 w-12 bg-black border border-white/5 relative shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black text-white uppercase italic leading-tight line-clamp-2">{item.name}</p>
                            <p className="text-[7px] text-white/30 uppercase tracking-widest mt-0.5">{item.category}</p>
                          </div>
                          <ArrowRight size={12} className="text-white/0 group-hover:text-red-600 transition-colors -translate-x-2 group-hover:translate-x-0" />
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
      </div>
    </motion.div>
  );
}
