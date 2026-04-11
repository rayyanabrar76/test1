'use client';

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Sun, Battery, Wind, ArrowRight, Activity, ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  {
    title: "Generators",
    range: "1kVA – 3000kVA",
    spec: "Petrol/Gas/Diesel",
    description: "Industrial power backup with copper winding and reliable engines.",
    icon: <Zap className="w-5 h-5 md:w-6 md:h-6" />,
    color: "group-hover:text-red-600",
    action: "View Inventory",
    video: "https://res.cloudinary.com/dlrpyl28f/video/upload/v1775860873/slide-3_fzwcxo.mp4",
    href: "/inventory/generators"
  },
  {
    title: "Solar Energy",
    range: "Tier-1 Panels",
    spec: "Hybrid Systems",
    description: "Complete systems with net metering support. JA, Longi, Canadian Solar.",
    icon: <Sun className="w-5 h-5 md:w-6 md:h-6" />,
    color: "group-hover:text-amber-500",
    action: "View Inventory",
    video: "https://res.cloudinary.com/dlrpyl28f/video/upload/v1775860789/slide9_nbmytg.mp4",
    href: "/inventory/solar"
  },
  {
    title: "UPS Systems",
    range: "1KVA – 1100kVA",
    spec: "Pure Sine Wave",
    description: "Seamless power backup for sensitive IT equipment and modern homes.",
    icon: <Battery className="w-5 h-5 md:w-6 md:h-6" />,
    color: "group-hover:text-blue-500",
    action: "View Inventory",
    video: "https://res.cloudinary.com/dlrpyl28f/video/upload/v1775861051/slide11_niieou.mp4",
    href: "/inventory/ups"
  },
  {
    title: "Air Compressors",
    range: "Piston & Screw",
    spec: "Industrial Grade",
    description: "Atlas Copco & Ingersoll Rand quality for factories and workshops.",
    icon: <Wind className="w-5 h-5 md:w-6 md:h-6" />,
    color: "group-hover:text-emerald-500",
    action: "View Inventory",
    video: "https://res.cloudinary.com/dlrpyl28f/video/upload/v1775861060/slide10_jllas2.mp4",
    href: "/inventory/aircompressor"
  },
  {
    title: "Electrical Switchgear",
    range: "Industrial Grade",
    spec: "High Voltage",
    description: "Precision engineering for industrial power distribution systems.",
    icon: <Activity className="w-5 h-5 md:w-6 md:h-6" />,
    color: "group-hover:text-emerald-500",
    action: "View Inventory",
    video: "https://res.cloudinary.com/dlrpyl28f/video/upload/v1775861067/slide12_slivw0.mp4",
    href: "/inventory/panels"
  }
];

