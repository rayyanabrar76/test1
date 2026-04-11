'use client';

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Zap, ChevronDown, Sun, ArrowUpRight, 
  LayoutGrid, BatteryMedium, Wind, Menu, X, ChevronRight, Activity 
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- DATA ---
const INVENTORY_DATA = [
  {
    id: "generators",
    label: "Generators",
    href: "/inventory/generators", 
    icon: <Zap size={15} />,
    brands: [
      { 
        name: "Perkins Series", 
        href: "/inventory/generators#Perkins",
        desc: "10kVA - 2500kVA Range",
        items: [
          { name: "Small Scale (10-33kVA)", href: "/product/aps-p-series" },
          { name: "Commercial (50-220kVA)", href: "/product/aps-series" },
          { name: "High Capacity (275-660kVA)", href: "/product/Perkins-high-capacity-series" },
          { name: "Industrial (820-1375kVA)", href: "/product/aps-heavy-duty-series" }
        ]
      },
      { 
        name: "Cummins Power", 
        href: "/inventory/generators#cummins",
        desc: "30kVA - 2250kVA Range",
        items: [
          { name: "Small Scale (30-60kVA)", href: "/inventory/generators/cummins" },
          { name: "Mid Range (100-400kVA)", href: "/inventory/generators/cummins" },
          { name: "High Output (800kVA+)", href: "/inventory/generators/cummins" }
        ]
      },
      { 
        name: "Yangdong Series", 
        href: "/inventory/generators#canadian",
        desc: "10kVA - 150kVA Range",
        items: [
          { name: "Residential (10-21kVA)", href: "/inventory/generators/yangdong" },
          { name: "Commercial (22-100kVA)", href: "/inventory/generators/yangdong" }
        ]
      }
    ]
  },
{
  id: "ups",
  label: "UPS Systems",
  href: "/inventory/ups", 
  icon: <BatteryMedium size={15} />,
  brands: [
    { 
      name: " apc by schneider electric", 
      href: "/inventory/ups#apc",
      desc: "1kVA - 80kVA",
      items: [
        { 
          name: "Smart-UPS SURT Series (1~20 kVA)", 
          href: "/product/APC-1" 
        },
           { 
          name: "Smart-UPS SURT Series (10~40 kVA)", 
          href: "/product/APC-2" 
        },
           { 
          name: "Online Series (20~80 kVA)", 
          href: "/product/apc-3" 
        }
      ]
    },
    { 
      name: "Eaton Ups Systems", 
      href: "/inventory/ups#eaton", 
      desc: "40kVA - 1100kVA",
      items: [
        { 
          name: "Eaton Series (40~160 kVA)", 
          href: "product/eaton-1" 
        },
        { 
          name: "Eaton Series (225~1100 kVA)", 
          href: "/product/eaton-2" 
        }
      ]
    },
  ]
},
  {
  id: "Solar Energy",
  label: "Solar Energy",
  href: "/inventory/solar", 
  icon: <Sun size={15} />,
  brands: [
    { 
      name: "Canadian Solar", 
      href: "/inventory/solar#canadian",
      desc: "HiKu7 Mono PERC",
      items: [
        { name: "Canadian Solar HiKu7 (640W - 665W)", href: "/product/canadian-solar-hiku7-640w-665w" },
      ]
    },
    { 
      name: "Jinko Solar", 
      href: "/inventory/solar#jinko",
      desc: "Tiger Neo (N-type)",
      items: [
        { name: "Jinko Tiger Neo (570W - 590W)", href: "/product/jinko-tiger-neo-570w-590w" },

      ]
    },
    { 
      name: "Longi Solar", 
      href: "/inventory/solar#longi", 
      desc: "Hi-MO 7 Series",
     items: [
        { name: "LONGI Hi-MO7 (585W - 620W)", href: "/product/longi-hi-mo7-585w-620w" },
        
      ]
    }
  ]
  },
{
  id: "compressors",
  label: "Air Compressors",
  href: "/inventory/aircompressor", 
  icon: <Wind size={15} />,
  brands: [
    { 
      name: "Dari", 
      href: "/inventory/aircompressor#dari",
      desc: "Premium Italian compressors",
      items: [
        { name: "Piston Compressors", href: "/product/dari-001" },
        { name: "Belt driven Double-stage Compressors", href: "/product/dari-002" },
      ]
    },
    { 
      name: "Puma", 
      href: "/inventory/aircompressor#puma",
      desc: "double & Single Stage",
      items: [
        { name: "Puma Single-Stage Belt-Drive Air Compressors", href: "/product/puma-001" },
        { name: "Puma Two-Stage Belt-Drive Air Compressors", href: "/product/puma-002" }
      ]
    },
    { 
      name: "Dukas", 
      href: "/inventory/aircompressor#dukas",
      desc: "Screw Technology",
      items: [
        { name: "DUKAS Screw Air Compressor Series", href: "/product/dukas-001" },
        { name: "Download Dukas Full Catalog PDF", href: "/pdfs/compressor/dukas.pdf" }
      ]
    }
  ]
},
{
  id: "electric-gear",
  label: "Electric SwitchGear",
  href: "/inventory/panels", 
  icon: <Activity size={15} />,
  brands: [
    { 
      name: "Power Distribution", 
      href: "/inventory/panels#power",
      desc: "POWER DISTRIBUTION",
      items: [
        { name: "Medium Voltage Panel", href: "/product/aps-mv-panel" },
        { name: "Low Voltage Panel", href: "/product/aps-lv-panel" },
        { name: "Synchronizing Panels", href: "/product/aps-sync-panel" },
      ]
    },
    { 
      name: "Automation & Control", 
      href: "/inventory/panels#control",
      desc: "SYSTEMS & CONTROL",
      items: [
        { name: "Motor Control Center (MCC)", href: "/product/aps-mcc-panel" },
        { name: "AMF / ATS Panel", href: "/product/aps-amf-ats" },
        { name: "Central Control Station", href: "/product/aps-control-station" },
        { name: "Lighting Control Panels", href: "/product/aps-lighting-control" }
      ]
    },
    { 
      name: "Infrastructure", 
      href: "/inventory/panels#infrastructure",
      desc: "WIRING & CONTAINMENT",
      items: [
        { name: "Distribution Boards", href: "/product/aps-dist-boards" },
        { name: "PFI Plant", href: "/product/aps-pfi-plant" },
        { name: "Bus Tie Duct (BTD)", href: "/product/aps-bus-tie-duct" },
        { name: "Cable Tray & Ladders", href: "/product/aps-cable-tray" }
      ]
    }
  ]
},
];      

