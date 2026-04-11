'use client';

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteQuoteAction } from "@/lib/actions/quote";
import { toast } from "@/hooks/use-toast";

export function DeleteQuoteButton({ quoteId }: { quoteId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("PURGE RECORD: Are you sure you want to delete this manifest?")) return;

    setIsDeleting(true);
    const result = await deleteQuoteAction(quoteId);

    if (result.success) {
      toast({ title: "RECORD_PURGED", description: "Manifest removed from archive." });
    } else {
      toast({ title: "ERROR", description: "Failed to delete record.", variant: "destructive" });
      setIsDeleting(false);
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-[0.2em] hover:text-red-500 transition-colors disabled:opacity-50"
    >
      {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
      Purge Record
    </button>
  );
}