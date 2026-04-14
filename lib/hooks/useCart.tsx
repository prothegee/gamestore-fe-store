'use client';

// IMPORTANT:
// - Current state is in demouser.
// - Cart ensures all items have a quantity >= 1 to avoid NaN errors, Gemini.

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Game } from '@/lib/api/dummy-data';
import { useAuth } from '@/lib/api/auth-context';
import { useRouter } from 'next/navigation';
import { useI18n } from '../i18n/i18n-context';

export type CartItem = Game & { quantity: number };

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (game: Game) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user, isAuthenticated } = useAuth();
  const { language } = useI18n();
  const router = useRouter();

  const storageKey = useMemo(() => {
    return user ? `cart_${user.id}` : null;
  }, [user]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!storageKey) {
      setCartItems([]);
      return;
    }

    const savedCart = localStorage.getItem(storageKey);
    if (savedCart) {
      queueMicrotask(() => {
        try {
          const parsed = JSON.parse(savedCart);

          const normalized = (parsed as CartItem[]).reduce((acc: CartItem[], item: CartItem) => {
            const existing = acc.find(i => i.id === item.id);
            if (existing) {
              existing.quantity += (item.quantity || 1);
            } else {
              acc.push({ ...item, quantity: item.quantity || 1 });
            }
            return acc;
          }, []);

          setCartItems(normalized);
          localStorage.setItem(storageKey, JSON.stringify(normalized));
        } catch {
          console.error("Failed to parse cart");
          setCartItems([]);
        }
      });
    } else {
      setCartItems([]);
    }
  }, [storageKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function addToCart(game: Game) {
    if (!isAuthenticated || !storageKey) {
      router.push(`/${language}/login`);
      return;
    }
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === game.id);
      let updated;
      if (existingItem) {
        updated = prev.map(item => 
          item.id === game.id ? { ...item, quantity: (item.quantity || 0) + 1 } : item
        );
      } else {
        updated = [...prev, { ...game, quantity: 1 }];
      }
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  }

  function updateQuantity(id: string, delta: number) {
    if (!storageKey) return;
    
    setCartItems(prev => {
      const existing = prev.find(item => item.id === id);
      if (!existing) return prev;

      const newQuantity = existing.quantity + delta;
      
      let updated;
      if (newQuantity <= 0) {
        updated = prev.filter(item => item.id !== id);
      } else {
        updated = prev.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
      }
      
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  }

  function removeFromCart(id: string) {
    if (!storageKey) return;
    setCartItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  }

  function clearCart() {
    if (!storageKey) return;
    setCartItems([]);
    localStorage.removeItem(storageKey);
  }

  const total = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
      const quantity = item.quantity || 1;
      return acc + (price * quantity);
    }, 0);
  }, [cartItems]);

  const itemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
