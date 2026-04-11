'use client';

import { useEffect, useState } from "react";
import { CartDrawer } from "@/components/CartDrawer"; 
import { useCart } from "@/hooks/useCart"; 

export function CartDrawerContainer() {
  const [mounted, setMounted] = useState(false);
  
  // Select specific parts of the store to prevent unnecessary re-renders
  const cart = useCart((state) => state.cart);
  const isOpen = useCart((state) => state.isDrawerOpen);
  const setIsOpen = useCart((state) => state.setIsDrawerOpen);

  // Handle Hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <CartDrawer 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)} 
      items={cart || []} // Ensure items is always an array
    />
  );
}