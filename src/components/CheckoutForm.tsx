'use client';

import { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  Zap, Activity, UserCheck, AlertTriangle, Wind, 
  Battery, Sun, Settings, Info, ShoppingCart, Trash2, ExternalLink 
} from "lucide-react";
import { createQuoteAction } from "@/lib/actions/quote";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import emailjs from '@emailjs/browser';

interface CheckoutFormProps {
  onPlaceOrder: (quoteId: string) => void;
  isProcessing: boolean;
  items: any[];
  total: number;
  showCategory?: boolean;
  onRemoveItem?: (productId: string) => void;
}

const INDUSTRIAL_CATEGORIES = [
  { id: "generators", label: "Generators", icon: Wind },
  { id: "ups", label: "UPS Systems", icon: Battery },
  { id: "solar", label: "Solar Energy", icon: Sun },
  { id: "switchgear", label: "Electric Switchgear", icon: Settings },
];

export function CheckoutForm({
  onPlaceOrder,
  isProcessing: parentProcessing,
  items,
  total,
  showCategory = false,
  onRemoveItem
}: CheckoutFormProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isRoot = session?.user?.role === "ROOT";
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    category: "", 
    notes: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const validatePKPhone = (phone: string) => {
    const pkRegex = /^03\d{9}$/;
    return pkRegex.test(phone.replace(/\D/g, ''));
  };

  const handleInputChange = (field: string, value: string) => {
    let finalValue = value;

    if (field === 'phone') {
      finalValue = value.replace(/\D/g, '').slice(0, 11);
    }

    setFormData(prev => ({ ...prev, [field]: finalValue }));
    
    if (errors.includes(field)) {
      if (field === 'phone') {
        if (validatePKPhone(finalValue)) {
          setErrors(prev => prev.filter(e => e !== 'phone'));
        }
      } else if (finalValue.trim() !== "") {
        setErrors(prev => prev.filter(e => e !== field));
      }
    }
  };

  const renderedItems = useMemo(() => {
    return items.map((item, idx) => (
      <div 
        key={`${item.productId}-${idx}`} 
        className="flex justify-between items-center px-4 py-3 border border-white/5 bg-white/[0.02] gap-4 group"
      >
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="h-10 w-10 flex-shrink-0 bg-white/5 border border-white/10 overflow-hidden relative">
            {item.image || item.primaryImage ? (
              <img 
                src={item.image || item.primaryImage} 
                alt={item.name} 
                className="h-full w-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-white/[0.02]">
                <ShoppingCart size={12} className="text-white/20" />
              </div>
            )}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-[10px] font-bold text-white uppercase tracking-tight truncate">
              {item.name}
            </span>
            <div className="flex items-center gap-3 mt-1">
              <Link 
                href={`/product/${item.productId}`}
                className="text-[8px] text-white/40 uppercase tracking-widest hover:text-white flex items-center gap-1 transition-colors"
              >
                <ExternalLink size={8} /> View Details
              </Link>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-white/40">
            QTY: {item.qty}
          </span>
          <button 
            type="button"
            onClick={() => onRemoveItem?.(item.productId)}
            className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
            title="Remove from inquiry"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    ));
  }, [items, onRemoveItem]);

  useEffect(() => {
    if (isAuthenticated && session?.user) {
      const nameParts = session.user.name?.split(" ") || ["", ""];
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: session.user.email || "",
      }));
    }
  }, [session, isAuthenticated]);

  const validateForm = () => {
    const newErrors: string[] = [];
    if (showCategory && !formData.category) newErrors.push("category");
    if (!formData.firstName.trim()) newErrors.push("firstName");
    if (!validatePKPhone(formData.phone)) newErrors.push("phone");
    if (formData.email.trim() && !formData.email.includes('@')) newErrors.push("email");
    
    setErrors(newErrors);

    if (newErrors.length > 0) {
      setTimeout(() => {
        const firstErrorField = newErrors[0];
        const inputElement = document.getElementsByName(firstErrorField)[0] as HTMLElement || 
                           document.querySelector(`[data-error-id="${firstErrorField}"]`);
        
        if (inputElement) {
          inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          inputElement.focus();
        }
      }, 100);
    }

    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      formRef.current?.classList.add('animate-horizontal-shake'); 
      setTimeout(() => formRef.current?.classList.remove('animate-horizontal-shake'), 500);

      toast({
        title: "Validation Error",
        description: !validatePKPhone(formData.phone) 
          ? "Please enter a valid phone number (03XXXXXXXXX)."
          : "Please fill in the required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      const dbResult = await createQuoteAction(
        items, 
        total, 
        formData.category || "standard",
        formData
      );
      
      if (!dbResult || dbResult.error || !dbResult.quoteId) {
        throw new Error(dbResult?.error || "Database failed to return ID.");
      }

      const formattedItems = items.length > 0 
        ? items.map((item: any) => `- ${item.name} (Qty: ${item.qty})`).join("\n")
        : "Inquiry (No Cart Items)";

      const templateParams = {
        quote_id: String(dbResult.quoteId).toUpperCase(),
        category: formData.category.toUpperCase() || "STANDARD",
        subject: formData.subject || "General Inquiry",
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email || "Guest (No Email Provided)",
        phone: formData.phone,
        notes: formData.notes,
        order_items: formattedItems,
        total_amount: total.toLocaleString(),
      };

      await emailjs.send(
        'service_dp4ba72',
        'template_1cxkr6u',
        templateParams,
        'mkG8cTQ0vwWahC6JO'
      );
      
      toast({
        title: "Request Sent",
        description: "Thank you. We will contact you shortly.",
      });

      onPlaceOrder(dbResult.quoteId);
      setFormData({ 
        firstName: "", lastName: "", email: "",
        category: "", subject: "", phone: "", notes: "" 
      });
      setErrors([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to transmit request.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit} 
      className="relative space-y-8 bg-[#050505] p-6 sm:p-10 border border-white/10 shadow-none overflow-visible transition-all duration-300 touch-pan-y"
    >
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] will-change-transform" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-white/10 bg-white/[0.02]">
            {isAuthenticated ? (
               <UserCheck className={cn("h-4 w-4", isRoot ? "text-green-400" : "text-blue-400")} />
            ) : (
               <Info className="h-4 w-4 text-white" />
            )}
          </div>
          <div>
            <span className="block text-[9px] font-mono uppercase tracking-[0.4em] text-white/40">
              {isAuthenticated ? "User Session" : "Guest Access"}
            </span>
            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mt-1 block">
              Inquiry Form
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 border border-white/5 bg-white/[0.02]">
          <Activity size={10} className={cn("animate-pulse", isAuthenticated ? "text-green-400" : "text-yellow-400")} />
          <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Secure_Link</span>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        {/* Category Selection */}
        {showCategory && (
          <div className="space-y-4" data-error-id="category">
            <Label className={cn(
              "text-[9px] uppercase tracking-[0.3em] font-black ml-1 transition-colors",
              errors.includes('category') ? "text-red-500" : "text-white"
            )}>
              Select Category {errors.includes('category') && "[Required]"}
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {INDUSTRIAL_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = formData.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleInputChange('category', cat.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-5 gap-2 border transition-all duration-200 active:scale-[0.97] touch-manipulation",
                      isActive 
                        ? "border-white bg-white text-black" 
                        : "border-white/10 bg-white/[0.02] text-white hover:border-white/30",
                      errors.includes('category') && !isActive && "border-red-500/50"
                    )}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                    <span className="text-[8px] font-black uppercase tracking-widest">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* User Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className={cn("text-[9px] uppercase tracking-[0.3em] italic ml-1", errors.includes('firstName') ? "text-red-500" : "text-white")}>
              First Name *
            </Label>
            <Input 
              name="firstName"
              className={cn(
                "bg-white/[0.02] border-white/10 text-white h-14 rounded-none focus-visible:ring-1 focus-visible:ring-white/40 text-base md:text-xs",
                errors.includes('firstName') && "border-red-500"
              )} 
              value={formData.firstName} 
              onChange={(e) => handleInputChange('firstName', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[9px] uppercase tracking-[0.3em] italic ml-1 text-white">
              Last Name
            </Label>
            <Input 
              name="lastName"
              className="bg-white/[0.02] border-white/10 text-white h-14 rounded-none focus-visible:ring-1 focus-visible:ring-white/40 text-base md:text-xs" 
              value={formData.lastName} 
              onChange={(e) => handleInputChange('lastName', e.target.value)} 
            />
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className={cn("text-[9px] uppercase tracking-[0.3em] italic ml-1", errors.includes('email') ? "text-red-500" : "text-white")}>
              Email Address
            </Label>
            <Input 
              name="email"
              className={cn(
                "bg-white/[0.02] border-white/10 text-white h-14 rounded-none focus-visible:ring-1 focus-visible:ring-white/40 text-base md:text-xs",
                errors.includes('email') && "border-red-500"
              )} 
              type="email"
              value={formData.email} 
              onChange={(e) => handleInputChange('email', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className={cn("text-[9px] uppercase tracking-[0.3em] italic ml-1", errors.includes('phone') ? "text-red-500" : "text-white")}>
              Phone *
            </Label>
            <Input 
              name="phone"
              inputMode="tel"
              className={cn(
                "bg-white/[0.02] border-white/10 text-white h-14 rounded-none focus-visible:ring-1 focus-visible:ring-white/40 font-mono text-base md:text-xs",
                errors.includes('phone') && "border-red-500"
              )} 
              placeholder="03XXXXXXXXX" 
              value={formData.phone} 
              onChange={(e) => handleInputChange('phone', e.target.value)} 
            />
          </div>
        </div>

        {/* Subject & Message */}
    

        <div className="space-y-2">
          <Label className="text-[9px] uppercase tracking-[0.3em] text-white italic ml-1">Leave us a message...</Label>
          <Textarea 
            name="notes"
            className="bg-white/[0.02] border-white/10 text-white min-h-[100px] rounded-none focus-visible:ring-1 focus-visible:ring-white/40 text-base md:text-xs" 
            placeholder="Tell us about your requirements..." 
            value={formData.notes} 
            onChange={(e) => handleInputChange('notes', e.target.value)} 
          />
        </div>

        {/* INQUIRY ITEMS LIST - NOW HIDDEN ON DESKTOP */}
        {items.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-white/5 md:hidden">
            <Label className="text-[9px] uppercase tracking-[0.3em] font-black ml-1 text-white">
              Review Inquiry Items ({items.length})
            </Label>
            <div className="space-y-1 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-2">
              {renderedItems}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Submit */}
      <div className="pt-8 border-t border-white/5 relative z-10">
        <button
          type="submit"
          disabled={isProcessing || parentProcessing}
          className="w-full h-20 font-black uppercase tracking-[0.5em] text-[11px] rounded-none transition-all flex items-center justify-center gap-4 bg-white text-black hover:invert active:scale-[0.98] cursor-pointer disabled:opacity-50 touch-manipulation"
        >
          {isProcessing || parentProcessing ? (
            <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              <Zap className="h-4 w-4 fill-current" />
              <span>Submit Request</span>
            </>
          )}
        </button>
      </div>

      {errors.length > 0 && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[9px] font-mono text-red-500 animate-pulse z-20 bg-black/40 backdrop-blur-sm px-2 py-1">
          <AlertTriangle size={12} />
          <span>CHECK REQUIRED FIELDS</span>
        </div>
      )}
    </form>
  );
}