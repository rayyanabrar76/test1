'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useTransition } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

import { getAllProducts, searchProducts, type SearchableProduct } from "@/lib/search-utils";
import {
  Search, Menu,
  User, ShieldCheck, LogOut, MessageSquare, LayoutDashboard, ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart, useCartTotal } from "@/hooks/useCart";
import { SolutionsMenu } from "./SolutionsMenu";
import { BottomNav } from "./BottomNav";
import { Product } from "@/types/store";

// Lazy-load each modal/overlay so its JSX tree, framer-motion subtree,
// and modal-only icons (X, Lock, Loader2, ArrowRight) only ship when
// the user actually opens that surface.
const LoginModal = dynamic(() => import("./header/LoginModal"), { ssr: false });
const DesktopSearchOverlay = dynamic(() => import("./header/DesktopSearchOverlay"), { ssr: false });
const MobileSearchModal = dynamic(() => import("./header/MobileSearchModal"), { ssr: false });
const MobileMenuDrawer = dynamic(() => import("./header/MobileMenuDrawer"), { ssr: false });

const STORAGE_KEY = "recently_viewed_assets";
const MAX_ITEMS = 10;
const RECENT_UPDATED_EVENT = "recent_viewed_updated";

export function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { totalItems } = useCartTotal();
  const setIsCartOpen = useCart((state) => state.setIsDrawerOpen);

  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [query, setQuery] = useState("");
  const [deferredQuery, setDeferredQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [recentProducts, setRecentProducts] = useState<SearchableProduct[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    getAllProducts().then(setAllProducts);
  }, []);
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    const anyModalOpen = mobileMenuOpen || showLoginModal || (isSearchOpen && isMobile);

    if (anyModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen, showLoginModal, isSearchOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => setDeferredQuery(query));
    }, 50); 
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const loadRecents = () => {
      if (typeof window === 'undefined') return;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try { setRecentProducts(JSON.parse(saved)); } 
        catch (e) { console.error("Failed to parse recents", e); }
      }
    };
    loadRecents();
    window.addEventListener(RECENT_UPDATED_EVENT, loadRecents);
    return () => window.removeEventListener(RECENT_UPDATED_EVENT, loadRecents);
  }, []);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsAuthOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setIsAuthOpen(false), 250);
  };

  const isAuthenticated = status === "authenticated";
  const isRoot = session?.user?.role === "ROOT";
  const hasItems = totalItems > 0;
  const displayCount = totalItems;

  const trackView = useCallback((product: SearchableProduct) => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    const prev: any[] = saved ? JSON.parse(saved) : [];
    const updated = [product, ...prev.filter(p => p.id !== product.id)].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(RECENT_UPDATED_EVENT));
  }, []);

  const handleProductSelect = useCallback((product: SearchableProduct) => {
    trackView(product);
    setIsSearchOpen(false);
    setMobileMenuOpen(false);
    setQuery(""); 
    router.push(`/product/${product.id}`);
  }, [router, trackView]);

  const displayProducts = useMemo(() => {
    if (deferredQuery.trim().length > 0) {
      return searchProducts(allProducts, deferredQuery, { limit: 12 });
    }
    return recentProducts.length > 0 ? recentProducts : (allProducts.slice(0, 8) as SearchableProduct[]);
  }, [deferredQuery, allProducts, recentProducts]);

  useEffect(() => {
    const handleScroll = () => requestAnimationFrame(() => setScrolled(window.scrollY > 20));
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setQuery("");
  }, []);

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 w-full z-[100] transition-all duration-700 will-change-transform",
        scrolled ? "py-0 md:pt-2" : "py-2 md:pt-6"
      )}>
        <div className={cn(
          "container mx-auto flex items-center justify-between transition-all duration-500 relative h-14 md:h-20",
          isSearchOpen
            ? "bg-transparent backdrop-blur-none border-transparent max-w-full px-4 md:px-6"
            : scrolled 
              ? "bg-transparent max-w-full px-4 md:px-6" 
              : "bg-transparent max-w-7xl px-4 md:px-8"
        )}>

          {/* ── LOGO ── */}
          <motion.div
            animate={{
              x: isSearchOpen ? -12 : 0,
              opacity: isSearchOpen ? 0 : 1,
              pointerEvents: isSearchOpen ? "none" : "auto",
            }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1 flex justify-start items-center"
          >
            <Link href="/" className="flex items-center gap-4 group">
              <Image src="/aps-logo.png" alt="APS" className="h-10 md:h-14 w-auto brightness-125 transition-transform duration-500 group-hover:scale-105" width={64} height={64} />
              <div className="hidden xs:flex flex-col border-l-[1px] border-white/[0.08] pl-4">
                <span className="text-[10px] tracking-[0.5em] font-black uppercase text-white">APS</span>
                <span className="text-[7px] tracking-[0.4em] font-bold uppercase text-red-600">Industries</span>
              </div>
            </Link>
          </motion.div>

          {/* ── NAV ── */}
          <motion.nav
            animate={{
              opacity: isSearchOpen ? 0 : 1,
              scale: isSearchOpen ? 0.94 : 1,
              pointerEvents: isSearchOpen ? "none" : "auto",
            }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="hidden lg:flex items-center justify-center gap-8 px-4"
          >
            <Link href="/services" className="px-2 py-2 text-[9px] font-bold uppercase tracking-[0.4em] text-white/30 hover:text-red-500 transition-colors">Services</Link>
            <div className="w-[1px] h-2 bg-white/10 shrink-0" />
            <SolutionsMenu />
            <div className="w-[1px] h-2 bg-white/10 shrink-0" />
            <Link href="/company" className="px-2 py-2 text-[9px] font-bold uppercase tracking-[0.4em] text-white/30 hover:text-red-500 transition-colors">Company</Link>
          </motion.nav>

          {/* ── RIGHT ACTIONS ── */}
          <div className="flex-1 flex items-center justify-end h-full gap-4 md:gap-8">
            <div className="hidden lg:flex items-center gap-6 border-r border-white/5 pr-8 relative h-full">
              <motion.div
                animate={{
                  opacity: isSearchOpen ? 0 : 1,
                  x: isSearchOpen ? 10 : 0,
                  pointerEvents: isSearchOpen ? "none" : "auto",
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="h-full flex items-center"
              >
                {isAuthenticated ? (
                  <div className="relative h-full flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <button className="text-white/20 hover:text-red-600 transition-all duration-300 flex items-center gap-2 group/login outline-none h-full py-4">
                      <div className="flex flex-col items-end">
                        <span className="text-[6px] font-bold uppercase tracking-[0.3em] leading-none mb-1 text-red-500">{isRoot ? "Admin" : "Welcome"}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40 group-hover/login:text-white">{session?.user?.name?.split(' ')[0]}</span>
                      </div>
                      {isRoot ? <ShieldCheck size={18} className="text-red-600" /> : <User size={18} />}
                    </button>
                    <AnimatePresence>
                      {isAuthOpen && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 w-60 bg-black border border-white/10 text-white shadow-2xl z-[110] overflow-hidden">
                          <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                            <p className="text-[8px] font-bold text-red-600 uppercase tracking-widest mb-1">My Account</p>
                            <p className="text-[11px] font-medium truncate opacity-70">{session?.user?.email}</p>
                          </div>
                          <div className="flex flex-col py-1">
                            {isRoot && (
                              <Link href="/admin" className="px-4 py-3 flex items-center gap-3 hover:bg-red-600 hover:text-white transition-colors group">
                                <ClipboardList size={14} className="text-red-600 group-hover:text-white" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Admin</span>
                              </Link>
                            )}
                            <Link href="/dashboard" className="px-4 py-3 flex items-center gap-3 hover:bg-white hover:text-black transition-colors group">
                              <LayoutDashboard size={14} className="opacity-50 group-hover:opacity-100" />
                              <span className="text-[9px] font-bold uppercase tracking-widest">My Inquiries</span>
                            </Link>
                            <Link href="/checkout" className="px-4 py-3 flex items-center gap-3 hover:bg-white hover:text-black transition-colors group">
                              <MessageSquare size={14} className="opacity-50 group-hover:opacity-100" />
                              <span className="text-[9px] font-bold uppercase tracking-widest">Request a Free Quote</span>
                            </Link>
                            <div className="h-[1px] bg-white/5 mx-4 my-1" />
                            <button onClick={() => signOut()} className="px-4 py-3 flex items-center gap-3 hover:bg-red-600 hover:text-white transition-colors text-left w-full group">
                              <LogOut size={14} className="opacity-50 group-hover:opacity-100" />
                              <span className="text-[9px] font-bold uppercase tracking-widest">Sign Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button onClick={() => setShowLoginModal(true)} className="text-white/20 hover:text-red-600 transition-all duration-300 flex items-center gap-2 group outline-none">
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">Sign In</span>
                    <User size={18} />
                  </button>
                )}
              </motion.div>

              <motion.button
                onClick={() => setIsSearchOpen(true)}
                animate={{
                  opacity: isSearchOpen ? 0 : 1,
                  scale: isSearchOpen ? 0.7 : 1,
                  pointerEvents: isSearchOpen ? "none" : "auto",
                }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="text-white/20 hover:text-red-600 transition-colors"
                aria-label="Open search"
              >
                <Search size={18} />
              </motion.button>
            </div>

            {/* Cart */}
            <motion.div
              animate={{
                opacity: isSearchOpen ? 0 : 1,
                x: isSearchOpen ? 10 : 0,
                pointerEvents: isSearchOpen ? "none" : "auto",
              }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => setIsCartOpen(true)}
              className="group relative cursor-pointer flex items-center gap-4 py-2"
            >
              <div className="flex flex-col items-end">
                <span className={cn("text-[7px] font-bold uppercase tracking-[0.4em] transition-colors", hasItems ? "text-red-500" : "text-white/10")}>
                  {hasItems ? "Items Added" : "Cart Empty"}
                </span>
                <div className="flex items-center gap-2.5">
                  <AnimatePresence mode="wait">
                    <motion.span key={displayCount} className={cn("font-mono text-xl md:text-2xl font-light", hasItems ? "text-white" : "text-white/10")}>
                      {displayCount.toString().padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
              <div className={cn("w-[1px] h-7 transition-all", hasItems ? "bg-red-600" : "bg-white/5 group-hover:bg-white/20")} />
            </motion.div>

            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-white/40 hover:text-white transition-colors">
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* ─── DESKTOP SEARCH PILL OVERLAY (lazy) ─── */}
        <DesktopSearchOverlay
          isOpen={isSearchOpen}
          onClose={closeSearch}
          query={query}
          onQueryChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          displayProducts={displayProducts}
          onProductSelect={handleProductSelect}
        />

        {/* MOBILE SEARCH TRIGGER */}
        <div className={cn(
          "lg:hidden absolute left-1/2 -translate-x-1/2 w-[92%] transition-all duration-500",
          scrolled ? "top-[50px] opacity-0 pointer-events-none scale-90" : "top-14 opacity-100 scale-100"
        )}>
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full shadow-xl shadow-black/20 active:scale-[0.97] transition-all"
          >
            <Search size={12} className="text-white/60" />
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] flex-1 text-left">Inventory_Search</span>
            <div className="w-1 h-1 bg-white/20 rounded-full animate-pulse" />
          </button>
        </div>
      </header>

      {/* LOGIN MODAL */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {/* MOBILE ONLY SEARCH MODAL (lazy) */}
      <MobileSearchModal
        isOpen={isSearchOpen && typeof window !== "undefined" && window.innerWidth < 1024}
        onClose={closeSearch}
        query={query}
        onQueryChange={handleQueryChange}
        onKeyDown={handleKeyDown}
        displayProducts={displayProducts}
        onProductSelect={handleProductSelect}
      />

      {/* MOBILE MENU MODAL (lazy) */}
      <MobileMenuDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        isRoot={isRoot}
        userName={session?.user?.name}
        userEmail={session?.user?.email}
        displayCount={displayCount}
        hasItems={hasItems}
        onCartOpen={() => setIsCartOpen(true)}
        onSignInClick={() => setShowLoginModal(true)}
      />
      <BottomNav onMenuOpen={() => setMobileMenuOpen(true)} />
    </>
  );
}