"use client";

import React, { useState } from "react";

const faqs = [
  {
    q: "Where can I find the best Industrial Power Generators in Pakistan?",
    a: "APS Power is the premier supplier of high-performance industrial generators across Pakistan. We specialize in Perkins and Cummins engines, providing robust backup power solutions for factories in Lahore, Karachi, and Islamabad. Our systems are engineered for the local climate and 24/7 industrial demands.",
  },
  {
    q: "What is the Perkins 30kVA generator price in Pakistan for 2026?",
    a: "The price of a Perkins 30kVA generator fluctuates based on the exchange rate and specific alternator configurations (Stamford or Leroy Somer). For the most competitive 2026 quotes and current pricing for 'Perkins generator ki price', contact our sales team for a customized engineering proposal.",
  },
  {
    q: "Do you provide installation for diesel generators in Lahore and Karachi?",
    a: "Yes, we offer complete turnkey installation and commissioning services. Whether you need a diesel generator for a factory in Lahore's Sundar Industrial Estate or a commercial UPS system in Karachi's Korangi area, our certified engineers handle everything from site audit to final testing.",
  },
  {
    q: "How can I calculate my 80kVA generator fuel consumption per hour?",
    a: "Fuel efficiency is critical for ROI. A standard Perkins 80kVA generator fuel consumption per hour is approximately 14.5 Liters at 75% load. We provide detailed fuel economy charts for all our Cummins and Perkins units to help you manage operational costs effectively.",
  },
  {
    q: "What makes APS Power the best Solar and Critical Power provider?",
    a: "By integrating Tier-1 Solar Solutions with high-end UPS (Critical Power) and Industrial Air Compressors, APS Power provides a unified energy ecosystem. Our control panels use advanced DSE controllers to synchronize multiple power sources, ensuring zero-downtime for your infrastructure.",
  },
];

export const LandingFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="relative bg-[#050505] pt-8 pb-24 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">

        {/* Header — matches your site's label + heading pattern exactly */}
        <header className="mb-16">
          <p className="text-red-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-4">
            Industrial Intelligence
          </p>
          <h2 className="text-3xl md:text-5xl font-light tracking-tighter text-white max-w-xl">
            Frequently asked <br />
            <span className="text-neutral-600">questions</span>
          </h2>
        </header>

        {/* FAQ Items */}
        <div className="divide-y divide-white/5">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-start justify-between gap-8 py-7 text-left group"
                  aria-expanded={isOpen}
                >
                  {/* Number + Question */}
                  <div className="flex items-start gap-5">
                    <span className="text-red-500 text-[10px] font-bold tracking-[0.2em] uppercase mt-1 shrink-0 w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-[15px] font-medium tracking-tight leading-snug transition-colors duration-200 ${
                        isOpen ? "text-white" : "text-neutral-400 group-hover:text-white"
                      }`}
                    >
                      {faq.q}
                    </span>
                  </div>

                  {/* Toggle icon */}
                  <span
                    className={`shrink-0 mt-0.5 transition-transform duration-300 ${
                      isOpen ? "rotate-45 text-red-500" : "text-neutral-600 group-hover:text-neutral-400"
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 1v14M1 8h14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>

                {/* Answer — animated expand */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-neutral-600 text-[13px] leading-relaxed tracking-wide pb-7 pl-11 max-w-2xl">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* JSON-LD — Google FAQ rich snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.a,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
};