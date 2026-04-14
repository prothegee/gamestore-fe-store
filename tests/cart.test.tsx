import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart, CartProvider } from '../lib/hooks/useCart';
import { AuthProvider, useAuth } from '../lib/api/auth-context';
import { I18nProvider } from '../lib/i18n/i18n-context';
import { Game } from '../lib/api/dummy-data';
import React from 'react';

const mockGame: Game = {
  id: '1',
  title: 'Test Game',
  price: 50,
  imageUrl: '',
  aspectRatio: '16:9',
  tags: []
};

// Wrapper component to provide contexts
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nProvider initialLanguage="en">
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  </I18nProvider>
);

describe('useCart hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should not add item to cart if not authenticated', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockGame);
    });

    expect(result.current.cartItems).toHaveLength(0);
  });

  it('should add item to cart when authenticated', async () => {
    const { result } = renderHook(() => ({
      cart: useCart(),
      auth: useAuth()
    }), { wrapper });

    // Login first
    await act(async () => {
      await result.current.auth.login('demouser', 'demouser');
    });

    act(() => {
      result.current.cart.addToCart(mockGame);
    });

    expect(result.current.cart.cartItems).toHaveLength(1);
    expect(result.current.cart.cartItems[0].id).toBe('1');
    expect(result.current.cart.itemCount).toBe(1);
    expect(result.current.cart.total).toBe(50);
  });

  it('should increment quantity when adding the same item', async () => {
    const { result } = renderHook(() => ({
      cart: useCart(),
      auth: useAuth()
    }), { wrapper });

    await act(async () => {
      await result.current.auth.login('demouser', 'demouser');
    });

    act(() => {
      result.current.cart.addToCart(mockGame);
      result.current.cart.addToCart(mockGame);
    });

    expect(result.current.cart.cartItems).toHaveLength(1);
    expect(result.current.cart.cartItems[0].quantity).toBe(2);
    expect(result.current.cart.itemCount).toBe(2);
    expect(result.current.cart.total).toBe(100);
  });

  it('should remove item from cart', async () => {
    const { result } = renderHook(() => ({
      cart: useCart(),
      auth: useAuth()
    }), { wrapper });

    await act(async () => {
      await result.current.auth.login('demouser', 'demouser');
    });

    act(() => {
      result.current.cart.addToCart(mockGame);
    });

    expect(result.current.cart.cartItems).toHaveLength(1);

    act(() => {
      result.current.cart.removeFromCart('1');
    });

    expect(result.current.cart.cartItems).toHaveLength(0);
    expect(result.current.cart.itemCount).toBe(0);
    expect(result.current.cart.total).toBe(0);
  });
});
