import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Privacy & Terms",
  description: "Privacy Policy and Terms of Use for Advanced Power Solutions.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans antialiased">
      <Header />

 <main className="container max-w-6xl mx-auto px-4 md:px-8 pt-32 pb-24">
        {/* Header */}
        <div className="mb-16 border-b border-white/5 pb-12">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-red-600 mb-4">
            Legal Documentation
          </p>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white mb-4">
            Privacy &amp; Terms
          </h1>
          <p className="text-white/30 text-sm font-light">
            Last updated: January 2026 &nbsp;·&nbsp; Advanced Power Solutions
          </p>
        </div>

        <div className="space-y-16">

          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[9px] font-black text-red-600 uppercase tracking-widest font-mono">01</span>
              <div className="h-[1px] w-8 bg-red-600/40" />
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/60">Overview</h2>
            </div>
            <p className="text-white/50 text-sm leading-relaxed font-light">
              Advanced Power Solutions (APS) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard information when you visit our website at <span className="text-white/80">aps.com.pk</span> or interact with our services. By using our site, you agree to the practices described here.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[9px] font-black text-red-600 uppercase tracking-widest font-mono">02</span>
              <div className="h-[1px] w-8 bg-red-600/40" />
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/60">Information We Collect</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Account Data", value: "When you sign in via Google, we receive your name, email address, and profile picture from Google's OAuth service." },
                { label: "Quote Requests", value: "When you submit a quote request, we collect your name, email, phone number, and product interests to respond to your inquiry." },
                { label: "Usage Data", value: "We use Google Analytics to collect anonymized data about how visitors use our site, including pages visited and time spent." },
                { label: "Cookies", value: "We use essential cookies to keep you signed in and functional cookies for analytics. No advertising cookies are used." },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row gap-4 py-4 border-b border-white/[0.04]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 sm:w-40 shrink-0">{label}</span>
                  <p className="text-sm text-white/50 font-light leading-relaxed">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[9px] font-black text-red-600 uppercase tracking-widest font-mono">03</span>
              <div className="h-[1px] w-8 bg-red-600/40" />
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/60">How We Use Your Information</h2>
            </div>
            <div className="space-y-3">
              {[
                "To respond to quote requests and business inquiries",
                "To manage your account and order history",
                "To improve our website and user experience",
                "To send transactional emails related to your inquiries",
                "To comply with legal obligations",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-red-600 rounded-full mt-2 shrink-0" />
                  <p className="text-sm text-white/50 font-light leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[9px] font-black text-red-600 uppercase tracking-widest font-mono">04</span>
              <div className="h-[1px] w-8 bg-red-600/40" />
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/60">Data Sharing</h2>
            </div>
            <p className="text-white/50 text-sm leading-relaxed font-light">
              We do not sell, trade, or rent your personal information to third parties. We may share data with trusted service providers (such as Google for authentication and analytics) who assist in operating our website, under strict confidentiality agreements. We may also disclose information when required by law.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[9px] font-black text-red-600 uppercase tracking-widest font-mono">05</span>
              <div className="h-[1px] w-8 bg-red-600/40" />
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/60">Your Rights</h2>
            </div>
            <div className="space-y-3">
              {[
                "Request access to the personal data we hold about you",
                "Request correction or deletion of your personal data",
                "Withdraw consent for data processing at any time",
                "Contact us to opt out of any communications",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-red-600 rounded-full mt-2 shrink-0" />
                  <p className="text-sm text-white/50 font-light leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[9px] font-black text-red-600 uppercase tracking-widest font-mono">06</span>
              <div className="h-[1px] w-8 bg-red-600/40" />
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/60">Terms of Use</h2>
            </div>
            <p className="text-white/50 text-sm leading-relaxed font-light mb-4">
              By accessing this website, you agree to use it only for lawful purposes. You may not use our site to transmit harmful, fraudulent, or misleading content. All product information, images, and content on this site are the property of Advanced Power Solutions and may not be reproduced without written permission.
            </p>
            <p className="text-white/50 text-sm leading-relaxed font-light">
              APS reserves the right to modify these terms at any time. Continued use of the site after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[9px] font-black text-red-600 uppercase tracking-widest font-mono">07</span>
              <div className="h-[1px] w-8 bg-red-600/40" />
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/60">Contact</h2>
            </div>
            <p className="text-white/50 text-sm leading-relaxed font-light mb-6">
              For any privacy-related questions or requests, please contact us:
            </p>
            <div className="space-y-3">
              {[
                { label: "Email", value: "info@aps.com.pk" },
                { label: "Phone", value: "+92 300 811 2242" },
                { label: "Address", value: "Office #205, Asad Business Centre, Model Town, Lahore" },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-4 py-3 border-b border-white/[0.04]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 w-20 shrink-0">{label}</span>
                  <span className="text-sm text-white/70 font-light">{value}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer note */}
        <div className="mt-20 pt-8 border-t border-white/5 flex items-center gap-4">
          <div className="w-1 h-6 bg-red-600" />
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
            APS Industries © 2026 — All Rights Reserved
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
}