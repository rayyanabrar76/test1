import React from 'react';
import Image from 'next/image';

const CLIENTS = [
  { name: "Airlift", src: "/images/brands/airlift.jpg" },
  { name: "Borjan", src: "/images/brands/borjan.png" },
  { name: "Damas", src: "/images/brands/damas.svg" },
  { name: "ECS", src: "/images/brands/ecs.png" },
  { name: "Gloria", src: "/images/brands/gloria.png" },
  { name: "Gourmet", src: "/images/brands/gourmet.png" },
  { name: "Hardees", src: "/images/brands/hardees.png" },
  { name: "HBL", src: "/images/brands/hbl.png" },
  { name: "Ideas", src: "/images/brands/ideas.png" },
  { name: "Jalalsons", src: "/images/brands/jalalsons.png" },
  { name: "Menu", src: "/images/brands/menu.png" },
  { name: "National", src: "/images/brands/national.png" },
  { name: "Nishat", src: "/images/brands/Nishat.png" },
  { name: "Olympia", src: "/images/brands/olympia.png" },
  { name: "Optic", src: "/images/brands/optic.svg" },
  { name: "Sadiq", src: "/images/brands/sadiq.png" },
  { name: "Stylo", src: "/images/brands/stylo.png" },
  { name: "Tariq", src: "/images/brands/tariq.png" },
];

const firstRow = CLIENTS.slice(0, 13);
const secondRow = CLIENTS.slice(13);

export const ClientSection = () => {
  return (
  <section className="bg-[#050505] pb-14 pt-8 relative overflow-hidden">
      {/* 1. Header Section */}
      <div className="container mx-auto px-6 mb-24 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-[1px] w-8 bg-red-600" />
          <span className="text-[10px] font-black text-red-600 tracking-[0.3em] uppercase">
            Major Clients
          </span>
          <div className="h-[1px] w-8 bg-red-600" />
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter uppercase italic">
          Powering <span className="text-red-600">Top Brands</span>
        </h2>
      </div>

      {/* 2. Marquee Container */}
      <div className="flex flex-col gap-16 relative">
        {/* Cinematic Edge Blur */}
        <div className="absolute inset-0 z-10 pointer-events-none before:absolute before:left-0 before:top-0 before:h-full before:w-48 before:bg-gradient-to-r before:from-[#050505] before:to-transparent after:absolute after:right-0 after:top-0 after:h-full after:w-48 after:bg-gradient-to-l after:from-[#050505] after:to-transparent" />

        <div className="flex overflow-hidden">
          <div className="flex animate-marquee-left gap-20 items-center">
            {[...firstRow, ...firstRow].map((client, i) => (
              <LogoItem key={`r1-${i}`} client={client} />
            ))}
          </div>
        </div>

        <div className="flex overflow-hidden">
          <div className="flex animate-marquee-right gap-20 items-center">
            {[...secondRow, ...secondRow].map((client, i) => (
              <LogoItem key={`r2-${i}`} client={client} />
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left { animation: marquee-left 50s linear infinite; }
        .animate-marquee-right { animation: marquee-right 55s linear infinite; }
      `}</style>
    </section>
  );
};

const LogoItem = ({ client }: { client: any }) => {
  // GMC gets a specific massive scale
  const isGMC = client.name === "GMC";
  
  // Other vertical/detailed logos get a medium boost
  const isTaller = ["Optic", "Meezan", "NBP", "Tariq", "PMC", "Damas"].includes(client.name);
  
  // Dark logos to be inverted
  const isBlackLogo = ["Ideas", "Nishat", "Optic", "NBP", "Meezan", "PMC", "Tariq", "Ausaf"].includes(client.name);

  return (
    <div className={`
      relative flex-shrink-0 transition-all duration-500 hover:scale-110
      ${isGMC ? 'w-48 h-28 md:w-56 md:h-36' : isTaller ? 'w-36 h-20 md:w-48 md:h-28' : 'w-32 h-16 md:w-44 md:h-24'}
    `}>
      <Image
        src={client.src}
        alt={client.name}
        fill
        className={`
          object-contain transition-all duration-300
          ${isBlackLogo ? 'invert brightness-[300%] contrast-125' : 'brightness-110'}
          ${isGMC ? 'scale-150' : isTaller ? 'scale-125' : 'scale-100'}
        `}
      />
    </div>
  );
};