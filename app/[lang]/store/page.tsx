import { Container } from '@/components/Container';
import { GameCard } from '@/components/GameCard';
import { getGamesPaged } from '@/lib/api/dummy-data';
import { getTranslations } from '@/lib/i18n/get-translations';
import { Language } from '@/lib/i18n/translations';
import { StoreSearch } from './store-search';
import Link from 'next/link';

export default async function StorePage({ 
  params,
  searchParams
}: { 
  params: Promise<{ lang: string }>,
  searchParams: Promise<{ q?: string, page?: string }>
}) {
  const { lang } = await params;
  const { q, page: pageStr } = await searchParams;
  const { t } = getTranslations(lang);

  const page = parseInt(pageStr || '1', 10);
  const searchTerm = q || '';

  const result = await getGamesPaged(lang as Language, page, 12, searchTerm);
  const { games, hasMore } = result;

  return (
    <div className="pb-10 md:pb-20">
      <section className="bg-steam-darkest py-10 md:py-16 border-b border-white/5">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="grow">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 uppercase tracking-tighter">
                {t('nav.store')}
              </h1>
              <p className="text-gray-400 max-w-2xl text-sm md:text-base">
                {t('store.description')}
              </p>
            </div>
 
            {/* Search Bar (Client Component for instant typing/URL sync) */}
            <StoreSearch initialValue={searchTerm} placeholder={t('common.search')} />
          </div>
        </Container>
      </section>

      <section className="py-10 md:py-16">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
                {searchTerm ? `Search Results: "${searchTerm}"` : "All Games"}
              </h2>
              <div className="h-1 w-12 bg-steam-light mt-2"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game) => (
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

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-12">
            {page > 1 && (
              <Link 
                href={`/${lang}/store?q=${searchTerm}&page=${page - 1}`}
                className="bg-steam-darkest text-white px-6 py-2 rounded font-bold hover:bg-steam-light hover:text-steam-darkest transition-all uppercase text-xs"
              >
                Previous
              </Link>
            )}
            
            <span className="text-gray-400 text-sm font-bold">
              Page {page}
            </span>

            {hasMore && (
              <Link 
                href={`/${lang}/store?q=${searchTerm}&page=${page + 1}`}
                className="bg-steam-darkest text-white px-6 py-2 rounded font-bold hover:bg-steam-light hover:text-steam-darkest transition-all uppercase text-xs"
              >
                Next
              </Link>
            )}
          </div>

          {games.length === 0 && (
            <div className="text-center mt-20">
              <div className="text-5xl mb-4 opacity-20">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">No matching games</h3>
              <p className="text-gray-500">Try adjusting your search terms or clearing the filter.</p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
