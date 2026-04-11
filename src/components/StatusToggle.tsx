'use client';

import { useState } from "react";
import { updateQuoteStatusAction } from "@/lib/actions/quote";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2, Clock, Truck, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const OPTIONS = [
  { label: "pending", icon: Clock },
  { label: "approved", icon: CheckCircle2 },
  { label: "shipped", icon: Truck },
  { label: "cancelled", icon: XCircle },
];

export function StatusToggle({ quoteId, currentStatus }: { quoteId: string, currentStatus: string }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpdate = async (status: string) => {
    setLoading(status);
    const result = await updateQuoteStatusAction(quoteId, status);
    
    if (result?.success) {
      toast({
        title: "SYSTEM_UPDATED",
        description: `Manifest ${quoteId.slice(-6)} set to ${status.toUpperCase()}`,
      });
    } else {
      toast({
        title: "SYNC_ERROR",
        description: "Failed to update terminal status.",
        variant: "destructive",
      });
    }
    setLoading(null);
  };

  return (
    <div className="flex gap-1 bg-white/5 p-1 border border-white/10">
      {OPTIONS.map((opt) => (
        <button
          key={opt.label}
          disabled={loading !== null}
          onClick={() => handleUpdate(opt.label)}
          className={cn(
            "px-3 py-1.5 text-[8px] font-black tracking-tighter transition-all uppercase flex items-center gap-2 relative border border-transparent",
            currentStatus === opt.label 
              ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)] border-red-500" 
              : "text-white/20 hover:text-white/60 hover:bg-white/5"
          )}
        >
          {loading === opt.label ? (
            <Loader2 size={10} className="animate-spin" />
          ) : (
            <>
              <opt.icon size={10} className={currentStatus === opt.label ? "text-white" : "text-white/10"} />
              {opt.label}
            </>
          )}
        </button>
      ))}
    </div>
  );
}