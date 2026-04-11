'use client'

import { useRouter } from 'next/navigation'
import { NavbarWithCart } from '@/components/NavbarWithCart'
import { MoveLeft, MapPin, Phone, Mail, ArrowRight } from 'lucide-react'

const pillars = [
  {
    id: '01',
    title: 'Mission',
    body: "To become a top-leading engineering company in Pakistan delivering best services and best products. We care for our business partners and believe a transaction is not the end of a business — it's the start of an obligation.",
  },
  {
    id: '02',
    title: 'Vision',
    body: 'To provide the most reliable service with the best affordable products to customers — catering to power backup requirements across the country.',
  },
  {
    id: '03',
    title: 'Nationwide Network',
    body: 'Head office spanning 29,947 sq ft in Lahore. Strong branch office network across Karachi, Islamabad, Multan, and Peshawar covering all major strategic locations in Pakistan.',
  },
]

const afterSales = [
  { label: 'AMC', desc: 'Annual Maintenance Contracts with & without parts' },
  { label: 'PM', desc: 'Scheduled Preventive Maintenance programs' },
  { label: 'CM', desc: 'Corrective Maintenance & emergency response' },
  { label: 'OH', desc: 'Full equipment overhauling to factory standard' },
]

export default function CompanyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600/30">
      <NavbarWithCart />

      <main className="w-screen pt-24 pb-20">

        {/* HERO */}
        <section className="px-6 md:px-16 pt-10 pb-16 border-b border-white/5">
          <div className="flex items-center gap-6 mb-12">
            <button
              onClick={() => router.back()}
              className="group flex items-center justify-center pr-6 border-r border-white/10 text-neutral-500 hover:text-red-600 transition-colors"
            >
              <MoveLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <span className="text-red-500 text-[10px] font-bold tracking-[0.4em] uppercase font-mono">
              APS // Company Profile
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-light tracking-tighter leading-none mb-8 max-w-5xl">
            Advanced Power <br />
            <span className="text-neutral-600">Solutions</span>
          </h1>

          <p className="text-neutral-500 text-sm md:text-base max-w-2xl leading-relaxed font-light">
            One of Pakistan's leading engineering companies — distributor of international brands
            in power generation, industrial solutions, and services. Our trained technical team
            has vast experience across power generation, data centres, renewable energy, and more.
            We offer custom-made power solutions, genuine spare parts, and end-to-end services.
          </p>
        </section>

        {/* MISSION / VISION / NETWORK */}
        <section className="px-6 md:px-16 py-16 border-b border-white/5">
          <p className="text-[9px] font-bold tracking-[0.4em] uppercase text-neutral-600 font-mono mb-10">
            Who We Are
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {pillars.map((p) => (
              <div key={p.id} className="bg-black px-8 py-10 flex flex-col gap-4 group hover:bg-neutral-950 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-0.5 h-8 bg-red-600/60" />
                  <span className="text-[9px] font-bold text-red-600/60 tracking-[0.3em] font-mono">{p.id}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-light tracking-tight">{p.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-light">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AFTER SALES */}
        <section className="px-6 md:px-16 py-16 border-b border-white/5">
          <p className="text-[9px] font-bold tracking-[0.4em] uppercase text-neutral-600 font-mono mb-2">
            After Sales Services
          </p>
          <h2 className="text-3xl md:text-4xl font-light tracking-tighter mb-4">
            Customer Support & Maintenance
          </h2>
          <p className="text-neutral-600 text-sm max-w-2xl leading-relaxed font-light mb-12">
            We focus on all existing and new customers by providing quick response whenever needed.
            Our trained technical and installation team is always ready to provide full support —
            resolving complaints and rectifying problems with minimum downtime.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 mb-12">
            {afterSales.map((a) => (
              <div key={a.label} className="bg-black px-6 py-8 flex flex-col gap-3 group hover:bg-neutral-950 transition-colors">
                <span className="text-2xl md:text-3xl font-light tracking-tighter text-white">{a.label}</span>
                <span className="text-[10px] text-neutral-600 font-mono uppercase tracking-widest leading-relaxed">{a.desc}</span>
              </div>
            ))}
          </div>

          {/* Consultancy */}
          <div className="border border-white/5 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-[9px] font-bold text-red-600/60 tracking-[0.3em] font-mono mb-2">Consultancy Support</p>
              <p className="text-sm text-neutral-500 max-w-xl font-light leading-relaxed">
                Our Sales & Service teams welcome all customers for technical information and support —
                guiding every decision to the solution that best fits your needs.
              </p>
            </div>
            <button
              onClick={() => router.push('/request')}
              className="flex-shrink-0 flex items-center gap-2 px-8 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all"
            >
              Get Free Consultation <ArrowRight size={14} />
            </button>
          </div>
        </section>

        {/* CONTACT */}
        <section className="px-6 md:px-16 py-16 border-b border-white/5">
          <p className="text-[9px] font-bold tracking-[0.4em] uppercase text-neutral-600 font-mono mb-10">
            Contact Us
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            <div className="bg-black px-8 py-10 flex flex-col gap-5">
              <p className="text-[9px] font-bold text-red-600/60 tracking-[0.3em] font-mono">Head Office & Workshop</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3 text-sm text-neutral-500 font-light">
                  <MapPin size={14} className="text-neutral-700 mt-0.5 flex-shrink-0" />
                  Office #205, Asad Business Centre, Model Town, Lahore
                </div>
                <a href="mailto:info@aps.com.pk" className="flex items-center gap-3 text-sm text-neutral-500 font-light hover:text-white transition-colors">
                  <Mail size={14} className="text-neutral-700 flex-shrink-0" />
                  info@aps.com.pk
                </a>
                <a href="tel:+923008112242" className="flex items-center gap-3 text-sm text-neutral-500 font-light hover:text-white transition-colors">
                  <Phone size={14} className="text-neutral-700 flex-shrink-0" />
                  +92 300 811 2242
                </a>
              </div>
            </div>

            <a
              href="tel:+923008112242"
              className="bg-red-600 px-8 py-10 flex flex-col justify-center gap-3 hover:bg-red-700 transition-colors"
            >
              <p className="text-[9px] font-bold text-red-200/60 tracking-[0.3em] font-mono uppercase">
                Service Complaints Nationwide
              </p>
              <p className="text-3xl md:text-4xl font-light tracking-tighter text-white">
                +92 300 811 2242
              </p>
              <p className="text-[10px] text-red-200/50 font-mono uppercase tracking-widest">
                Tap to call • 24 / 7 Emergency Response
              </p>
            </a>
          </div>
        </section>

        {/* CTA FOOTER */}
        <footer className="mt-10 py-20 border-t border-white/5 bg-neutral-950/30">
          <div className="flex flex-col items-center text-center px-4">
            <h3 className="text-red-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-4 font-mono">
              Procurement
            </h3>
            <p className="text-3xl md:text-5xl font-light tracking-tighter mb-8 max-w-2xl text-balance">
              Ready to get started?
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
              Professional Grade Hardware • Global Compliance
            </p>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  )
}