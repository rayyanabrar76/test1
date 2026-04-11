"use client"; // This tells Next.js this is a Client Component

import { FileText } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex-1 h-14 bg-white text-black flex items-center justify-center gap-3 hover:invert transition-all"
    >
      <FileText className="w-4 h-4" />
      <span className="text-[10px] font-black uppercase tracking-widest">Generate Hardcopy</span>
    </button>
  );
}