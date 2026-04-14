'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/Container';
import { GameCard } from '@/components/GameCard';
import { Button } from '@/components/Button';
import { getFeaturedGames } from '@/lib/api/dummy-data';
import { useI18n } from '@/lib/i18n/i18n-context';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/api/auth-context';
import { useRouter } from 'next/navigation';
import { Language } from '@/lib/i18n/translations';

export default function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const { t, language } = useI18n();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Concurrent fetch (mock)
  const games = getFeaturedGames(lang as Language);
  const mainFeatured = games[0];
  const specialOffers = games.filter(g => g.discount).slice(0, 9);
  const trending = games.slice(1, 11);

  function handleBuyNow(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push(`/${language}/login`);
      return;
    }
    addToCart(mainFeatured);
    router.push(`/${language}/cart`);
  }

  return (
    <div className="pb-10 md:pb-20">
      {/* Hero Section */}
      <section className="bg-linear-to-b from-steam-darkest to-steam-darker pt-6 md:pt-10 pb-10 md:pb-20 overflow-hidden">
        <Container>
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-stretch">
            <div
              onClick={() => router.push(`/${language}/game/${mainFeatured.id}`)}
              className="grow shadow-2xl relative group cursor-pointer rounded-sm overflow-hidden"
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={mainFeatured.imageUrl}
                  alt={mainFeatured.title}
                  fill
                  priority={true}
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-r from-black/80 to-transparent p-6 md:p-12 flex flex-col justify-end">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">{mainFeatured.title}</h1>
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
                  {mainFeatured.tags.map(tag => (
                    <span key={tag} className="bg-white/10 px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs text-gray-300">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <Button onClick={handleBuyNow} variant="primary" className="px-4 md:px-6 text-xs md:text-sm">{t('common.buy_now')}</Button>
                  <span className="text-xl md:text-2xl font-bold text-steam-light">${(mainFeatured.price * (1 - (mainFeatured.discount || 0)/100)).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="lg:w-80 flex flex-col gap-3 md:gap-4">
              <h2 className="text-[10px] md:text-sm font-bold tracking-widest uppercase text-gray-400">{t('home.featured')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
                 {trending.map(game => (
                    <div
                      key={game.id}
                      onClick={() => router.push(`/${language}/game/${game.id}`)}
                      className="flex gap-3 md:gap-4 group cursor-pointer bg-steam-darkest/30 hover:bg-steam-darkest/60 p-2 rounded transition-all"
                    >
                       <div className="relative w-20 md:w-24 h-12 md:h-16 shrink-0">
                        <Image
                          src={game.imageUrl}
                          alt={game.title}
                          fill
                          sizes="100px"
                          className="object-cover rounded-sm"
                        />
                       </div>
                       <div className="flex flex-col justify-center overflow-hidden">
                          <span className="text-xs md:text-sm font-medium group-hover:text-steam-light transition-colors truncate">{game.title}</span>
                          <span className="text-[10px] md:text-xs text-gray-500">${game.price.toFixed(2)}</span>
                       </div>
                    </div>
                 ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Special Offers */}
      <section className="py-8 md:py-12">
        <Container>
          <div className="flex justify-between items-end mb-6 md:mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2 uppercase tracking-wider">{t('home.special_offers')}</h2>
              <div className="h-1 w-16 md:h-1 md:w-20 bg-steam-light"></div>
            </div>
            <Link href={`/${lang}/store`}>
              <Button variant="outline" className="text-[10px] md:text-sm px-3 md:px-6">{t('common.browse_more')}</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {specialOffers.map(game => (
              <GameCard 
                key={game.id}
                id={game.id}
                title={game.title}
                price={game.price}
                discount={game.discount}
                imageUrl={game.imageUrl}
                aspectRatio="16:9"
              />
            ))}
          </div>
        </Container>
      </section>

      {/* New & Trending */}
      <section className="py-8 md:py-12 bg-steam-darkest/20">
        <Container>
           <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 uppercase tracking-wider">{t('home.new_trending')}</h2>
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {games.slice(0, 10).map(game => (
                <GameCard 
                  key={game.id}
                  id={game.id}
                  title={game.title}
                  price={game.price}
                  imageUrl={game.imageUrl}
                  aspectRatio="1:1"
                />
              ))}
           </div>
        </Container>
      </section>
    </div>
  );
}
