'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut, signIn } from "next-auth/react";

import { getAllProducts, searchProducts, type SearchableProduct } from "@/lib/search-utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, X, ShoppingBag, Menu,
  ArrowRight, User, ShieldCheck, LogOut, MessageSquare, LayoutDashboard, ClipboardList, Lock, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart, useCartTotal } from "@/hooks/useCart";
import { SolutionsMenu } from "./SolutionsMenu";
import { Product } from "@/types/store";

const STORAGE_KEY = "recently_viewed_assets";
const MAX_ITEMS = 10;
const RECENT_UPDATED_EVENT = "recent_viewed_updated";

function LoginModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleLogin = async (provider: string) => {
    setIsLoading(provider);
    try {
      await signIn(provider, { callbackUrl: window.location.href });
    } catch (err) {
      console.error(err);
      setIsLoading(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-[#0a0a0a] border border-red-900/30 rounded-[2.5rem] shadow-2xl p-10 overflow-hidden text-center"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-red-600 blur-sm opacity-50" />
            <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
            <div className="flex justify-center mb-8">
              <img src="/aps-logo.png" alt="APS Industries" className="h-16 w-auto brightness-125 drop-shadow-[0_0_15px_rgba(220,38,38,0.2)]" />
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Secure Access</h2>
              <p className="text-[8px] uppercase tracking-[0.4em] text-red-600/60 font-black mt-2">Authorization Required</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleLogin('google')}
                disabled={!!isLoading}
                className="group w-full flex justify-center items-center py-4 border border-white/5 rounded-2xl bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/[0.05] hover:border-red-900/40 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading === 'google' ? (
                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                ) : (
                  <>
                    <img src="https://authjs.dev/img/providers/google.svg" className="h-4 w-4 mr-3 grayscale brightness-200 group-hover:grayscale-0 transition-all" alt="G" />
                    Connect via Google SSO
                  </>
                )}
              </button>
            </div>
            <div className="mt-10 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 opacity-20">
                <Lock size={10} className="text-white" />
                <span className="text-[7px] font-bold uppercase tracking-[0.3em] text-white">Encrypted Session</span>
              </div>
              <p className="text-[6px] text-white/10 font-bold uppercase tracking-widest">APS Industries © 2026</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Navbar() {
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
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // ── BODY SCROLL LOCK ──
  // Lock body scroll whenever any mobile modal/overlay is open
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
    function handleClickOutside(event: MouseEvent) {
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
          setIsSearchOpen(false);
        }
      }
    }
    function handleEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsSearchOpen(false);
    }
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        if (inputRef.current) {
          const val = inputRef.current.value;
          inputRef.current.value = "";
          inputRef.current.value = val;
        }
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

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
      inputRef.current?.blur();
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
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

          {/* LOGO */}
          <motion.div
            animate={{ x: isSearchOpen ? -12 : 0, opacity: isSearchOpen ? 0 : 1, pointerEvents: isSearchOpen ? "none" : "auto" }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1 flex justify-start items-center"
          >
            <Link href="/" className="flex items-center gap-4 group">
              <img src="/aps-logo.png" alt="APS" className="h-10 md:h-14 w-auto brightness-125 transition-transform duration-500 group-hover:scale-105" />
              <div className="hidden xs:flex flex-col border-l-[1px] border-white/[0.08] pl-4">
                <span className="text-[10px] tracking-[0.5em] font-black uppercase text-white">APS</span>
                <span className="text-[7px] tracking-[0.4em] font-bold uppercase text-red-600">Industries</span>
              </div>
            </Link>
          </motion.div>

          {/* NAV */}
          <motion.nav
            animate={{ opacity: isSearchOpen ? 0 : 1, scale: isSearchOpen ? 0.94 : 1, pointerEvents: isSearchOpen ? "none" : "auto" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="hidden lg:flex items-center justify-center gap-8 px-4"
          >
            <Link href="/services" className="px-2 py-2 text-[9px] font-bold uppercase tracking-[0.4em] text-white/30 hover:text-red-500 transition-all">Services</Link>
            <div className="w-[1px] h-2 bg-white/10 shrink-0" />
            <SolutionsMenu />
            <div className="w-[1px] h-2 bg-white/10 shrink-0" />
            <Link href="/company" className="px-2 py-2 text-[9px] font-bold uppercase tracking-[0.4em] text-white/30 hover:text-red-500 transition-all">Company</Link>
          </motion.nav>

          {/* RIGHT ACTIONS */}
          <div className="flex-1 flex items-center justify-end h-full gap-4 md:gap-8">
            <div className="hidden lg:flex items-center gap-6 border-r border-white/5 pr-8 relative h-full">
              <motion.div
                animate={{ opacity: isSearchOpen ? 0 : 1, x: isSearchOpen ? 10 : 0, pointerEvents: isSearchOpen ? "none" : "auto" }}
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
                animate={{ opacity: isSearchOpen ? 0 : 1, scale: isSearchOpen ? 0.7 : 1, pointerEvents: isSearchOpen ? "none" : "auto" }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="text-white/20 hover:text-red-600 transition-colors"
                aria-label="Open search"
              >
                <Search size={18} />
              </motion.button>
            </div>

            {/* Cart */}
            <motion.div
              animate={{ opacity: isSearchOpen ? 0 : 1, x: isSearchOpen ? 10 : 0, pointerEvents: isSearchOpen ? "none" : "auto" }}
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

        {/* DESKTOP SEARCH PILL OVERLAY */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              key="search-pill"
              initial={{ opacity: 0, scaleX: 0.6, y: -4 }}
              animate={{ opacity: 1, scaleX: 1, y: 0 }}
              exit={{ opacity: 0, scaleX: 0.6, y: -4 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              style={{ originX: 1 }}
              className="absolute inset-0 z-[110] hidden lg:flex items-center justify-center bg-transparent px-4 md:px-12 lg:px-24"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
              <div ref={searchContainerRef} className="relative w-full max-w-4xl flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.25, delay: 0.1 }}
                  className="w-full flex items-center gap-4 border border-white/10 rounded-full py-3 px-6 focus-within:border-red-600/60 transition-all duration-300"
                >
                  <Search className="h-4 w-4 text-red-600 shrink-0" />
                  <input
                    ref={inputRef}
                    placeholder="ENTER PROTOCOL OR ASSET NAME..."
                    className="flex-1 bg-transparent text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] text-white outline-none placeholder:text-white/10 min-w-0"
                    value={query}
                    onChange={handleQueryChange}
                    onKeyDown={handleKeyDown}
                  />
                  <button onClick={closeSearch} className="shrink-0 text-white/20 hover:text-red-600 transition-colors">
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
                              onClick={() => handleProductSelect(item)}
                              className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-pointer group rounded-xl"
                            >
                              <div className="h-10 w-12 bg-black border border-white/5 relative shrink-0">
                                <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-black text-white uppercase italic leading-tight line-clamp-2">{item.name}</p>
                                <p className="text-[7px] text-white/30 uppercase tracking-widest mt-0.5">{item.category}</p>
                              </div>
                              <ArrowRight size={12} className="text-white/0 group-hover:text-red-600 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

      {/* MOBILE SEARCH MODAL */}
      <AnimatePresence>
        {isSearchOpen && (typeof window !== 'undefined' && window.innerWidth < 1024) && (
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
                <button onClick={closeSearch} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/10 text-white/40 active:scale-90">
                  <X size={20}/>
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
                    onChange={handleQueryChange} 
                    onKeyDown={handleKeyDown}
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
                    onClick={(e) => { e.stopPropagation(); handleProductSelect(item); }} 
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

      {/* MOBILE MENU MODAL */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[200] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setMobileMenuOpen(false)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }} 
              className="absolute top-0 right-0 w-[85%] h-full bg-black/95 backdrop-blur-xl flex flex-col border-l border-white/5 shadow-2xl"
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b-[1px] border-white/[0.03] shrink-0">
                <div className="flex items-center gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full", isAuthenticated ? "bg-white shadow-[0_0_5px_white]" : "bg-white/20")} />
                  <span className="text-[8px] font-black tracking-widest text-white/40 uppercase italic">{isAuthenticated ? "Signed In" : "Navigation"}</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center border-[1px] border-white/[0.08] rounded-full text-white/40">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 flex flex-col px-8 py-8 overflow-y-auto overscroll-contain">
                <div className="mb-8">
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-2 block">
                    {isRoot ? "Admin" : isAuthenticated ? "Account" : "Get Started"}
                  </span>
                  {isAuthenticated ? (
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black uppercase italic tracking-tighter text-white">
                          {session?.user?.name?.split(' ')[0]}
                        </span>
                        <span className="text-[10px] text-white/30 mt-0.5">{session?.user?.email}</span>
                      </div>
                      {isRoot ? <ShieldCheck size={24} className="text-red-600 shrink-0" /> : <User size={24} className="text-white/40 shrink-0" />}
                    </div>
                  ) : (
                    <div
                      onClick={() => { setMobileMenuOpen(false); setShowLoginModal(true); }}
                      className="text-2xl font-black uppercase italic tracking-tighter text-white flex items-center gap-3 cursor-pointer"
                    >
                      <span>Sign In</span>
                      <User size={24} className="text-white shrink-0" />
                    </div>
                  )}
                </div>

                {isAuthenticated && (
                  <div className="mb-8 border border-white/5 rounded-2xl overflow-hidden">
                    {isRoot && (
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-5 py-4 bg-red-600/10 border-b border-white/5 hover:bg-red-600 hover:text-white transition-colors group">
                        <ClipboardList size={14} className="text-red-600 group-hover:text-white" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Admin Panel</span>
                      </Link>
                    )}
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-5 py-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                      <LayoutDashboard size={14} className="text-white/40" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/70">My Inquiries</span>
                    </Link>
                    <Link href="/checkout" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-5 py-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                      <MessageSquare size={14} className="text-white/40" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Request a Free Quote</span>
                    </Link>
                    <button onClick={() => { setMobileMenuOpen(false); signOut(); }} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-600 hover:text-white transition-colors group">
                      <LogOut size={14} className="text-white/40 group-hover:text-white" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/70 group-hover:text-white">Sign Out</span>
                    </button>
                  </div>
                )}

                <div className="flex flex-col justify-center space-y-8 mt-2">
                  <div className="h-[1px] w-8 bg-white/10" />
                  <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black uppercase italic tracking-tighter text-white/90 leading-none">Services</Link>
                  <div className="text-3xl font-black uppercase italic tracking-tighter text-white/90 leading-none"><SolutionsMenu /></div>
                  <Link href="/company" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black uppercase italic tracking-tighter text-white/90 leading-none">Company</Link>
                </div>
              </div>

              <div
                onClick={() => { setMobileMenuOpen(false); setIsCartOpen(true); }}
                className={cn("p-8 flex items-center justify-between border-t-[1px] border-white/[0.05] shrink-0 cursor-pointer", hasItems ? "bg-white/10 backdrop-blur-lg text-white" : "bg-white/[0.02] text-white/10")}
              >
                <div>
                  <span className="block text-[8px] font-black tracking-widest opacity-50 uppercase">Secured Quote</span>
                  <span className="text-2xl font-black uppercase italic tracking-tighter">Cart ({displayCount})</span>
                </div>
                <ShoppingBag strokeWidth={1.5} className="w-8 h-8" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}