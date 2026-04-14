'use client';

import { use } from 'react';
import Image from 'next/image';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/api/auth-context';
import { getGameById } from '@/lib/api/dummy-data';
import { useI18n } from '@/lib/i18n/i18n-context';
import { useRouter } from 'next/navigation';
import { Language } from '@/lib/i18n/translations';

export default function GameDetailPage({ params }: { params: Promise<{ id: string, lang: string }> }) {
  const { id, lang } = use(params);
  const { t, language } = useI18n();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const game = getGameById(id, lang as Language);

  if (!game) return <div className="py-20 text-center text-white font-bold">Game not found</div>;

  const finalPrice = game.discount ? game.price * (1 - game.discount / 100) : game.price;

  function handleAddToCart() {
    if (!game) return;

    if (!isAuthenticated) {
      router.push(`/${language}/login`);
      return;
    }

    addToCart(game);
  }

  return (
    <div className="py-12">
      <Container>
        <div className="flex flex-col md:flex-row gap-12">
          <div className="grow">
            <h1 className="text-4xl font-bold text-white mb-6 uppercase tracking-widest">{game.title}</h1>
            <div className="aspect-video relative rounded overflow-hidden shadow-2xl border border-white/5">
               <Image
                src={game.imageUrl}
                alt={game.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
               />
            </div>

            <div className="mt-8 flex gap-2">
              {game.tags.map(tag => (
                <span key={tag} className="bg-steam-darkest px-3 py-1 rounded-sm text-xs text-steam-light uppercase font-bold border border-white/5">{tag}</span>
              ))}
            </div>

            <div className="mt-12 prose prose-invert max-w-none text-gray-400">
               <p>{game.description || `Experience the award-winning masterpiece ${game.title}. Immerse yourself in a world of high-stakes action and breathtaking visuals.`}</p>
               <p>This version includes all previously released digital content and enhancements for the ultimate experience.</p>
            </div>
          </div>

          <div className="md:w-96 flex flex-col gap-8">
             <div className="bg-steam-darkest/60 p-8 rounded shadow-2xl border border-white/5">
                <div className="flex flex-col gap-4 mb-8">
                   <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Buy {game.title}</span>
                   <div className="flex items-center justify-between bg-black/40 p-4 rounded">
                      <div className="flex items-center gap-4">
                        {game.discount && (
                          <div className="bg-[#4c6b22] text-[#beee11] px-2 py-1 text-lg font-bold rounded-sm">
                            -{game.discount}%
                          </div>
                        )}
                        <div className="flex flex-col">
                           {game.discount && <span className="text-[10px] text-gray-500 line-through">${game.price.toFixed(2)}</span>}
                           <span className="text-lg font-bold text-steam-light">${finalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                      <Button 
                        onClick={handleAddToCart} 
                        variant="primary"
                        className="!px-2 !py-1 ml-4 text-[10px] md:text-xs font-bold uppercase"
                      >
                        {t('common.add_to_cart')}
                      </Button>
                   </div>
                </div>

                <div className="flex flex-col gap-4 text-xs">
                   <div className="flex justify-between border-b border-gray-800 pb-2">
                      <span className="text-gray-500">Developer</span>
                      <span className="text-steam-light">Studio Red</span>
                   </div>
                   <div className="flex justify-between border-b border-gray-800 pb-2">
                      <span className="text-gray-500">Publisher</span>
                      <span className="text-steam-light">GameStore Publishing</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-gray-500">Release Date</span>
                      <span className="text-gray-300">Oct 26, 2023</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
