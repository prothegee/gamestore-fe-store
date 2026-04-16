'use client';

// IMPORTANT:
// - Current state is in demouser.
// - Cart ensures all items have a quantity >= 1 to avoid NaN errors, Gemini.

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useRef } from 'react';
import { Game } from '@/lib/api/dummy-data';
import { useAuth } from '@/lib/api/auth-context';
import { useRouter } from 'next/navigation';
import { useI18n } from '../i18n/i18n-context';
import { UserProfile } from '../api/account';

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

export function CartProvider({ 
  children
}: { 
  children: ReactNode
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user, isAuthenticated } = useAuth();
  const { language } = useI18n();
  const router = useRouter();

  const storageKey = useMemo(() => {
    return user ? `cart_${user.id}` : null;
  }, [user]);

  // Use a ref to track if the update is coming from our own state changes
  const isInternalUpdate = useRef(false);

  // Handle initial load and external updates
  useEffect(() => {
    const syncCart = (event?: Event) => {
      if (!storageKey) {
        setCartItems([]);
        return;
      }

      // If this is a cart-update event we dispatched ourselves, skip it.
      if (event?.type === 'cart-update' && isInternalUpdate.current) {
        return;
      }
      
      const savedCart = localStorage.getItem(storageKey);
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart) as CartItem[];
          const normalized = parsed.map(item => ({
            ...item,
            quantity: Math.max(1, item.quantity || 1)
          }));
          
          setCartItems(normalized);
        } catch {
          console.error("Failed to parse cart");
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };

    syncCart();
    
    window.addEventListener('storage', syncCart);
    window.addEventListener('cart-update', syncCart);
    return () => {
      window.removeEventListener('storage', syncCart);
      window.removeEventListener('cart-update', syncCart);
    };
  }, [storageKey]);

  // Persist changes to localStorage and notify other components
  useEffect(() => {
    if (!storageKey) return;
    
    if (isInternalUpdate.current) {
      if (cartItems.length === 0) {
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, JSON.stringify(cartItems));
      }
      window.dispatchEvent(new Event('cart-update'));
      
      // Reset the flag. Since effects run after the render and event dispatch
      // is synchronous, any local listeners would have finished.
      isInternalUpdate.current = false;
    }
  }, [cartItems, storageKey]);

  function addToCart(game: Game) {
    if (!isAuthenticated || !storageKey) {
      router.push(`/${language}/login`);
      return;
    }
    
    isInternalUpdate.current = true;
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === game.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === game.id ? { ...item, quantity: (item.quantity || 0) + 1 } : item
        );
      }
      return [...prev, { ...game, quantity: 1 }];
    });
  }

  function updateQuantity(id: string, delta: number) {
    if (!storageKey) return;
    
    isInternalUpdate.current = true;
    setCartItems(prev => {
      const existing = prev.find(item => item.id === id);
      if (!existing) return prev;

      const newQuantity = existing.quantity + delta;
      
      if (newQuantity <= 0) {
        return prev.filter(item => item.id !== id);
      }
      return prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
    });
  }

  function removeFromCart(id: string) {
    if (!storageKey) return;
    isInternalUpdate.current = true;
    setCartItems(prev => prev.filter(item => item.id !== id));
  }

  function clearCart() {
    if (!storageKey) return;
    isInternalUpdate.current = true;
    setCartItems([]);
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
