'use client';

import { useState, useEffect } from "react";
import { 
  ArrowLeft, ShoppingBag, Terminal, ShieldCheck, Activity, 
  Search, Database, Plus, Copy, Check, ChevronDown, Trash2, X 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { CartItem } from "@/components/CartItem";
import { CheckoutForm } from "@/components/CheckoutForm";
import { useCart, useCartTotal } from "@/hooks/useCart";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/**
 * PROJECT CONFIGURATION
 */
const CONFIG = {
  logo: {
    path: "/ap.png",
    alt: "Company Logo",
    width: 40,
    height: 40
  }
};

const CartPage = () => {
  const router = useRouter();
  const { cart, totalItems, totalPrice } = useCartTotal();
  
  const updateQty = useCart((state) => state.updateQty);
  const removeItem = useCart((state) => state.removeItem);
  const clearCart = useCart((state) => state.clearCart);

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  // Custom Confirmation State
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (orderPlaced) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [orderPlaced]);

  const handlePlaceOrder = (quoteId: string) => {
    clearCart();
    setOrderPlaced(quoteId);
    setIsProcessing(false);
    toast({
      title: "Inquiry Sent",
      description: `Your request ${quoteId} has been successfully submitted.`,
    });
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      removeItem(itemToDelete);
      setItemToDelete(null);
      toast({
        title: "Item Removed",
        description: "The technical specification has been cleared.",
      });
      // Redirects user to the previous page in their history
      router.back();
    }
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    toast({ title: "Copied", description: "Reference ID saved." });
    setTimeout(() => setCopied(false), 2000);
  };

  const FlexibleLogo = ({ className = "" }: { className?: string }) => (
    <div className={cn("relative transition-opacity hover:opacity-80", className)} style={{ width: CONFIG.logo.width, height: CONFIG.logo.height }}>
      <Link href="/">
        <Image 
          src={CONFIG.logo.path} 
          alt={CONFIG.logo.alt}
          fill 
          className="object-contain" 
          priority 
        />
      </Link>
    </div>
  );

  const FooterLinks = ({ className = "" }: { className?: string }) => (
    <div className={cn(
      "py-12 border-t border-white/5 flex flex-wrap gap-x-8 gap-y-6 px-6 md:px-0 justify-center md:justify-start", 
      className
    )}>
      {["Refund policy", "Privacy policy", "Terms of service", "Contact"].map((link) => (
        <Link 
          key={link} 
          href={`/${link.toLowerCase().replace(/ /g, '-')}`} 
          className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors underline underline-offset-8 decoration-white/10 hover:decoration-white"
        >
          {link}
        </Link>
      ))}
    </div>
  );

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-white selection:text-black">
        <div className="w-full p-6 flex items-start justify-start">
            <FlexibleLogo />
        </div>
        <main className="flex-1 flex items-center justify-center pb-12 px-6 relative">
          <div className="text-center max-w-xl mx-auto w-full">
            <div className="h-20 w-20 border border-white/10 bg-white/[0.02] flex items-center justify-center mx-auto mb-10">
                <ShieldCheck className="h-8 w-8 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif italic tracking-tight text-white mb-2">
              Inquiry <span className="text-white/40">Sent</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-12 font-bold">
              DETAILS SENT TO YOUR INBOX.
            </p>
            <div className="bg-white/[0.02] border border-white/5 p-8 mb-10 relative text-center">
               <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/20 mb-4">Reference Number</p>
               <div className="flex items-center justify-center gap-3 mb-8">
                 <p className="font-mono text-[14px] md:text-lg font-medium text-white tracking-widest break-all">
                    {orderPlaced.toUpperCase()}
                 </p>
                 <button onClick={() => handleCopy(orderPlaced)} className="shrink-0 text-white/20 hover:text-white transition-colors">
                    {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                 </button>
               </div>
               <div className="h-[1px] w-full bg-white/5 mb-6" />
               <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 font-medium italic">
                 "Our team will respond within 24 hours."
               </p>
            </div>
            <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
              <button onClick={() => router.push('/dashboard')} className="h-16 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-gray-200 transition-colors">
                <Terminal size={14} /> Dashboard
              </button>
              <button onClick={() => router.push('/')} className="h-16 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-colors">
                Return Home
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-white selection:text-black">
      
      {/* CUSTOM OVERLAY MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[#0A0A0A] border border-white/10 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="h-12 w-12 border border-white/10 bg-white/[0.02] flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Confirm Removal</h3>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">
                  Are you sure you want to delete this item from the Quote?
                </p>
              </div>

              <div className="flex flex-col w-full gap-3 pt-2">
                <button 
                  onClick={handleConfirmDelete}
                  className="h-12 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all"
                >
                  Confirm Delete
                </button>
                <button 
                  onClick={() => setItemToDelete(null)}
                  className="h-12 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={cn(
        "fixed top-0 left-0 right-0 z-[100] bg-black",
        cart.length > 0 ? "hidden md:block" : "block"
      )}>
        <Header />
      </div>
      
      <main className={cn(
        "flex-1 relative",
        cart.length > 0 ? "pt-0 md:pt-32 pb-0 md:pb-20" : "pt-24 md:pt-32 pb-20"
      )}>
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {cart.length > 0 && (
          <div className="md:hidden sticky top-0 z-[90] w-full">
            <div className="flex items-center bg-[#000000] border-b border-white/10">
              <div className="px-8 py-5 border-r border-white/10 flex items-center justify-center bg-black">
                <FlexibleLogo />
              </div>
              <button 
                onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                className="flex-1 px-8 py-5 flex items-center justify-between relative z-[92]"
              >
                <div className="flex items-center gap-4">
                  <ShoppingBag size={18} className={cn("transition-colors", isSummaryExpanded ? "text-white" : "text-white/60")} />
                  <span className="text-[12px] font-bold uppercase tracking-[0.5em] text-white">Manifest</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-mono text-white/40">{totalItems}</span>
                  <ChevronDown size={16} className={cn("text-white/40 transition-transform duration-300", isSummaryExpanded && "rotate-180")} />
                </div>
              </button>
            </div>
            
            <div className={cn(
              "absolute top-full left-0 w-full bg-[#050505] border-b border-white/10 transition-all duration-300 ease-out z-[91]",
              isSummaryExpanded ? "max-h-[60vh] opacity-100 shadow-2xl overflow-y-auto" : "max-h-0 opacity-0 pointer-events-none overflow-hidden"
            )}>
              <div className="px-6 py-4 divide-y divide-white/5">
                {cart.map((item) => (
                  <div key={item.productId} className="py-2">
                    <CartItem
                      item={item}
                      onUpdateQty={(delta) => updateQty(item.productId, delta)}
                      onRemove={() => setItemToDelete(item.productId)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="container max-w-7xl px-0 md:px-6 mx-auto relative z-10">
          <div className={cn(
            "flex-col md:flex-row md:items-end justify-between mb-16 gap-8 px-6 md:px-0 mt-8 md:mt-0",
            cart.length > 0 ? "hidden md:flex" : "flex"
          )}>
            <div className="space-y-4">
                <button onClick={() => router.back()} className="group inline-flex items-center gap-3 text-white transition-all text-[9px] font-mono uppercase tracking-[0.3em]">
                    <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" /> Back
                </button>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif italic tracking-tighter text-white leading-none">
                    Quote <span className="text-white/10 not-italic">List</span>
                </h1>
            </div>

            <div className="hidden md:flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 backdrop-blur-md">
                <Activity size={12} className="text-emerald-500 animate-pulse" />
                <div className="flex flex-col">
                    <span className="text-[7px] font-mono text-white/20 uppercase tracking-[0.3em]">System Status</span>
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Online</span>
                </div>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="w-full py-32 border-y md:border border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center px-6 md:px-0">
              <div className="relative w-24 h-24 mb-10 flex items-center justify-center">
                <div className="absolute inset-0 border border-white/5 rounded-full animate-ping" />
                <Database size={30} className="text-white/5" />
              </div>
              <h2 className="text-3xl font-serif italic text-white/80 mb-2">Cart is Empty</h2>
              <p className="text-[9px] font-mono uppercase tracking-[0.5em] text-white/20 mb-12">Search for products to add them here</p>
              <Link href="/#products" className="group flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/40 transition-all duration-500">
                   <Search size={20} className="text-white/20 group-hover:text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 group-hover:text-white transition-colors">
                  Browse Products
                </span>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-12 items-start">
                <div className="hidden md:block lg:col-span-7 space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Current Items</span>
                      <span className="text-[10px] font-mono text-white/60 uppercase tracking-[0.4em]">{totalItems} Units</span>
                  </div>

                  <div className="divide-y divide-white/5">
                    {cart.map((item) => (
                      <CartItem
                        key={item.productId}
                        item={item}
                        onUpdateQty={(delta) => updateQty(item.productId, delta)}
                        onRemove={() => setItemToDelete(item.productId)}
                      />
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
                  <div className="bg-[#050505] border-b md:border border-white/10 p-0 md:p-1">
                    <CheckoutForm
                      onPlaceOrder={handlePlaceOrder}
                      isProcessing={isProcessing}
                      items={cart}
                      total={totalPrice} 
                      showCategory={false}
                      onRemoveItem={(id) => setItemToDelete(id)}
                    />
                    <FooterLinks className="md:hidden mt-0 py-4 border-t-0" />
                  </div>

                  <div className="hidden md:flex p-8 bg-white/[0.01] border border-white/5 gap-5 items-start">
                      <ShieldCheck size={20} className="text-white/20 shrink-0" strokeWidth={1} />
                      <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                          Secure Submission
                          </p>
                          <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest leading-loose">
                          Your inquiry will be sent directly to our engineering team for a formal quote.
                          </p>
                      </div>
                  </div>
                </div>
              </div>
              
              <FooterLinks className="hidden md:flex mt-12 md:mt-20" />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CartPage;