"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import {
  X,
  ShoppingBag,
  User,
  ShieldCheck,
  LogOut,
  MessageSquare,
  LayoutDashboard,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SolutionsMenu } from "../SolutionsMenu";

interface MobileMenuDrawerProps {
  onClose: () => void;
  isAuthenticated: boolean;
  isRoot: boolean;
  userName?: string | null;
  userEmail?: string | null;
  displayCount: number;
  hasItems: boolean;
  onCartOpen: () => void;
  onSignInClick: () => void;
}

// Mounted only when the drawer should be open (parent gates).
export default function MobileMenuDrawer({
  onClose,
  isAuthenticated,
  isRoot,
  userName,
  userEmail,
  displayCount,
  hasItems,
  onCartOpen,
  onSignInClick,
}: MobileMenuDrawerProps) {
  return (
    <div className="fixed inset-0 z-[200] lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute top-0 right-0 w-[85%] h-full bg-black/95 backdrop-blur-xl flex flex-col border-l border-white/5 shadow-2xl"
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b-[1px] border-white/[0.03] shrink-0">
              <div className="flex items-center gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", isAuthenticated ? "bg-white shadow-[0_0_5px_white]" : "bg-white/20")} />
                <span className="text-[8px] font-black tracking-widest text-white/40 uppercase italic">{isAuthenticated ? "Signed In" : "Navigation"}</span>
              </div>
              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center border-[1px] border-white/[0.08] rounded-full text-white/40">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 flex flex-col px-8 py-8 overflow-y-auto overscroll-contain">
              {/* USER INFO */}
              <div className="mb-8">
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-2 block">
                  {isRoot ? "Admin" : isAuthenticated ? "Account" : "Get Started"}
                </span>
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-2xl font-black uppercase italic tracking-tighter text-white">
                        {userName?.split(" ")[0]}
                      </span>
                      <span className="text-[10px] text-white/30 mt-0.5">{userEmail}</span>
                    </div>
                    {isRoot ? <ShieldCheck size={24} className="text-red-600 shrink-0" /> : <User size={24} className="text-white/40 shrink-0" />}
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      onClose();
                      onSignInClick();
                    }}
                    className="text-2xl font-black uppercase italic tracking-tighter text-white flex items-center gap-3 cursor-pointer"
                  >
                    <span>Sign In</span>
                    <User size={24} className="text-white shrink-0" />
                  </div>
                )}
              </div>

              {/* ACCOUNT LINKS */}
              {isAuthenticated && (
                <div className="mb-8 border border-white/5 rounded-2xl overflow-hidden">
                  {isRoot && (
                    <Link href="/admin" onClick={onClose} className="flex items-center gap-3 px-5 py-4 bg-red-600/10 border-b border-white/5 hover:bg-red-600 hover:text-white transition-colors group">
                      <ClipboardList size={14} className="text-red-600 group-hover:text-white" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Admin Panel</span>
                    </Link>
                  )}
                  <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3 px-5 py-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                    <LayoutDashboard size={14} className="text-white/40" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">My Inquiries</span>
                  </Link>
                  <Link href="/checkout" onClick={onClose} className="flex items-center gap-3 px-5 py-4 hover:bg-white/5 transition-colors">
                    <MessageSquare size={14} className="text-white/40" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Request a Free Quote</span>
                  </Link>
                </div>
              )}

              {/* NAV LINKS */}
              <div className="flex flex-col justify-center space-y-8 mt-2">
                <div className="h-[1px] w-8 bg-white/10" />
                <Link href="/services" onClick={onClose} className="text-3xl font-black uppercase italic tracking-tighter text-white/90 leading-none">Services</Link>
                <div className="text-3xl font-black uppercase italic tracking-tighter text-white/90 leading-none"><SolutionsMenu /></div>
                <Link href="/company" onClick={onClose} className="text-3xl font-black uppercase italic tracking-tighter text-white/90 leading-none">Company</Link>

                {isAuthenticated && (
                  <>
                    <div className="h-[1px] w-full bg-white/5" />
                    <button
                      onClick={() => {
                        onClose();
                        signOut();
                      }}
                      className="text-3xl font-black uppercase italic tracking-tighter text-red-600/70 leading-none flex items-center gap-4 active:text-red-500 transition-colors text-left"
                    >
                      Sign Out
                      <LogOut size={22} className="shrink-0" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* CART FOOTER */}
            <div
              onClick={() => {
                onClose();
                onCartOpen();
              }}
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
  );
}
