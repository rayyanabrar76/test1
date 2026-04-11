// @/types/store.ts

export interface ProductVariant {
  kva: number;
  model: string;
  images: string[];
  pdf_link?: string;
  price?: number; // Optional if you want different prices per kVA
}

export interface Product {
  id: string;
  brand: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  gallery?: string[];
  category: string;
  variants?: ProductVariant[]; // Added to support 10kVA, 20kVA, etc.
  pdf_link?: string; // Single PDF for simple products
  pdf_links?: string[]; // Array of PDFs for series/multi-model products
  badges?: string[]; 
  metadata: {
    // Standard SEO/Identity fields
    slug?: string;
    metaTitle?: string;
    metaDescription?: string;

    // Technical fields
    thermal_limit?: string;
    logic_board?: string;
    interface?: string;
    prime_power?: string;
    standby_power?: string;
    engine_model?: string;
    alternator?: string;
    voltage_reg?: string;
    displacement?: string;
    fuel_system?: string;
    emissions?: string;

    /**
     * FLEXIBLE INDEX SIGNATURE
     */
    [key: string]: string | any[] | Record<string, any> | undefined;
  };
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  selectedKva?: number; // Added to track which variant is in the cart
  metadata?: Product['metadata'];
}

export interface Order {
  id?: string;
  items: CartItem[];
  total: number;
  customerName: string;
  phone: string;
  address: string;
  createdAt?: string;
  status?: 'pending' | 'processing' | 'deployed' | 'cancelled';
  terminalId?: string;
}