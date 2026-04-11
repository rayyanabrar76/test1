'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  X, Trash2, CornerUpLeft, 
  Database, Activity, ArrowRight,
  ShieldCheck, Cpu
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
}

export const CartDrawer = ({ isOpen, onClose, items }: CartDrawerProps) => {
  const { data: session } = useSession();
  const { removeItem, updateQty } = useCart();
  const router = useRouter();
  const pathname = usePathname() || '/';

  const handleSmartReturn = () => {
    onClose();
    if (pathname.length > 2) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <>
      {/* 1. Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/95 backdrop-blur-sm z-[150] transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* 2. Side Panel - Added rounded-l-[2rem] and overflow-hidden */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-[90%] sm:w-[480px] bg-[#050505] border-l border-white/10 z-[151] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-l-[2rem] overflow-hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Visual Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,128,0.06))] bg-[length:100%_2px,3px_100%]" />

        <div className="flex flex-col h-full relative text-white">
          
          {/* HEADER */}
          <div className="px-6 pt-12 pb-6 flex items-center justify-between border-b border-white/5 bg-[#080808]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-1 w-4 bg-red-600 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white-600 italic">for Quotations</span>
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
                Your <span className="text-neutral-800 not-italic font-light">Items</span>
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 active:scale-90 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* ITEM LIST */}
          <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
            {items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="relative bg-[#080808] border border-white/5 p-4 group overflow-hidden">
                    <div className="flex gap-4 relative z-10">
                      {/* Product Image */}
                      <div className="w-16 h-20 bg-black border border-white/10 flex-shrink-0 relative">
                        <img 
                          src={item.image} 
                          className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                          alt={item.name} 
                        />
                        <div className="absolute top-0 right-0 bg-red-600/20 text-red-600 text-[6px] font-bold px-1 py-0.5">
                          {item.id?.slice(0, 3) || "ITEM"}
                        </div>
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[7px] font-mono text-neutral-600 tracking-widest uppercase mb-1">Product ID: {item.productId.slice(0, 8)}</p>
                            <h3 className="text-[10px] font-black italic uppercase tracking-widest text-white leading-tight">
                              {item.name}
                            </h3>
                          </div>
                          <button 
                            onClick={() => removeItem(item.productId)} 
                            className="text-neutral-700 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center bg-black border border-white/10">
                            <button onClick={() => updateQty(item.productId, -1)} className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-white">-</button>
                            <span className="text-[10px] w-6 text-center font-black text-white">{item.qty}</span>
                            <button onClick={() => updateQty(item.productId, 1)} className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-white">+</button>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-20">
                             <Cpu size={8} />
                             <span className="text-[6px] font-mono uppercase tracking-widest">In Stock</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 border border-white/5 flex items-center justify-center relative mb-8">
                  <div className="absolute inset-0 border border-red-600/20 animate-ping" />
                  <Database size={24} className="text-white/10" />
                </div>
                
                <div className="text-center space-y-2 mb-12">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter text-neutral-800">Empty Cart</h3>
                  <p className="text-[8px] font-mono uppercase tracking-[0.5em] text-neutral-600">No items added yet</p>
                </div>

                <button 
                  onClick={handleSmartReturn} 
                  className="flex flex-col items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full border border-red-600/30 flex items-center justify-center group-active:scale-90 transition-all">
                    <CornerUpLeft size={16} className="text-red-600" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white">
                    Go Back to Store
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-6 bg-[#080808] border-t border-white/5">
            {items.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4 px-2">
                  <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Total Quantity:</span>
                  <span className="text-[10px] font-mono text-white">{items.reduce((acc, i) => acc + i.qty, 0)} Units</span>
                </div>
                
                <Link 
                  href="/cart"
                  onClick={onClose}
                  className="group flex items-center justify-between w-full py-5 px-6 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] transition-all active:bg-red-600 active:text-white"
                >
                  <span>Request Quote</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </>
  );
};