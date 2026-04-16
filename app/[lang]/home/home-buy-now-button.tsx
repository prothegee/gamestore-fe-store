'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/api/auth-context';
import { useCart } from '@/lib/hooks/useCart';
import { Button } from '@/components/Button';
import { Game } from '@/lib/api/dummy-data';

export function HomeBuyNowButton({ game, label, lang }: { game: Game, label: string, lang: string }) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push(`/${lang}/login`);
      return;
    }
    addToCart(game);
    router.push(`/${lang}/cart`);
  }

  return (
    <Button onClick={handleBuyNow} variant="primary" className="px-4 md:px-6 text-xs md:text-sm">
      {label}
    </Button>
  );
}