function CategoryCard({ cat, idx }: { cat: typeof categories[0], idx: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobileActive, setIsMobileActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (window.innerWidth < 768) {
          setIsMobileActive(entry.isIntersecting);
          if (entry.isIntersecting) videoRef.current?.play().catch(() => {});
          else videoRef.current?.pause();
        }
      },
      { threshold: 0.6 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const isActive = isMobileActive || isHovered;

  return (
    <div 
      ref={cardRef}
      onMouseEnter={() => { setIsHovered(true); videoRef.current?.play().catch(() => {}); }}
      onMouseLeave={() => { setIsHovered(false); videoRef.current?.pause(); }}
      className="min-w-[80%] sm:min-w-[50%] md:min-w-[33%] lg:min-w-[25%] snap-start snap-always select-none will-change-transform"
    >
      <div className="group/card relative p-5 md:p-8 border-[0.5px] border-white/10 bg-[#080808] md:bg-transparent hover:bg-black transition-all duration-500 overflow-hidden min-h-[340px] md:min-h-[420px] h-full flex flex-col justify-between rounded-2xl md:rounded-none">
        
        {/* VIDEO CONTAINER: Always exists but opacity changes for smoothness */}
        <div 
          className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-40' : 'opacity-0'}`}
          style={{ transform: 'translateZ(0)' }} 
        >
          <video 
            ref={videoRef}
            src={cat.video} 
            loop 
            muted 
            playsInline 
            preload="metadata" // Instant visibility of first frame
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        {/* TOP ACCENT LINE */}
        <motion.div 
          initial={false}
          animate={{ width: isActive ? "100%" : "0%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`absolute top-0 left-0 h-[2px] z-10 bg-red-600 ${isActive ? 'animate-pulse' : ''}`} 
        />
        
        <div className="flex justify-between items-start relative z-10">
          <div className={`transition-colors duration-500 ${isActive ? 'text-white' : cat.color + ' text-neutral-600'}`}>
            {cat.icon}
          </div>
          <span className="text-[8px] md:text-[9px] font-mono text-neutral-800 group-hover/card:text-neutral-500 transition-colors uppercase tracking-widest">
            Asset_0{idx + 1}
          </span>
        </div>

        <div className="space-y-3 md:space-y-4 relative z-10">
          <Link href={cat.href} className="inline-block group/title">
            <h3 className={`text-lg md:text-xl font-bold text-white uppercase tracking-tight transition-all 
              ${isActive ? 'text-red-600 translate-x-1' : 'group-hover/title:text-red-600'}`}>
              {cat.title}
            </h3>
          </Link>
          
          <div className="space-y-1.5 md:space-y-2 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="text-[7px] md:text-[8px] font-black border-[0.5px] border-red-600/30 px-1.5 py-0.5 text-red-500 uppercase">Cap</span>
              <span className="text-[10px] md:text-xs font-mono text-neutral-400">{cat.range}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[7px] md:text-[8px] font-black border-[0.5px] border-white/10 px-1.5 py-0.5 text-neutral-600 uppercase">Spec</span>
              <span className="text-[10px] md:text-xs font-mono text-neutral-500">{cat.spec}</span>
            </div>
          </div>

          <p className="text-[10px] md:text-xs text-neutral-500 leading-snug md:leading-relaxed pt-3 border-t-[0.5px] border-white/5 pointer-events-none">
            {cat.description}
          </p>

          <Link 
            href={cat.href}
            className={`inline-flex pt-2 items-center gap-2 transition-all group/link active:scale-95
              ${isActive 
                ? 'text-white translate-x-1' 
                : 'text-white/40 hover:text-white'}`}
          >
            <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-[2px] 
              ${isActive ? 'text-red-600' : ''}`}>
              {cat.action}
            </span>
            <ArrowRight 
              size={12} 
              className={`text-red-600 transition-transform group-hover/link:translate-x-1 ${isActive ? 'translate-x-1' : ''}`} 
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CategoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const current = scrollRef.current;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    if (current) {
      current.addEventListener("scroll", onScroll, { passive: true });
      checkScroll();
      return () => current.removeEventListener("scroll", onScroll);
    }
  }, []);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const amount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#050505] py-12 md:py-24 px-4 md:px-6 border-t-[0.5px] border-white/5 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="mb-8 md:mb-16">
          <div className="flex items-center gap-3 mb-2 md:mb-4">
            <div className="h-[0.5px] w-8 md:w-12 bg-red-600" />
            <span className="text-red-600 text-[10px] md:text-xs font-black tracking-[0.3em] uppercase">
              Inventory_v2.0
            </span>
          </div>
          <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">
            The <span className="text-neutral-800">"Big FIVE"</span> Catalog
          </h2>
        </div>

        <div className="relative group/slider-container">
          <button 
            onClick={() => handleManualScroll('left')}
            className={`absolute -left-4 top-1/2 -translate-y-1/2 z-40 p-4 bg-black/90 border border-white/10 text-white transition-all duration-300 hidden md:flex items-center justify-center rounded-full backdrop-blur-md
              ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'} hover:border-red-600 hover:text-red-600 active:scale-90`}
          >
            <ChevronLeft size={28} />
          </button>

          <button 
            onClick={() => handleManualScroll('right')}
            className={`absolute -right-4 top-1/2 -translate-y-1/2 z-40 p-4 bg-black/90 border border-white/10 text-white transition-all duration-300 hidden md:flex items-center justify-center rounded-full backdrop-blur-md
              ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'} hover:border-red-600 hover:text-red-600 active:scale-90`}
          >
            <ChevronRight size={28} />
          </button>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 md:pb-0 scroll-smooth md:border-l-[0.5px] md:border-white/5"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {categories.map((cat, idx) => (
              <CategoryCard key={idx} cat={cat} idx={idx} />
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}