'use client';

import React, { useState, useMemo, useTransition } from "react";
import { 
  Search, 
  XCircle, 
  Loader2, 
  ShoppingCart, 
  Printer, 
  FileText, 
  Wind, 
  Battery, 
  Sun, 
  Settings, 
  Zap, 
  Plus,
  ArrowLeft,
  Hash,
  Copy
} from "lucide-react";
import { deleteQuoteAction } from "@/lib/actions/quote";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const categoryIcons: Record<string, any> = {
  generators: Wind,
  ups: Battery,
  solar: Sun,
  switchgear: Settings,
};

export default function DashboardClientWrapper({ session, myQuotes = [] }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredQuotes = useMemo(() => {
    return myQuotes.filter((quote: any) => {
      const categoryStr = quote.category || 'Standard';
      const searchStr = `${quote.id} ${quote.subject || ''} ${categoryStr}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "all" || (quote.status?.toLowerCase() === activeTab);
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab, myQuotes]);

  const handleCancelRequest = async (quoteId: string) => {
    if (confirm("Are you sure you want to delete this request?")) {
      setDeletingId(quoteId);
      startTransition(async () => {
        try {
          const result = await deleteQuoteAction(quoteId);
          if (result?.error) throw new Error(result.error);
          toast({ title: "Deleted", description: "Your request has been removed." });
        } catch (error: any) {
          toast({ title: "Error", description: "Could not delete at this time.", variant: "destructive" });
        } finally {
          setDeletingId(null);
        }
      });
    }
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({ title: "Copied", description: "Reference ID saved to clipboard." });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
        <div className="space-y-4">
          <button 
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Go Back</span>
          </button>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Inquiry History</h1>
            <p className="text-[10px] text-white/30 font-mono mt-2 tracking-[0.2em]">
              Operator: {session?.user?.name || 'User'} // Viewing personal manifest
            </p>
          </div>
        </div>
        <button 
          onClick={() => window.location.href = '/checkout'}
          className="bg-white text-black px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-gray-200 transition-all"
        >
          <Plus size={14} /> Start New Inquiry
        </button>
      </div>

      {/* FILTER TERMINAL */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02] p-4 border border-white/5">
        <div className="flex items-center bg-black px-4 py-2 w-full md:w-96 border border-white/10 group focus-within:border-white/40">
          <Search className="text-white/20" size={14} />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, product, or category..."
            className="bg-transparent border-none text-[10px] p-2 w-full focus:ring-0 text-white placeholder:text-white/10 uppercase"
          />
        </div>
        <div className="flex bg-black border border-white/10 p-1">
          {['all', 'pending', 'approved'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={cn(
                "px-6 py-2 text-[9px] font-black uppercase tracking-widest transition-all",
                activeTab === tab ? "bg-white text-black" : "text-white/30 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {filteredQuotes.length > 0 ? filteredQuotes.map((quote: any) => {
          const categoryKey = quote.category?.toLowerCase() || 'standard';
          const CategoryIcon = categoryIcons[categoryKey] || FileText;
          const hasItems = quote.items && quote.items.length > 0;
          
          // DYNAMIC TITLE LOGIC
          const displayTitle = hasItems 
            ? `${quote.items[0].name}${quote.items.length > 1 ? ` (+${quote.items.length - 1} more)` : ''}`
            : (quote.category || "Inquiry");

          return (
            <div key={quote.id} className={cn(
              "group border transition-all duration-500",
              expandedId === quote.id ? "bg-[#0a0a0a] border-white" : "bg-[#050505] border-white/5 hover:border-white/20"
            )}>
              <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-8 w-full md:w-auto">
                  <div className={cn(
                    "h-14 w-14 flex-shrink-0 flex items-center justify-center border transition-all duration-500",
                    expandedId === quote.id ? "border-white bg-white text-black" : "border-white/10 text-white/20"
                  )}>
                    <CategoryIcon size={22} strokeWidth={1} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1 truncate">
                      {displayTitle}
                    </h4>
                    <div className="flex items-center gap-4 text-[9px] text-white/40 uppercase tracking-widest">
                      <span>Cat: {quote.category || "General"}</span>
                      <span className="opacity-30">•</span>
                      <span>Date: {new Date(quote.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-10 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-[8px] text-white/20 uppercase font-black mb-1">Status</p>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                      quote.status === 'approved' ? 'text-green-500' : 'text-amber-500'
                    )}>
                      {quote.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {quote.status === "pending" && (
                      <button 
                        onClick={() => handleCancelRequest(quote.id)}
                        className="text-white/20 hover:text-red-500 transition-colors p-2"
                        disabled={isPending && deletingId === quote.id}
                      >
                        {isPending && deletingId === quote.id ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={18} />}
                      </button>
                    )}
                    <button 
                      onClick={() => setExpandedId(expandedId === quote.id ? null : quote.id)}
                      className={cn(
                        "px-6 py-2 text-[9px] font-black uppercase tracking-widest transition-all border",
                        expandedId === quote.id ? "bg-white text-black border-white" : "bg-transparent text-white border-white/10 hover:border-white"
                      )}
                    >
                      {expandedId === quote.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>
              </div>

              {/* EXPANDED DETAILS */}
              {expandedId === quote.id && (
                <div className="p-10 border-t border-white/10 grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in slide-in-from-top-4 duration-500">
                  <div className="lg:col-span-2 space-y-8">
                    
                    {/* REFERENCE ID BOX */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                        <Hash size={14} /> Reference ID
                      </p>
                      <div className="bg-black border border-white/10 p-4 flex items-center justify-between group/id">
                        <code className="text-xs font-mono text-emerald-500 tracking-tighter">{quote.id}</code>
                        <button 
                          onClick={() => copyId(quote.id)}
                          className="text-white/20 hover:text-white transition-colors flex items-center gap-2 text-[9px] font-bold uppercase"
                        >
                          <Copy size={12} /> Copy ID
                        </button>
                      </div>
                    </div>

                    {hasItems && (
                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                          <ShoppingCart size={14} /> Products List
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {quote.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center p-4 border border-white/5 bg-black">
                              <span className="text-[11px] font-bold text-white uppercase">{item.name}</span>
                              <span className="text-[10px] font-mono text-emerald-500 uppercase">Quantity: {item.qty}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!hasItems && (
                      <div className="pt-4 border-l-2 border-white/10 pl-6">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Inquiry Type</p>
                        <p className="text-[11px] text-white/60 mt-2">Requesting details for the {quote.category} category.</p>
                      </div>
                    )}
                  </div>

                  {/* SUMMARY BOX */}
                  <div className="space-y-6">
                    <div className="p-6 border border-white/10 bg-black">
                      <p className="text-[9px] font-black text-white/40 uppercase mb-6 tracking-widest border-b border-white/5 pb-2">Information Summary</p>
                      <div className="space-y-4 text-[10px] uppercase">
                        <div className="flex justify-between">
                          <span className="text-white/20">Category</span>
                          <span className="font-bold text-white">{quote.category || "General"}</span>
                        </div>
                        <div className="flex justify-between border-t border-white/5 pt-4">
                          <span className="text-white/20">Estimated Total</span>
                          <span className="font-mono text-emerald-500 font-bold">
                            {quote.total > 0 ? `${quote.total.toLocaleString()} PKR` : "Price Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => window.print()} 
                      className="w-full py-4 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
                    >
                      <Printer size={12} /> Save or Print Page
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        }) : (
          <div className="py-20 border border-dashed border-white/10 flex flex-col items-center justify-center opacity-20">
            <FileText size={48} strokeWidth={0.5} className="mb-4" />
            <p className="text-[10px] font-mono uppercase tracking-widest">No inquiries found.</p>
          </div>
        )}
      </div>
    </div>
  );
}