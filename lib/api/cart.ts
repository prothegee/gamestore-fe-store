'use server';

import { cookies } from 'next/headers';
import { getSession } from './account';
import { getGameById } from '@/lib/api/dummy-data';
import { Language } from '../i18n/translations';
import { CartItem } from '@/lib/hooks/useCart';

type CartEntry = { gameId: string; quantity: number };

async function readCartCookie(): Promise<CartEntry[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get('cart')?.value;
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CartEntry[];
  } catch {
    return [];
  }
}

async function writeCartCookie(entries: CartEntry[]): Promise<void> {
  const cookieStore = await cookies();
  if (entries.length === 0) {
    cookieStore.delete('cart');
    return;
  }
  cookieStore.set('cart', JSON.stringify(entries), {
    httpOnly: false, // client needs to read for optimistic sync
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
}

/** Hydrate cart entries into full CartItem objects. */
export async function getCart(lang: string): Promise<CartItem[]> {
  const session = await getSession();
  if (!session) return [];

  const entries = await readCartCookie();
  const items: CartItem[] = [];
  for (const entry of entries) {
    const game = getGameById(entry.gameId, lang as Language);
    if (game) {
      items.push({ ...game, quantity: entry.quantity });
    }
  }
  return items;
}

export async function addToCartAction(gameId: string): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error('Not authenticated');

  const entries = await readCartCookie();
  const existing = entries.find(e => e.gameId === gameId);
  const next: CartEntry[] = existing
    ? entries.map(e => e.gameId === gameId ? { ...e, quantity: e.quantity + 1 } : e)
    : [...entries, { gameId, quantity: 1 }];

  await writeCartCookie(next);
}

export async function removeFromCartAction(gameId: string): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error('Not authenticated');

  const entries = await readCartCookie();
  await writeCartCookie(entries.filter(e => e.gameId !== gameId));
}

export async function updateQuantityAction(gameId: string, delta: number): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error('Not authenticated');

  const entries = await readCartCookie();
  const existing = entries.find(e => e.gameId === gameId);
  if (!existing) return;

  const newQty = existing.quantity + delta;
  const next: CartEntry[] = newQty <= 0
    ? entries.filter(e => e.gameId !== gameId)
    : entries.map(e => e.gameId === gameId ? { ...e, quantity: newQty } : e);

  await writeCartCookie(next);
}

export async function clearCartAction(): Promise<void> {
  await writeCartCookie([]);
}
