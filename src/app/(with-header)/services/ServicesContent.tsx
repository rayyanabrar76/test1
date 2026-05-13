'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { NavbarWithCart } from '@/components/NavbarWithCart'
import { MoveLeft, ArrowRight, Zap, ShieldCheck, Cog, Headphones } from 'lucide-react'

const services = [
  {
    id: '01',
    title: 'Diesel & Gas Generators',
    href: '/inventory/generators',
    description: 'Engineering heavy-duty electrical infrastructure for Pakistan\'s industrial sectors since 1996.',
    specs: ['50kVA – 3000kVA', 'Tier-1 Engines', 'ATS Compatible', 'Load Testing'],
  },
  {
    id: '02',
    title: 'Critical Power / UPS',
    href: '/inventory/ups',
    description: 'Seamless 24/7 power management with Tier-1 reliability and real-time monitoring.',
    specs: ['1kVA – 800kVA', 'Double-Conversion', 'Hot-Swappable', 'European Tech'],
  },
  {
    id: '03',
    title: 'Solar Panel Systems',
    href: '/inventory/solar',
    description: 'Lahore-based expertise delivering international standards in sustainable power distribution.',
    specs: ['Industrial Scale', 'Net Metering', 'Hybrid Systems', 'AEDB Certified'],
  },
  {
    id: '04',
    title: 'Air Compressors',
    href: '/inventory/air-compressors',
    description: 'High-pressure coaxial and piston systems engineered for sustained industrial production.',
    specs: ['Oil-Free Options', 'Direct Drive', 'Stationary', 'Full Service'],
  },
  {
    id: '05',
    title: 'Switchgear & Panels',
    href: '/inventory/switchgear',
    description: 'Custom-built LT/HT panels and synchronization systems designed for maximum efficiency.',
    specs: ['Custom Build', 'MV / LV', 'Fault Protection', 'Smart Sync'],
  },
  {
    id: '06',
    title: 'Engineering Support',
    href: '/request',
    description: 'On-site technical support, preventative maintenance, and breakdown recovery services.',
    specs: ['24/7 Response', 'OEM Parts', 'Certified Crew', 'Asset Audits'],
  },
]

const processes = [
  { icon: <Zap size={18} />, title: "Consultation", desc: "Energy audit & load calculation." },
  { icon: <Cog size={18} />, title: "Deployment", desc: "Rapid site prep & installation." },
  { icon: <ShieldCheck size={18} />, title: "Testing", desc: "Rigorous load & safety stress tests." },
  { icon: <Headphones size={18} />, title: "Support", desc: "Lifetime engineering backup." },
]

export default function ServicesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600/30 font-sans">
      <NavbarWithCart />

      <main className="w-screen pt-24 pb-20">
        
        {/* HERO SECTION */}
        <section className="px-6 md:px-16 pt-10 pb-16 border-b border-white/5">
          <div className="flex items-center gap-6 mb-12">
            <button
              onClick={() => router.back()}
              className="group flex items-center justify-center pr-6 border-r border-white/10 text-neutral-500 hover:text-red-600 transition-colors"
            >
              <MoveLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <span className="text-red-500 text-[10px] font-bold tracking-[0.4em] uppercase font-mono">
              APS // SERVICE PORTFOLIO
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-light tracking-tighter leading-none mb-8 max-w-5xl">
            Engineering <br />
            <span className="text-neutral-600">Capabilities</span>
          </h1>

          <p className="text-neutral-500 text-sm md:text-base max-w-2xl leading-relaxed font-light">
            We provide specialized power and industrial solutions engineered for reliability. 
            From large-scale generation to precise air compression, our assets are backed 
            by 28+ years of technical operational mastery across Pakistan.
          </p>
        </section>

        {/* CORE SERVICES GRID */}
        <section className="px-6 md:px-16 py-16 border-b border-white/5">
          <p className="text-[9px] font-bold tracking-[0.4em] uppercase text-neutral-600 font-mono mb-10">
            Industrial Assets
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {services.map((s) => (
              <div key={s.id} className="bg-black px-8 py-12 flex flex-col gap-6 group hover:bg-neutral-950 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-0.5 h-6 bg-red-600/60" />
                    <span className="text-[9px] font-bold text-red-600/60 tracking-[0.3em] font-mono">{s.id}</span>
                  </div>
                  <Link href={s.href}>
                    <ArrowRight size={18} className="text-neutral-700 group-hover:text-white transition-colors" />
                  </Link>
                </div>
                
                <div>
                  <h3 className="text-xl md:text-2xl font-light tracking-tight mb-3">{s.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-light mb-8">{s.description}</p>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-y-3">
                  {s.specs.map((spec) => (
                    <div key={spec} className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                      <div className="w-1 h-1 bg-neutral-800 group-hover:bg-red-600 transition-colors" /> {spec}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROCESS STEPS */}
        <section className="px-6 md:px-16 py-16 border-b border-white/5">
          <p className="text-[9px] font-bold tracking-[0.4em] uppercase text-neutral-600 font-mono mb-10">
            Our Workflow
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {processes.map((p, idx) => (
              <div key={idx} className="bg-black px-6 py-10 flex flex-col gap-4">
                <div className="text-red-600/60">{p.icon}</div>
                <h4 className="text-sm font-bold uppercase tracking-widest">{p.title}</h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* EMERGENCY SUPPORT BANNER */}
        <section className="px-6 md:px-16 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            <div className="bg-black p-10 flex flex-col justify-center border border-white/5">
              <p className="text-[9px] font-bold text-red-600/60 tracking-[0.3em] font-mono mb-4 uppercase">Technical Support</p>
              <h2 className="text-3xl font-light tracking-tighter mb-4">Maintenance & Overhauling</h2>
              <p className="text-sm text-neutral-500 font-light leading-relaxed max-w-md">
                Our engineering teams provide 24/7 breakdown recovery and factory-standard maintenance 
                to ensure zero operational downtime for your facility.
              </p>
            </div>
            
            <a 
              href="tel:+923008112242"
              className="bg-red-600 p-10 flex flex-col justify-center gap-3 hover:bg-red-700 transition-colors group"
            >
              <p className="text-[9px] font-bold text-red-200/60 tracking-[0.3em] font-mono uppercase">Emergency Helpline</p>
              <p className="text-3xl md:text-4xl font-light tracking-tighter text-white">
                +92 300 811 2242
              </p>
              <div className="flex items-center gap-2 text-[10px] text-red-200/50 font-mono uppercase tracking-widest">
                <span>Direct Site Dispatch</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
        </section>

        {/* CTA FOOTER */}
        <footer className="mt-10 py-20 border-t border-white/5 bg-neutral-950/30">
          <div className="flex flex-col items-center text-center px-4">
            <h3 className="text-red-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-4 font-mono">
              Next Steps
            </h3>
            <p className="text-3xl md:text-5xl font-light tracking-tighter mb-8 max-w-2xl text-balance">
              Secure your infrastructure today.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={() => router.push('/inventory')}
                className="px-10 py-5 border border-white/10 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:border-white/30 hover:bg-white/5"
              >
                View Catalog
              </button>
              <button
                onClick={() => router.push('/request')}
                className="px-10 py-5 bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-red-600 hover:text-white"
              >
                Request Free Quote
              </button>
            </div>
            <p className="mt-8 text-neutral-600 text-[9px] uppercase tracking-widest font-mono">
              24/7 On-Call Engineering • Nationwide Coverage
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}