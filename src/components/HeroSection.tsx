'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

// Build a Cloudinary still-frame URL from a video URL by injecting the
// start-offset transform and swapping the extension. so_2.5 grabs a
// mid-action frame so the poster is representative of the clip rather
// than landing on a black opening frame.
function getVideoPoster(videoSrc: string, seconds = 2.5): string {
  return videoSrc
    .replace(/(\/q_auto,f_auto)\//, `$1,so_${seconds}/`)
    .replace(/\.mp4$/, ".jpg");
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const videoSlides = [
    {
      title: "MASSIVE",
      subtitle: "POWER LOADS",
      description: "Engineering heavy-duty electrical infrastructure for Pakistan's industrial sectors since 1996.",
      stat: "3000",
      unit: "KVA",
   videoSrc: "https://res.cloudinary.com/dlrpyl28f/video/upload/q_auto,f_auto/v1775860937/slide-2_y6nvfg.mp4",
    },
    {
      title: "ZERO",
      subtitle: "DOWNTIME",
      description: "Seamless 24/7 power management with Tier-1 reliability and real-time monitoring.",
      stat: "99.9", 
      unit: "UPTIME",
      videoSrc: "https://res.cloudinary.com/dlrpyl28f/video/upload/q_auto,f_auto/v1775860873/slide-3_fzwcxo.mp4",
    },
    {
      title: "EXPERT",
      subtitle: "ENGINEERING",
      description: "Lahore-based expertise delivering international standards in power distribution.",
      stat: "TIER-1",
      unit: "ASSETS",
      videoSrc: "https://res.cloudinary.com/dlrpyl28f/video/upload/q_auto,f_auto/v1775860789/slide9_nbmytg.mp4",
    },
  ];

  const brandLogos = [
    { name: "Perkins", src: "/images/brands/perkins.png", isBlack: false, isLarge: false },
    { name: "Cummins", src: "/images/brands/cummins.png", isBlack: false, isLarge: false },
    { name: "Stamford", src: "/images/brands/stamford.png", isBlack: false, isLarge: false },
    { name: "LKE", src: "/images/brands/lke.jpeg", isBlack: false, isLarge: true },
    { name: "Kubota", src: "/images/brands/kubota.png", isBlack: false, isLarge: false }, 
    { name: "ABB", src: "/images/brands/abb.jpeg", isBlack: false, isLarge: false },
    { name: "Baudouin", src: "/images/brands/baudouin.png", isBlack: true, isLarge: true },
    { name: "Honda", src: "/images/brands/honda.jpeg", isBlack: false, isLarge: false },
    { name: "Longi", src: "/images/brands/longi.svg", isBlack: false, isLarge: true },
    { name: "Energizer", src: "/images/brands/energizer.jpeg", isBlack: false, isLarge: false },
    { name: "Jinko Solar", src: "/images/brands/jinko.svg", isBlack: false, isLarge: true },
    { name: "qc", src: "/images/brands/quanchai.jpeg", isBlack: false, isLarge: true },
    { name: "Canadian Solar", src: "/images/brands/canadian.png", isBlack: false, isLarge: true },
    { name: "Elemax", src: "/images/brands/elemax.jpeg", isBlack: false, isLarge: false },
    { name: "JA Solar", src: "/images/brands/jasolar.png", isBlack: false, isLarge: false },
    { name: "ls", src: "/images/brands/ls.jpeg", isBlack: false, isLarge: false },
    { name: "Trina Solar", src: "/images/brands/trina.png", isBlack: false, isLarge: false },
    { name: "Inverex", src: "/images/brands/inverex.png", isBlack: false, isLarge: true },
    { name: "Growatt", src: "/images/brands/growatt.png", isBlack: false, isLarge: false },
    { name: "Solis", src: "/images/brands/solis.png", isBlack: false, isLarge: false },
    { name: "Nitrox", src: "/images/brands/nitrox.svg", isBlack: true, isLarge: true },
    { name: "Dukas", src: "/images/brands/dukas.svg", isBlack: false, isLarge: true },
    { name: "Schneider", src: "/images/brands/schneider.png", isBlack: false, isLarge: false },
    { name: "APC", src: "/images/brands/apc.png", isBlack: false, isLarge: false },
    { name: "lv", src: "/images/brands/lv.jpeg", isBlack: false, isLarge: true },
    { name: "Dari", src: "/images/brands/dari.svg", isBlack: false, isLarge: false },
    { name: "Yangdong", src: "/images/brands/yangdong.png", isBlack: false, isLarge: true },
    { name: "puma", src: "/images/brands/puma.png", isBlack: false, isLarge: false },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % videoSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, videoSlides.length]);

  return (
    <section className="relative w-full h-[100dvh] bg-[#050505] overflow-hidden flex flex-col font-sans">
      
      {/* 1. BACKGROUND LAYERS */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
<video
  key={currentSlide}
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  poster={getVideoPoster(videoSlides[currentSlide].videoSrc)}
  className="w-full h-full object-cover grayscale-[20%]"
  src={videoSlides[currentSlide].videoSrc}
/>
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
      </div>

      {/* 2. MAIN CONTENT GRID */}
      {/* Reduced pt-32 to pt-24 and removed h-full to prevent pushing bottom content out */}
      <div className="container relative z-20 mx-auto px-6 flex flex-col justify-center flex-grow pt-24 md:pt-28">
        
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* LEFT SIDE: Text Content */}
          <div className="flex flex-col items-start lg:pl-12">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-[2px] bg-red-600" />
              <span className="text-[10px] md:text-[12px] font-black tracking-[0.4em] text-red-600 uppercase">
                ESTABLISHED 1996
              </span>
            </motion.div>

            <div className="mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-[14vw] md:text-[9vw] lg:text-[7.5vw] font-black text-white leading-[0.8] tracking-tighter uppercase">
                    {videoSlides[currentSlide].title}
                  </h1>
                  <h2 className="text-[10vw] md:text-[5vw] lg:text-[4vw] font-bold text-neutral-500 leading-none uppercase mt-2">
                    {videoSlides[currentSlide].subtitle}
                  </h2>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.p 
              className="text-[14px] md:text-lg text-neutral-400 max-w-md leading-relaxed mb-8 border-l-2 border-red-600/30 pl-6"
            >
              {videoSlides[currentSlide].description}
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/inventory" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-none bg-red-600 hover:bg-red-700 text-white h-14 md:h-16 px-12 text-[11px] font-black tracking-[0.3em] transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] border-none">
                  VIEW CATALOG
                </Button>
              </Link>
              <Button 
                variant="outline" 
                asChild 
                className="w-full sm:w-auto rounded-none bg-transparent border-white/20 text-white h-14 md:h-16 px-12 text-[11px] font-black tracking-[0.3em] hover:bg-white hover:text-black"
              >
                <a href="tel:+923008112242">CONTACT US</a>
              </Button>
            </div>

            {/* BRAND LOGOS - Adjusted mt-16 to mt-12 to save space */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 w-full hidden md:block"
            >
              <p className="text-[9px] font-black tracking-[0.4em] text-neutral-500 uppercase mb-4 flex items-center gap-4">
                Authorized Engineering Partners <span className="h-[1px] w-12 bg-neutral-800"></span>
              </p>
              
              <div className="relative flex overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                <motion.div 
                  className="flex items-center gap-x-16 whitespace-nowrap"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ 
                    ease: "linear", 
                    duration: 50, 
                    repeat: Infinity 
                  }}
                >
                  {[...brandLogos, ...brandLogos].map((brand, index) => (
                    <div key={`${brand.name}-${index}`} className="relative h-8 w-24 flex-shrink-0">
                      <Image
                        src={brand.src}
                        alt={brand.name}
                        fill
                        className={`object-contain transition-transform duration-300 
                          ${brand.isBlack ? 'invert brightness-200' : ''} 
                          ${brand.isLarge ? 'scale-110' : 'scale-90'}`}
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE: Operational Metric */}
          <div className="hidden lg:flex flex-col items-end pr-12 text-right">
              <motion.div
                key={`metric-${currentSlide}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                 <div className="flex items-center justify-end gap-3 mb-4">
                   <span className="text-[11px] font-black text-neutral-500 tracking-[0.4em] uppercase">Performance Rating</span>
                   <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                 </div>
                 <div className="text-[8vw] font-black text-white leading-none tracking-tighter flex items-baseline justify-end gap-4">
                   {videoSlides[currentSlide].stat}
                   <span className="text-red-600 text-2xl uppercase tracking-[0.2em]">{videoSlides[currentSlide].unit}</span>
                 </div>
                 <div className="mt-6 h-[1px] w-32 bg-gradient-to-l from-red-600 to-transparent ml-auto" />
              </motion.div>
          </div>
        </div>
      </div>

      {/* 3. SHARED FOOTER NAV */}
      <div className="relative pb-8 left-0 w-full px-6 md:px-12 flex justify-between items-end z-30">
        <div className="lg:hidden flex flex-col gap-1">
          <span className="text-[8px] font-bold text-neutral-500 tracking-widest uppercase text-left">Capacity</span>
          <div className="text-2xl font-black text-white text-left">
            {videoSlides[currentSlide].stat} 
            <span className="text-red-600 text-[10px] ml-1 uppercase">{videoSlides[currentSlide].unit}</span>
          </div>
        </div>

        <div className="flex gap-4 md:gap-8 ml-auto">
          {videoSlides.map((_, i) => (
            <button 
              key={i}
              onClick={() => { setCurrentSlide(i); setIsPlaying(false); }}
              className="flex flex-col items-end group"
            >
              <span className={`text-[10px] font-black mb-2 transition-all ${currentSlide === i ? 'text-red-600' : 'text-white/20'}`}>0{i + 1}</span>
              <div className={`h-[2px] transition-all duration-700 ${currentSlide === i ? 'w-12 md:w-24 bg-red-600' : 'w-4 bg-white/10 group-hover:bg-white/30'}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}