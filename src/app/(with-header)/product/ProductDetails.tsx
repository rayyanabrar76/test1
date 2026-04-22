"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { useCart } from "@/hooks/useCart";
import { toast } from "@/hooks/use-toast";
import Image from 'next/image';
import {
  MessageCircle,
  ArrowLeft,
  Settings,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  FileText,
  ExternalLink,
  Zap,
  Plus,
  Box,
} from "lucide-react";
import { Product } from "@/types/store";

interface Props {
  product: Product;
  // ✅ NEW PROPS
  relatedProducts?: Product[];
  fallbackUrl?: string;
}

function ProductContent({ product, relatedProducts = [], fallbackUrl = "/inventory" }: Props) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [activeView, setActiveView] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isQuoteAdded, setIsQuoteAdded] = useState(false);

  // ✅ NEW: track whether user came from within the site
  const [cameFromSite, setCameFromSite] = useState(false);

  useEffect(() => {
    const referrer = document.referrer;
    const isFromSite =
      referrer.includes("apspower.vercel.app") ||
      referrer.includes("aps.com.pk");
    setCameFromSite(isFromSite);
  }, []);

  // ✅ NEW: smart return handler
  const handleReturn = () => {
    if (cameFromSite) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  const displayImages = product?.gallery?.length
    ? product.gallery
    : product?.image
    ? [product.image]
    : [];

  const SLIDE_DURATION = 5000;

  const nextSlide = useCallback(() => {
    setActiveView((prev) => (prev + 1) % displayImages.length);
  }, [displayImages.length]);

  const prevSlide = useCallback(() => {
    setActiveView(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    );
  }, [displayImages.length]);

  const handleDragEnd = (_e: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      prevSlide();
    } else if (info.offset.x < -swipeThreshold) {
      nextSlide();
    }
  };

  useEffect(() => {
    if (isFullscreen || isPaused || displayImages.length <= 1) return;
    const interval = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [isFullscreen, isPaused, nextSlide, displayImages.length]);

  if (!product) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: displayImages,
    description: product.description,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: "APS Industrial Asset",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      price: "0",
    },
  };

  // @ts-ignore
  const productBadges = product.badges || [];
  const tableData = product.metadata?.table_data as any[] | undefined;
  const techDetails = product.metadata?.technical_details as
    | Record<string, string>
    | undefined;

  const technicalDetails = product.metadata
    ? Object.entries(product.metadata).filter(
        ([key]) =>
          ![
            "slug",
            "metaTitle",
            "metaDescription",
            "table_data",
            "technical_details",
          ].includes(key)
      )
    : [];

  // Only show models that have a corresponding PDF link
  const hasAnyModelPdf =
    tableData &&
    tableData.length > 0 &&
    product.pdf_links &&
    product.pdf_links.some(Boolean);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans antialiased selection:bg-white selection:text-black overflow-x-hidden">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-[110] flex items-center justify-center max-w-full max-h-full"
            >
              <motion.img
                src={displayImages[activeView]}
                alt={`${product.name} technical view`}
                whileTap={{ scale: 1.1 }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.8}
                className="max-w-full max-h-[90vh] object-contain"
                style={{ touchAction: "none" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container max-w-7xl pt-28 md:pt-32 pb-32 md:pb-20 px-4 md:px-8 mx-auto">
        {/* ✅ UPDATED: smart return button */}
        <button
          onClick={handleReturn}
          className="flex items-center gap-2 mb-6 md:mb-12 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-white/40 hover:text-white transition-colors group relative z-10"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Return
        </button>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* LEFT: IMAGE GALLERY */}
          <div className="lg:col-span-7 w-full flex flex-col gap-6 md:gap-8">
            <div
              className="relative w-full flex items-center justify-center overflow-hidden group"
              style={{
                touchAction: displayImages.length > 1 ? "pan-y" : "auto",
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeView}
                  src={displayImages[activeView]}
                  alt={product.name}
                  drag={displayImages.length > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={handleDragEnd}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`w-full h-auto max-h-[70vh] object-contain ${
                    displayImages.length > 1
                      ? "cursor-grab active:cursor-grabbing"
                      : "cursor-default"
                  }`}
                  onClick={() => setIsFullscreen(true)}
                />
              </AnimatePresence>

              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-4 text-black/20 hover:text-black transition-all z-20"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-black/20 hover:text-black transition-all z-20"
                  >
                    <ChevronRight size={32} />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 items-center pointer-events-none">
                    {displayImages.map((_, i) => (
                      <div
                        key={i}
                        className={`transition-all duration-300 rounded-full ${
                          activeView === i
                            ? "w-6 h-0.5 bg-white"
                            : "w-1 h-0.5 bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {displayImages.length > 1 && (
              <div className="flex gap-4 mt-2 overflow-x-auto pb-4 md:pb-2 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                {displayImages.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveView(i);
                      setIsPaused(true);
                    }}
                    className={`relative flex-shrink-0 transition-all ${
                      activeView === i
                        ? "opacity-100 scale-105"
                        : "opacity-20 hover:opacity-50"
                    }`}
                  >
               <Image
  src={img}
  className="h-16 w-auto object-contain"
  alt="thumbnail"
  width={64}
  height={64}
/>
  </button>
))}
</div>
)}
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="lg:col-span-5 flex flex-col pt-4 lg:pt-0 w-full justify-start">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-[9px] font-bold text-green-500 uppercase tracking-widest">
                Available
              </span>
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-mono">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter uppercase italic leading-tight">
              {product.name}
            </h1>
            <p className="text-sm md:text-lg text-white/60 font-light leading-relaxed mb-6">
              {product.description}
            </p>

            {productBadges.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {productBadges.map((badge: string, i: number) => (
                    <div
                      key={i}
                      className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-0.5 group hover:bg-white/[0.05] transition-colors"
                    >
                      <p className="text-[8px] sm:text-[10px] text-white/50 uppercase font-black tracking-widest flex items-center gap-1.5">
                        <Zap size={8} className="text-yellow-500/80 sm:w-2.5 sm:h-2.5" />
                        Feature
                      </p>
                      <p className="text-xs sm:text-base font-bold truncate text-white/90">
                        {badge}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTION BUTTONS: DESKTOP */}
            <div className="hidden lg:flex flex-col gap-3 mb-6">
              <div className="flex gap-3 w-full">
                <motion.button
                  onClick={() => {
                    setIsRedirecting(true);
                    // @ts-ignore
                    addToCart({ ...product, productId: product.id });
                    setTimeout(() => router.push("/cart"), 400);
                  }}
                  whileHover={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                  whileTap={{ scale: 0.97 }}
                  animate={{
                    backgroundColor: isRedirecting ? "#dc2626" : "#ffffff",
                    color: isRedirecting ? "#ffffff" : "#000000",
                  }}
                  className="flex-1 h-14 md:h-16 transition-all rounded-2xl flex items-center justify-center gap-3 text-sm md:text-lg font-black uppercase tracking-tight shadow-xl"
                >
                  <AnimatePresence mode="wait">
                    {isRedirecting ? (
                      <motion.div
                        key="redirect"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        Processing...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3"
                      >
                        <MessageCircle size={20} /> Get A Quote
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  onClick={() => {
                    if (isQuoteAdded) return;
                    // @ts-ignore
                    addToCart({ ...product, productId: product.id });
                    setIsQuoteAdded(true);
                    toast({ title: "Added to Quote List" });
                    setTimeout(() => setIsQuoteAdded(false), 3000);
                  }}
                  whileHover={
                    !isQuoteAdded
                      ? {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        }
                      : {}
                  }
                  whileTap={{ scale: 0.95 }}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border flex items-center justify-center transition-all ${
                    isQuoteAdded
                      ? "bg-white text-black border-white"
                      : "bg-white/[0.03] border-white/10 text-white/70"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isQuoteAdded ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <CheckCircle2 size={24} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="plus"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Plus size={24} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>

            {techDetails && (
              <div className="flex flex-col divide-y divide-white/5 border-t border-white/5">
                {Object.entries(techDetails).map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between py-4 items-center group hover:bg-white/[0.02] px-2 transition-colors"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                      {label}
                    </span>
                    <span className="text-sm font-medium text-white/90">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {product.pdf_link && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <a
                  // @ts-ignore
                  href={product.pdf_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-600/90 text-white shadow-lg">
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50 uppercase font-black tracking-widest">
                      Resources
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                      Download Datasheet
                    </span>
                  </div>
                  <ExternalLink
                    size={14}
                    className="ml-auto text-white/20 group-hover:text-white/40 transition-colors"
                  />
                </a>
              </motion.div>
            )}

            {/* BOTTOM SECTION */}
            <div className="mt-6 pt-6 border-t border-white/10 pb-28 lg:pb-10">
              {hasAnyModelPdf ? (
                <>
                  <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 text-white/40">
                    <Box size={14} /> Available Models
                  </h3>
                  <div className="space-y-1">
                    {tableData!.map((row, idx) =>
                      product.pdf_links?.[idx] ? (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row justify-between py-5 border-b border-white/[0.04] group hover:bg-white/[0.01] transition-colors px-2 sm:items-center gap-3"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] font-black uppercase tracking-widest text-white">
                              {row.Model}
                            </span>
                            <span className="text-[10px] text-white/30 uppercase font-medium">
                              {Object.entries(row)
                                .filter(([k]) => k !== "Model")
                                .map(([k, v]) => `${k}: ${v}`)
                                .join("  |  ")}
                            </span>
                          </div>
                          <a
                            href={product.pdf_links[idx]}
                            target="_blank"
                            className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-red-500 transition-colors"
                          >
                            Download <ExternalLink size={10} />
                          </a>
                        </div>
                      ) : null
                    )}
                  </div>
                </>
              ) : (
                technicalDetails.length > 0 && (
                  <>
                    <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 text-white/40">
                      <Settings size={14} /> More Details
                    </h3>
                    <div className="space-y-1">
                      {technicalDetails.map(([key, val], i) => (
                        <div
                          key={i}
                          className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-4 border-b border-white/[0.04] group hover:bg-white/[0.01] transition-colors"
                        >
                          <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest sm:col-span-1">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-white/90 sm:col-span-2 leading-relaxed">
                            {val?.toString().replace(/_/g, " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>

        {/* ✅ NEW: RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                Related Products
              </h2>
              <button
                onClick={() => router.push(fallbackUrl)}
                className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors flex items-center gap-1.5"
              >
                View All <ExternalLink size={10} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {relatedProducts.map((rp) => (
                <button
                  key={rp.id}
                  onClick={() => router.push(`/product/${rp.id}`)}
                  className="group flex flex-col gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all text-left"
                >
                  {rp.image && (
                    <div className="w-full aspect-square flex items-center justify-center overflow-hidden rounded-xl bg-white/[0.02]">
                      <Image
                        src={rp.image}
                        alt={rp.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/30">
                      {rp.category}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-tight text-white/80 group-hover:text-white transition-colors line-clamp-2">
                      {rp.name}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover:text-white/40 transition-colors flex items-center gap-1 mt-auto">
                    View <ChevronRight size={10} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MOBILE STICKY ACTIONS */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 pb-8 bg-black/80 backdrop-blur-xl border-t border-white/10 z-50">
        <div className="flex gap-3 max-w-lg mx-auto">
          <motion.button
            onClick={() => {
              setIsRedirecting(true);
              // @ts-ignore
              addToCart({ ...product, productId: product.id });
              setTimeout(() => router.push("/cart"), 400);
            }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 h-14 bg-white text-black rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-tight"
          >
            {isRedirecting ? (
              "Connecting..."
            ) : (
              <>
                <MessageCircle size={20} /> Get Quote
              </>
            )}
          </motion.button>

          <motion.button
            onClick={() => {
              if (isQuoteAdded) return;
              // @ts-ignore
              addToCart({ ...product, productId: product.id });
              setIsQuoteAdded(true);
              toast({ title: "Added to Quote List" });
              setTimeout(() => setIsQuoteAdded(false), 3000);
            }}
            whileTap={{ scale: 0.95 }}
            className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${
              isQuoteAdded
                ? "bg-white text-black border-white"
                : "bg-white/5 border-white/10 text-white/70"
            }`}
          >
            {isQuoteAdded ? <CheckCircle2 size={24} /> : <Plus size={24} />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsClient({ product, relatedProducts, fallbackUrl }: Props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <ProductContent product={product} relatedProducts={relatedProducts} fallbackUrl={fallbackUrl} />
    </Suspense>
  );
}