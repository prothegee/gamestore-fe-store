'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/api/auth-context';
import { useCart } from '@/lib/hooks/useCart';
import { Button } from '@/components/Button';
import { Game } from '@/lib/api/dummy-data';

export function AddToCartButton({ game, label, lang }: { game: Game; label: string; lang: string }) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    if (!isAuthenticated) {
      router.push(`/${lang}/login`);
      return;
    }

    addToCart(game);

    // Optimistic feedback: show "Added!" for 1.5 s
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Button
      onClick={handleAddToCart}
      variant={added ? 'secondary' : 'primary'}
      className="!px-2 !py-1 ml-4 text-[10px] md:text-xs font-bold uppercase transition-all"
    >
      {added ? 'Added!' : label}
    </Button>
  );
}
