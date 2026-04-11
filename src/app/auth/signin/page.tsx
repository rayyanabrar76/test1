'use client';

import React, { Suspense, useEffect } from 'react';
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * STRIPPED-DOWN AUTH FALLBACK
 * This handles system redirects without showing the redundant generic page.
 */
function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams?.get("error");
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  useEffect(() => {
    // If there's no error, just push them back to the callback or home 
    // where they can use the Header Modal.
    if (!error) {
      router.push(callbackUrl);
    }
  }, [error, callbackUrl, router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <img src="/aps-logo.png" alt="APS" className="h-12 w-auto mb-8 opacity-50 grayscale" />
      
      {error ? (
        <div className="space-y-4">
          <p className="text-red-600 text-[10px] font-black uppercase tracking-[0.3em]">System_Auth_Error</p>
          <p className="text-white/40 text-[9px] uppercase tracking-widest max-w-xs leading-loose">
            The authentication session has expired or the link is invalid.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            Return to Terminal
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-red-600/50" size={24} />
          <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-white/20">Re-routing to System...</span>
        </div>
      )}
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  );
}