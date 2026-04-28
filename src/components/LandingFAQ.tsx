import React from 'react';

export const LandingFAQ = () => {
  const faqs = [
    {
      q: "Where can I find the best Industrial Power Generators in Pakistan?",
      a: "APS Power is the premier supplier of high-performance industrial generators across Pakistan. We specialize in Perkins and Cummins engines, providing robust backup power solutions for factories in Lahore, Karachi, and Islamabad. Our systems are engineered for the local climate and 24/7 industrial demands."
    },
    {
      q: "What is the Perkins 30kVA generator price in Pakistan for 2026?",
      a: "The price of a Perkins 30kVA generator fluctuates based on the exchange rate and specific alternator configurations (Stamford or Leroy Somer). For the most competitive 2026 quotes and current pricing for 'Perkins generator ki price', contact our sales team for a customized engineering proposal."
    },
    {
      q: "Do you provide installation for diesel generators in Lahore and Karachi?",
      a: "Yes, we offer complete turnkey installation and commissioning services. Whether you need a diesel generator for a factory in Lahore's Sundar Industrial Estate or a commercial UPS system in Karachi's Korangi area, our certified engineers handle everything from site audit to final testing."
    },
    {
      q: "How can I calculate my 80kVA generator fuel consumption per hour?",
      a: "Fuel efficiency is critical for ROI. A standard Perkins 80kVA generator fuel consumption per hour is approximately 14.5 Liters at 75% load. We provide detailed fuel economy charts for all our Cummins and Perkins units to help you manage operational costs effectively."
    },
    {
      q: "What makes APS Power the best Solar and Critical Power provider?",
      a: "By integrating Tier-1 Solar Solutions with high-end UPS (Critical Power) and Industrial Air Compressors, APS Power provides a unified energy ecosystem. Our control panels use advanced DSE controllers to synchronize multiple power sources, ensuring zero-downtime for your infrastructure."
    }
  ];

  return (
   // Changed py-24 (96px) to pt-8 (32px) and pb-24 (96px)
<section className="relative bg-[#050505] pt-8 pb-24 px-6 border-t border-blue-900/20">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header with Semantic SEO tags */}
        <header className="text-center mb-16">
          <h2 className="text-red-600 font-bold tracking-[0.2em] uppercase text-sm mb-4">
            Industrial Intelligence
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked <span className="text-red-600">Questions</span>
          </h3>
          <p className="text-slate-500 mt-6 max-w-2xl mx-auto text-lg">
            Expert insights on power generation, fuel efficiency, and industrial energy infrastructure in Pakistan.
          </p>
        </header>

        <div className="grid gap-4">
          {faqs.map((faq, index) => (
            <details 
              key={index} 
              className="group border border-slate-800 bg-[#0A0A0B] rounded-none overflow-hidden transition-all duration-300 open:border-blue-600/50"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="text-lg font-bold text-slate-200 group-open:text-red-400 transition-colors">
                  <span className="text-red-600 mr-4 font-mono">0{index + 1}.</span>
                  {faq.q}
                </span>
                <span className="text-red-600 transition-transform duration-300 group-open:rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 pt-2">
                <p className="text-slate-400 leading-relaxed border-l-2 border-red-900/50 pl-6">
                  {faq.a}
                </p>
              </div>
            </details>
          ))}
        </div>

        {/* JSON-LD Schema for Google Search Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(item => ({
                "@type": "Question",
                "name": item.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": item.a
                }
              }))
            })
          }}
        />
      </div>
    </section>
  );
};