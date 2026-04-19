'use client';

import React from 'react';
import Image from 'next/image'
import { 
  Facebook, 
  Instagram, 
  MessageCircle, // WhatsApp
  Linkedin, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const googleMapsAddress = "https://www.google.com/maps/search/?api=1&query=Advanced+Power+Solutions+Model+Town+Lahore";

  return (
    <footer className="bg-black text-neutral-400 border-t border-white/5 font-sans">
      {/* Main Footer Content */}
     <div className="container mx-auto px-6 md:px-10 pb-20 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: About */}
          <div className="space-y-8">
     <a href="/" className="block h-12">
  <Image
    src="/aps-logo.png" 
    alt="APS Logo" 
    className="h-20 w-auto object-contain hover:opacity-90 transition-opacity -mt-4" 
    width={80}
    height={80}
  />
</a>
            <p className="text-[11px] leading-relaxed uppercase tracking-wider text-neutral-500 max-w-xs">
              <strong>Advanced Power Solutions</strong> // Specialized engineering and energy solutions for industrial, commercial, and residential sectors across Pakistan.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: <Facebook size={16} />, href: "https://www.facebook.com/aps8308/" },
                { icon: <Instagram size={16} />, href: "https://www.instagram.com/apspowerpk/" },
                { icon: <MessageCircle size={16} />, href: "https://wa.me/923008112242" },
                { icon: <Linkedin size={16} />, href: "https://www.linkedin.com/company/apspower/" }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 border border-white/10 hover:bg-white hover:text-black transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Offerings - MOBILE CAROUSEL SNAPPING UPDATED */}
          <div className="overflow-hidden">
            <h3 className="text-white text-[10px] font-bold mb-8 uppercase tracking-[0.3em]">
              Our Products
            </h3>
            <ul className="flex md:block overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth scrollbar-hide gap-4 space-y-0 md:space-y-4 text-[11px] uppercase tracking-widest pb-4 md:pb-0">
              {[
                { label: "Industrial Generators", href: "/inventory/generators" },
                { label: "Solar Solutions", href: "/inventory/solar" },
                { label: "Critical Power / UPS", href: "/products/ups" },
                { label: "Air Compressors", href: "/inventory/aircompressor" },
                { label: "Control Panels", href: "/inventory/panels" }
              ].map((item, idx) => (
                <li key={idx} className="snap-start snap-always shrink-0">
                  <a 
                    href={item.href} 
                    className="inline-block py-3 px-5 md:p-0 border border-white/10 md:border-none hover:text-red-600 transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Corporate */}
          <div>
            <h3 className="text-white text-[10px] font-bold mb-8 uppercase tracking-[0.3em]">
              Helpful Links
            </h3>
            <ul className="space-y-4 text-[11px] uppercase tracking-widest">
              <li><a href="/company" className="hover:text-red-600 transition-colors">Company Profile</a></li>
              <li><a href="/services" className="hover:text-red-600 transition-colors">Our Services</a></li>
              <li><a href="/request" className="hover:text-red-600 transition-colors">Request Quotation</a></li>
              <li><a href="/privacy" className="hover:text-red-600 transition-colors">Privacy & Terms</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-white text-[10px] font-bold mb-8 uppercase tracking-[0.3em]">
              Contact
            </h3>
            <ul className="space-y-6 text-[11px] uppercase tracking-widest">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-red-600 shrink-0 mt-0.5" />
                <a 
                  href={googleMapsAddress} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-neutral-500 hover:text-white transition-colors leading-relaxed group"
                >
                  Office #205, Asad Business Centre, Model Town, Lahore
                  <span className="block text-[9px] text-red-600 font-bold mt-2 group-hover:translate-x-1 transition-transform tracking-[0.2em]">Open in Maps →</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-red-600 shrink-0" />
                <a href="tel:+923008112242" className="hover:text-white transition-colors">
                  +92 300 811 2242
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-red-600 shrink-0" />
                <a href="mailto:info@aps.com.pk" className="hover:text-white transition-colors">
                  info@aps.com.pk
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
<footer className="border-t border-white/5 bg-black py-12">
    <p className="text-[10px] text-neutral-500 uppercase tracking-[0.4em] text-center">
      © {new Date().getFullYear()} APS — Advanced Power Solutions. All Rights Reserved.
    </p>
</footer>

      {/* Custom Styles for hiding scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </footer>
  );
};

export { Footer };
export default Footer;