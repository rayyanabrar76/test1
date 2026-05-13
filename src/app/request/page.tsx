'use client';

import { useState, useRef, useEffect } from "react";
import { 
  Phone, Mail, MapPin, ShieldCheck, Send, 
  ChevronDown, Activity, Cpu, Globe, ArrowLeft 
} from "lucide-react";
import { useSession } from "next-auth/react";
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

// Project Imports
import { Header } from "@/components/Header";
import { createQuoteAction } from "@/lib/actions/quote";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// --- Types ---
interface FormInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: boolean;
  required?: boolean;
}

interface StatusMetricProps {
  label: string;
  value: string;
  icon: React.ElementType;
  color?: string;
}

interface ContactNodeProps {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}

const CATEGORIES = [
  { id: "Generators", label: "Generators" },
  { id: "ups", label: "UPS Systems" },
  { id: "solar", label: "Solar Panels" },
  { id: "panels", label: "Control Panels" },
  { id: "Air Compressor", label: "Air Compressor" },
];

export default function EngineeringQuotePage() {
  const { data: session } = useSession();
  const formRef = useRef<HTMLFormElement>(null);
  const topRef = useRef<HTMLDivElement>(null); // Ref for top-of-form scrolling

  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "Advanced Power Solutions - Engineering Quote Request",
    category: "", 
    notes: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const validatePKPhone = (phone: string) => /^03\d{9}$/.test(phone.replace(/\D/g, ''));

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.includes(field)) setErrors(prev => prev.filter(e => e !== field));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const newErrors: string[] = [];

    // Validation Logic
    if (!formData.firstName) newErrors.push('firstName');
    if (!validatePKPhone(formData.phone)) newErrors.push('phone');
    if (!formData.category) newErrors.push('category');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsProcessing(false);
      
      // Force scroll to the top of the form section
      if (topRef.current) {
        const yOffset = -120; // Offset for header/branding
        const y = topRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }

      toast({ 
        title: "Action Required", 
        description: "Please complete the mandatory fields highlighted in red.", 
        variant: "destructive" 
      });
      return;
    }

    try {
      const dbResult = await createQuoteAction([], 0, formData.category, formData);
      if (!dbResult || dbResult.error) throw new Error(dbResult?.error || "Gateway Sync Failure");

      await emailjs.send(
        'service_dp4ba72',
        'template_ivmy9os',
        {
          quote_id: String(dbResult.quoteId).toUpperCase(),
          customerName: `${formData.firstName} ${formData.lastName}`.trim(),
          ...formData 
        },
        'mkG8cTQ0vwWahC6JO'
      );

      setSubmitted(true);
      toast({ title: "APS Node Synced", description: "Your power inquiry has been transmitted." });
    } catch (error: any) {
      toast({ title: "Transmission Error", description: error.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 selection:bg-red-500/30">
      <Header />

      <section ref={topRef} className="relative pt-32 pb-20 border-b border-white/[0.05] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-4 mb-4">
                <Link 
                  href="/" 
                  className="group flex items-center justify-center w-10 h-10 border border-red-950 rounded-full bg-white/[0.02] hover:bg-red-600 hover:border-red-600 transition-all duration-300"
                >
                  <ArrowLeft size={16} className="text-red-600 group-hover:text-white transition-colors" />
                </Link>

                <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-red-600" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-red-500 font-bold">Request</span>
                </div>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-thin tracking-tighter text-white uppercase">
                Get a <span className="font-black italic text-red-600">quote</span>
              </h1>
            </div>
            
            <div className="hidden md:flex border-l border-white/10 pl-8 gap-12">
              <StatusMetric label="APS-Server" value="Secure" icon={Globe} />
              <StatusMetric label="Sync-Rate" value="99.9%" icon={Cpu} color="text-green-500" />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8">
            {!submitted ? (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormInput 
                    label="First Name" 
                    value={formData.firstName} 
                    onChange={(v) => handleInputChange('firstName', v)} 
                    error={errors.includes('firstName')} 
                    required 
                  />
                  <FormInput 
                    label="Last Name" 
                    value={formData.lastName} 
                    onChange={(v) => handleInputChange('lastName', v)} 
                  />
                  <FormInput 
                    label="Email" 
                    type="email" 
                    value={formData.email} 
                    onChange={(v) => handleInputChange('email', v)} 
                  />
                  <FormInput 
                    label="Phone" 
                    value={formData.phone} 
                    onChange={(v) => handleInputChange('phone', v)} 
                    error={errors.includes('phone')} 
                    required 
                  />
                </div>

                <div className="space-y-4">
                  <label className={cn(
                    "text-[10px] uppercase tracking-widest font-bold transition-colors",
                    errors.includes('category') ? "text-red-500" : "text-zinc-500"
                  )}>
                    Category <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className={cn(
                        "w-full flex items-center justify-between bg-white/[0.02] border px-4 py-4 text-sm transition-all group",
                        errors.includes('category') ? "border-red-600" : "border-white/10 hover:border-red-600/50"
                      )}
                    >
                      <span className={formData.category ? "text-white uppercase tracking-wider text-xs" : "text-zinc-500"}>
                        {CATEGORIES.find(c => c.id === formData.category)?.label || "Select Category"}
                      </span>
                      <ChevronDown 
                        size={14} 
                        className={cn("transition-transform duration-300", isMenuOpen ? "rotate-180 text-red-600" : "text-zinc-500")} 
                      />
                    </button>

                    <AnimatePresence>
                      {isMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-50 w-full mt-2 bg-[#0a0a0a] border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden"
                        >
                          {CATEGORIES.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                handleInputChange('category', cat.id);
                                setIsMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-colors flex items-center justify-between group border-b border-white/5 last:border-0"
                            >
                              {cat.label}
                              <div className="h-1 w-1 bg-zinc-800 group-hover:bg-white rounded-full transition-colors" />
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Technical Specifications</label>
                  <textarea 
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Enter load requirements or project details..."
                    className="w-full bg-white/[0.02] border border-white/5 p-4 text-sm focus:border-red-600/50 outline-none resize-none transition-all" 
                  />
                </div>

                <button 
                  disabled={isProcessing}
                  type="submit" 
                  className="w-full md:w-auto px-12 py-4 bg-red-600 hover:bg-red-700 disabled:opacity-30 text-white transition-all flex items-center justify-center gap-4 group"
                >
                  <span className="text-xs font-black uppercase tracking-[0.2em]">
                    {isProcessing ? "Transmitting..." : "Submit Request"}
                  </span>
                  <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            ) : (
              <SuccessMessage reset={() => setSubmitted(false)} />
            )}
          </div>

          <div className="lg:col-span-4 space-y-12">
            <div className="p-8 border border-white/5 bg-white/[0.01] backdrop-blur-sm">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-8 flex items-center gap-2">
                <Activity size={14} className="text-red-600" /> Contact
              </h3>
              <div className="space-y-8">
                <ContactNode icon={Phone} label="Phone" value="+92 300 8112242" href="tel:+923008112242" />
                <ContactNode icon={Mail} label="Email" value="info@aps.com.pk" href="mailto:info@aps.com.pk" />
                <ContactNode icon={MapPin} label="Location" value="Office #205, M Block Market, Block M, Model Town, Lahore 54700" />
                
                <div className="pt-4 overflow-hidden rounded-sm opacity-60 hover:opacity-100 transition-opacity duration-700 grayscale hover:grayscale-0">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3403.407983693433!2d74.321855!3d31.458000499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919050dd07d73ef%3A0x3df90039cb05ea24!2sAdvanced%20Power%20Solutions!5e0!3m2!1sen!2s!4v1737978800000!5m2!1sen!2s"
                    width="100%"
                    height="200"
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Sub-Components ---
function FormInput({ label, value, onChange, type = "text", error, required }: FormInputProps) {
  return (
    <div className="space-y-2 group">
      <label className={cn(
        "text-[10px] uppercase tracking-widest font-bold transition-colors", 
        error ? "text-red-500" : "text-zinc-500 group-focus-within:text-red-500"
      )}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input 
        type={type} 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full bg-transparent border-b py-2 text-sm outline-none transition-all text-white",
          error ? "border-red-600" : "border-white/10 focus:border-red-600"
        )} 
      />
    </div>
  );
}

function StatusMetric({ label, value, icon: Icon, color = "text-red-500" }: StatusMetricProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={16} className={color} />
      <div>
        <p className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">{label}</p>
        <p className="text-[10px] uppercase text-white font-mono">{value}</p>
      </div>
    </div>
  );
}

function ContactNode({ icon: Icon, label, value, href }: ContactNodeProps) {
  const content = (
    <div className="flex items-center gap-3">
      <Icon size={12} className="text-zinc-500 group-hover:text-red-600 transition-colors" />
      <p className="text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">{value}</p>
    </div>
  );

  return (
    <div className="group">
      <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.3em] mb-1">{label}</p>
      {href ? (
        <a href={href} className="block transition-all">
          {content}
        </a>
      ) : content}
    </div>
  );
}

function SuccessMessage({ reset }: { reset: () => void }) {
  return (
    <div className="py-20 text-center border border-red-600/20 bg-red-600/[0.02] backdrop-blur-xl">
      <ShieldCheck className="mx-auto text-red-600 mb-6" size={48} strokeWidth={1} />
      <h2 className="text-2xl font-light text-white uppercase tracking-tighter mb-4">Node Link Established</h2>
      <button onClick={reset} className="text-[10px] uppercase tracking-widest text-emerald-500 hover:text-white transition-colors underline underline-offset-8">
        Send New Packet
      </button>
    </div>
  );
}