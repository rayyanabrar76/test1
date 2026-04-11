import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/store';

interface CartState {
  cart: CartItem[];
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'qty'>) => void;
  updateQty: (productId: string, delta: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

// Safety lock to prevent multiple opens at the exact same time
let lastToggleTime = 0;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isDrawerOpen: false,

      setIsDrawerOpen: (open) => {
        const now = Date.now();
        
        // If we are trying to open the drawer
        if (open) {
          // If it was already opened in the last 500ms, ignore this second request
          if (now - lastToggleTime < 500) return;
          lastToggleTime = now;
        }
        
        set({ isDrawerOpen: open });
      },

      addToCart: (item) => {
        const currentCart = Array.isArray(get().cart) ? get().cart : [];
        const existing = currentCart.find((i) => i.productId === item.productId);

        if (existing) {
          set({
            cart: currentCart.map((i) =>
              i.productId === item.productId ? { ...i, qty: i.qty + 1 } : i
            ),
            // REMOVED: isDrawerOpen: true (This prevents auto-opening)
          });
        } else {
          set({ 
            cart: [...currentCart, { ...item, qty: 1 }],
            // REMOVED: isDrawerOpen: true (This prevents auto-opening)
          });
        }
      },

      updateQty: (productId, delta) => {
        const currentCart = Array.isArray(get().cart) ? get().cart : [];
        const updated = currentCart
          .map((item) =>
            item.productId === productId ? { ...item, qty: item.qty + delta } : item
          )
          .filter((item) => item.qty > 0);
        set({ cart: updated });
      },

      removeItem: (productId) => {
        const currentCart = Array.isArray(get().cart) ? get().cart : [];
        set({ cart: currentCart.filter((i) => i.productId !== productId) });
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'aps_cart',
      skipHydration: true,
      // Persist ONLY the cart items. Do NOT persist the open/closed state.
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

export const useCartTotal = () => {
  const cart = useCart((state) => state.cart);
  const safeCart = Array.isArray(cart) ? cart : [];
  const totalItems = safeCart.reduce((sum, item) => sum + (item.qty || 0), 0);
  const totalPrice = safeCart.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 0)), 0);
  
  return { 
    totalItems, 
    totalPrice, 
    cart: safeCart 
  };
};