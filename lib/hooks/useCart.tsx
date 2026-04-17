'use client';

// IMPORTANT:
// - Cart state is initialised from the server (cookie) and kept in sync via server actions.
// - Mutations use functional setState so batched calls always build on the latest state.
// - Server actions update the cart cookie in the background; errors are logged but do not
//   roll back the UI (acceptable for a demo app where cookie writes won't fail).

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Game } from '@/lib/api/dummy-data';
import { useAuth } from '@/lib/api/auth-context';
import { useRouter } from 'next/navigation';
import { useI18n } from '../i18n/i18n-context';
import {
  addToCartAction,
  removeFromCartAction,
  updateQuantityAction,
  clearCartAction,
} from '@/lib/api/cart';

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
  children,
  initialCart = [],
}: {
  children: ReactNode;
  initialCart?: CartItem[];
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);
  const { isAuthenticated } = useAuth();
  const { language } = useI18n();
  const router = useRouter();

  function addToCart(game: Game) {
    if (!isAuthenticated) {
      router.push(`/${language}/login`);
      return;
    }

    // Functional update so batched calls each build on the latest state
    setCartItems(prev => {
      const existing = prev.find(item => item.id === game.id);
      return existing
        ? prev.map(item =>
            item.id === game.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...prev, { ...game, quantity: 1 }];
    });

    addToCartAction(game.id).catch(err =>
      console.error('Cart server action failed (addToCart)', err)
    );
  }

  function updateQuantity(id: string, delta: number) {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === id);
      if (!existing) return prev;
      const newQty = existing.quantity + delta;
      return newQty <= 0
        ? prev.filter(item => item.id !== id)
        : prev.map(item =>
            item.id === id ? { ...item, quantity: newQty } : item
          );
    });

    updateQuantityAction(id, delta).catch(err =>
      console.error('Cart server action failed (updateQuantity)', err)
    );
  }

  function removeFromCart(id: string) {
    setCartItems(prev => prev.filter(item => item.id !== id));
    removeFromCartAction(id).catch(err =>
      console.error('Cart server action failed (removeFromCart)', err)
    );
  }

  function clearCart() {
    setCartItems([]);
    clearCartAction().catch(err =>
      console.error('Cart server action failed (clearCart)', err)
    );
  }

  const total = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
      return acc + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const itemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
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