const DesktopView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCatId, setActiveCatId] = useState(INVENTORY_DATA[0].id);
  const [activeBrandName, setActiveBrandName] = useState(INVENTORY_DATA[0].brands[0].name);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 400);
  };

  const handleMouseEnterContainer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleMouseEnterTrigger = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const activeCat = useMemo(() => 
    INVENTORY_DATA.find(c => c.id === activeCatId) || INVENTORY_DATA[0], 
    [activeCatId]
  );

  const activeBrand = useMemo(() => 
    activeCat.brands.find(b => b.name === activeBrandName) || activeCat.brands[0], 
    [activeCat, activeBrandName]
  );

  return (
    <div 
      className="relative inline-block" 
      ref={containerRef}
      onMouseEnter={handleMouseEnterContainer}
      onMouseLeave={handleMouseLeave}
    >
      <Link 
        href="/inventory"
        onMouseEnter={handleMouseEnterTrigger}
        onClick={() => setIsOpen(false)}
        className={cn(
          "px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-all duration-500 rounded-full border relative z-[510] cursor-pointer",
          isOpen 
            ? "bg-white text-black border-white shadow-xl" 
            : "bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white/80"
        )}
      >
        <LayoutGrid size={14} className={cn("transition-transform duration-700", isOpen && "rotate-90")} />
        Products 
        <ChevronDown size={12} className={cn("transition-transform duration-500", isOpen && "rotate-180")} />
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-[100px] left-0 w-screen z-[500] flex justify-center pointer-events-none pt-4"
          >
            <div className="w-[95vw] max-w-[1100px] pointer-events-auto">
              <div className="bg-[#0A0A0A]/95 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] flex h-[460px] ring-1 ring-white/5">
                <LayoutGroup id="premium-nav">
                  
                  {/* SIDEBAR: Categories - Added scroll for safety */}
                  <div className="w-[240px] bg-white/[0.01] border-r border-white/5 p-6 flex flex-col gap-1 overflow-y-auto custom-menu-scrollbar">
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 px-3">Category</span>
                    {INVENTORY_DATA.map((cat) => (
                      <div
                        key={cat.id}
                        onMouseEnter={() => { setActiveCatId(cat.id); setActiveBrandName(cat.brands[0].name); }}
                        className={cn(
                          "relative flex items-center justify-between px-4 py-2.5 rounded-lg transition-all group cursor-default shrink-0",
                          activeCatId === cat.id ? "text-white" : "text-white/20 hover:text-white/50"
                        )}
                      >
                        <Link href={cat.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full z-10">
                          <span className={cn("transition-colors duration-500", activeCatId === cat.id ? "text-red-500" : "text-white/10")}>
                            {cat.icon}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest">{cat.label}</span>
                        </Link>
                        {activeCatId === cat.id && (
                          <motion.div layoutId="pill" className="absolute inset-0 bg-white/[0.03] border border-white/5 rounded-lg z-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* SUB-MENU: Brands - Added Scroller */}
                  <div className="w-[300px] bg-black/20 border-r border-white/5 p-6 flex flex-col gap-2 overflow-y-auto custom-menu-scrollbar">
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 px-3">Manufacturer</span>
                    {activeCat.brands.map((brand) => (
                      <div 
                        key={brand.name}
                        onMouseEnter={() => setActiveBrandName(brand.name)}
                        className={cn(
                          "flex flex-col p-5 rounded-xl border transition-all duration-500 cursor-default shrink-0",
                          activeBrandName === brand.name 
                            ? "bg-white text-black border-white shadow-lg translate-x-1" 
                            : "bg-transparent border-transparent text-white/30 hover:text-white/60"
                        )}
                      >
                        <Link href={brand.href} onClick={() => setIsOpen(false)} className="w-full">
                          <div className="flex justify-between items-center">
                            <span className="text-[12px] font-black uppercase tracking-tight">{brand.name}</span>
                            <ArrowUpRight size={13} className={cn("transition-opacity", activeBrandName === brand.name ? "opacity-100" : "opacity-0")} />
                          </div>
                          <span className={cn("text-[8px] uppercase font-bold tracking-[0.15em] mt-1", activeBrandName === brand.name ? "text-black/40" : "text-red-600/80")}>
                            {brand.desc}
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* CONTENT: Series Selection - Added Scroller */}
                  <div className="flex-1 p-10 bg-gradient-to-br from-transparent to-red-500/[0.02] overflow-y-auto custom-menu-scrollbar">
                    <div className="flex items-center gap-3 mb-8 opacity-30">
                      <Activity size={12} className="text-red-500" />
                      <span className="text-[8px] font-black uppercase tracking-[0.4em]">product Selection</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-1.5">
                      {activeBrand?.items.map((item, idx) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: 4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                        >
                          <Link 
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between p-3.5 rounded-lg border border-white/0 hover:border-white/5 hover:bg-white/[0.02] transition-all group"
                          >
                            <span className="text-[11px] font-medium text-white/40 group-hover:text-white transition-colors tracking-wide uppercase">
                              {item.name}
                            </span>
                            <div className="h-[1px] flex-1 mx-4 bg-white/0 group-hover:bg-white/5 transition-all" />
                            <ChevronRight size={12} className="text-red-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </LayoutGroup>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx global>{`
        .custom-menu-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-menu-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-menu-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-menu-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

const MobileView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="flex items-center gap-3 px-4 py-2 border border-white/10 bg-white/5 rounded-full text-white/60 hover:text-white transition-colors"
      >
        <LayoutGrid size={14} />
        <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Products</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#080808] z-[999] p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Product Inventory</span>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-white/5 rounded-full text-white"><X size={18} /></button>
            </div>
            
            <div className="space-y-4 overflow-y-auto pr-2">
              {INVENTORY_DATA.map(cat => (
                <div key={cat.id} className="border-b border-white/5 pb-4">
                  <div className="flex justify-between items-center w-full py-2">
                    <Link href={cat.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/80">
                      <span className="text-red-600">{cat.icon}</span>
                      {cat.label}
                    </Link>
                    <button onClick={() => setExpanded(expanded === cat.id ? null : cat.id)} className="p-2 text-white/40">
                      <ChevronDown size={14} className={cn("transition-transform duration-300", expanded === cat.id && "rotate-180")} />
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {expanded === cat.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pt-4 space-y-6"
                      >
                        {cat.brands.map(brand => (
                          <div key={brand.name} className="space-y-3">
                            <Link href={brand.href} onClick={() => setIsOpen(false)} className="flex items-center justify-between">
                              <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block">
                                {brand.name}
                              </span>
                              <ArrowUpRight size={10} className="text-white/20" />
                            </Link>
                            <div className="grid gap-2 pl-4 border-l border-white/10 ml-1">
                              {brand.items.map(item => (
                                <Link 
                                  key={item.name} 
                                  href={item.href} 
                                  onClick={() => setIsOpen(false)} 
                                  className="text-[11px] text-white/40 hover:text-white transition-colors block py-1 font-medium uppercase tracking-wide"
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export function SolutionsMenu() {
  return (
    <>
      <div className="hidden lg:block"><DesktopView /></div>
      <div className="lg:hidden"><MobileView /></div>
    </>
  );
}