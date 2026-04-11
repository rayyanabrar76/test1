import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { 
  ShieldCheck, 
  ArrowLeft,
  CheckCircle2,
  Activity
} from "lucide-react";
import Link from "next/link";
// Import your new Client Componen

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuotePage({ params }: PageProps) {
  // 1. Await params and session in parallel
  const [resolvedParams, session] = await Promise.all([
    params,
    auth()
  ]);

  const { id } = resolvedParams;

  // 2. Ensure user is authenticated
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  // 3. Fetch quote and include the user relation
  const quote = await prisma.quote.findUnique({
    where: { id: id },
    include: { user: true }
  });

  // 4. Verify existence and ownership
  if (!quote || quote.userId !== session.user.id) {
    notFound();
  }

  // Helper to safely handle the JSON items from Prisma
  const manifestItems = (quote.items as any[]) || [];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Success Header */}
        <div className="mb-12 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-red-600/10 border border-red-600/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="text-red-600 w-8 h-8 animate-in zoom-in duration-500" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-serif italic tracking-tighter uppercase">Manifest Logged</h1>
            <div className="flex items-center justify-center gap-2 text-green-500/50">
              <Activity size={10} />
              <p className="text-[7px] font-mono uppercase tracking-[0.3em]">Cloud Sync Verified</p>
            </div>
          </div>
          <p className="text-white/40 font-mono text-[10px] tracking-[0.3em] uppercase pt-2">
            TRANS_ID: {quote.id}
          </p>
        </div>

        {/* Main Status Card */}
        <div className="border border-white/10 bg-white/[0.02] overflow-hidden backdrop-blur-sm">
          <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-red-600 w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Deployment Status</span>
            </div>
            <span className="px-3 py-1 bg-red-600 text-[9px] font-black uppercase tracking-widest italic">
              {quote.status.replace('_', ' ')}
            </span>
          </div>

          <div className="p-8 space-y-8">
            {/* User Info */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-[8px] font-mono uppercase text-white/20 block mb-2 tracking-widest">Operator_Ref</label>
                <p className="text-sm font-bold uppercase">{quote.user?.name || "Anonymous Operator"}</p>
                <p className="text-[10px] text-white/40 font-mono">{quote.user?.email}</p>
              </div>
              <div className="text-right">
                <label className="text-[8px] font-mono uppercase text-white/20 block mb-2 tracking-widest">Timestamp</label>
                <p className="text-sm font-bold uppercase">
                  {new Date(quote.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
                <p className="text-[10px] text-white/40 italic">
                  {new Date(quote.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Items List */}
            <div>
              <label className="text-[8px] font-mono uppercase text-white/20 block mb-4 tracking-widest border-b border-white/5 pb-2">
                Inventory Manifest Contents
              </label>
              <div className="space-y-4">
                {manifestItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-white/[0.03] pb-3 last:border-0 group">
                    <div className="flex items-center gap-4">
                      <span className="text-red-600 font-mono text-[10px]">[{idx + 1}]</span>
                      <span className="font-bold uppercase tracking-tight group-hover:text-white/80 transition-colors">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                       <span className="font-mono text-white/40 text-[11px]">UNIT_QTY: {item.qty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
              <div>
                <p className="text-[8px] font-mono uppercase text-white/20 tracking-widest mb-1">Estimated Asset Value</p>
                <p className="text-2xl font-black italic tracking-tighter">
                  ${quote.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[7px] text-white/20 uppercase max-w-[200px] leading-relaxed italic">
                  * Final pricing subject to site survey and technical configuration.
                </p>
                <p className="text-[7px] text-red-600/50 uppercase font-black tracking-tighter">
                  Security_Verified_Encrypted
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 no-print">
          <Link 
            href="/" 
            className="flex-1 h-14 border border-white/10 hover:bg-white/[0.05] flex items-center justify-center gap-3 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest">Return to Grid</span>
          </Link>
          
          {/* New Client Component replacing the buggy button */}
          
        </div>

      </div>
      
      {/* Basic Print Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .border { border-color: #eee !important; }
          .text-white\/40 { color: #666 !important; }
        }
      `}} />
    </div>
  );
}