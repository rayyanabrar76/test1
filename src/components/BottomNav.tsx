'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, Menu } from "lucide-react";
import { useCart, useCartTotal } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

export function BottomNav({ onSearchOpen, onMenuOpen }: { 
  onSearchOpen: () => void;
  onMenuOpen: () => void;
}) {
  const pathname = usePathname();
  const { totalItems } = useCartTotal();
  const setIsCartOpen = useCart((state) => state.setIsDrawerOpen);
  const hasItems = totalItems > 0;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] bg-black/95 backdrop-blur-xl border-t border-white/[0.06]">
      <div className="flex items-center justify-around px-2 py-3 pb-6">
        
        {/* Home */}
        <Link href="/" className={cn(
          "flex flex-col items-center gap-1 px-4 py-1 transition-all",
          pathname === "/" ? "text-white" : "text-white/30"
        )}>
          <Home size={20} />
          <span className="text-[7px] font-black uppercase tracking-widest">Home</span>
        </Link>

        {/* Search */}
        <button onClick={onSearchOpen} className="flex flex-col items-center gap-1 px-4 py-1 text-white/30 active:text-white transition-all">
          <Search size={20} />
          <span className="text-[7px] font-black uppercase tracking-widest">Search</span>
        </button>

        {/* Cart */}
        <button onClick={() => setIsCartOpen(true)} className={cn(
          "flex flex-col items-center gap-1 px-4 py-1 transition-all relative",
          hasItems ? "text-white" : "text-white/30"
        )}>
          <div className="relative">
            <ShoppingBag size={20} />
            {hasItems && (
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-600 rounded-full text-[7px] font-black flex items-center justify-center text-white">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[7px] font-black uppercase tracking-widest">Cart</span>
        </button>

        {/* Menu */}
        <button onClick={onMenuOpen} className="flex flex-col items-center gap-1 px-4 py-1 text-white/30 active:text-white transition-all">
          <Menu size={20} />
          <span className="text-[7px] font-black uppercase tracking-widest">Menu</span>
        </button>

      </div>
    </div>
  );
}