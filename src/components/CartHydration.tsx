// components/CartHydration.tsx
'use client';

import { useEffect } from 'react';
import { useCart } from '@/hooks/useCart'; // adjust this path to your store file

export default function CartHydration() {
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);

  return null;
}