"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { X, Lock, Loader2 } from "lucide-react";

export default function LoginModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
              <Image
                src="/aps-logo.png"
                alt="APS Industries"
                className="h-16 w-auto brightness-125 drop-shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                width={64}
                height={64}
              />
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Secure Access</h2>
              <p className="text-[8px] uppercase tracking-[0.4em] text-red-600/60 font-black mt-2">Authorization Required</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleLogin("google")}
                disabled={!!isLoading}
                className="group w-full flex justify-center items-center py-4 border border-white/5 rounded-2xl bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/[0.05] hover:border-red-900/40 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading === "google" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                ) : (
                  <>
                    <Image
                      src="https://authjs.dev/img/providers/google.svg"
                      className="h-4 w-4 mr-3 grayscale brightness-200 group-hover:grayscale-0 transition-all"
                      alt="G"
                      width={16}
                      height={16}
                    />
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
