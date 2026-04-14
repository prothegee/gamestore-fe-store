'use client';

import { use, useState, useEffect, useRef, useCallback } from 'react';
import { Container } from '@/components/Container';
import { GameCard } from '@/components/GameCard';
import { getGamesPaged, Game } from '@/lib/api/dummy-data';
import { useI18n } from '@/lib/i18n/i18n-context';
import { Language } from '@/lib/i18n/translations';

export default function StorePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const { t } = useI18n();

  const [games, setGames] = useState<Game[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const observer = useRef<IntersectionObserver | null>(null);

  // Debounce search term to avoid too many mock API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const lastGameElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Reset when language or search term changes
  useEffect(() => {
    setGames([]);
    setPage(1);
    setHasMore(true);
  }, [lang, debouncedSearch]);

  // TODO:
  // - Fetch 2 data in the background
  useEffect(() => {
    async function backgroundTasks() {
      const task1 = new Promise((resolve) => {
        setTimeout(() => resolve("Success data 1"), 2000);
      });
      const task2 = new Promise((resolve) => {
        setTimeout(() => resolve("Success data 2"), 3500);
      });

      // Execute concurrently
      const [n1, n2] = await Promise.all([task1, task2]);

      console.log(`TASK1: ${n1}`);
      console.log(`TASK2: ${n2}`);
    }

    backgroundTasks();
  }, []);

  useEffect(() => {
    async function loadGames() {
      setLoading(true);
      try {
        const result = await getGamesPaged(lang as Language, page, 12, debouncedSearch);
        setGames(prev => [...prev, ...result.games]);
        setHasMore(result.hasMore);
      } catch (error) {
        console.error("Failed to load games:", error);
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, [lang, page, debouncedSearch]);

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
                Browse our extensive collection of games. From AAA masterpieces to hidden indie gems, we have something for everyone.
              </p>
            </div>
 
            {/* Search Bar */}
            <div className="w-full md:w-80 relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-steam-light/50 group-focus-within:text-steam-light transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text"
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-steam-darkest/60 border border-white/10 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-steam-light/50 focus:border-steam-light transition-all text-xs font-bold"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10 md:py-16">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
                {debouncedSearch ? `Search Results: "${debouncedSearch}"` : "All Games"}
              </h2>
              <div className="h-1 w-12 bg-steam-light mt-2"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game, index) => {
              const uniqueKey = `${game.id}-${index}-${debouncedSearch}`;
              if (games.length === index + 1) {
                return (
                  <div ref={lastGameElementRef} key={uniqueKey}>
                    <GameCard 
                      id={game.id}
                      title={game.title}
                      price={game.price}
                      discount={game.discount}
                      imageUrl={game.imageUrl}
                      aspectRatio="16:9"
                    />
                  </div>
                );
              } else {
                return (
                  <GameCard 
                    key={uniqueKey}
                    id={game.id}
                    title={game.title}
                    price={game.price}
                    discount={game.discount}
                    imageUrl={game.imageUrl}
                    aspectRatio="16:9"
                  />
                );
              }
            })}
          </div>

          {loading && (
            <div className="flex justify-center mt-10">
              <div className="flex items-center gap-3 bg-steam-darkest/60 px-6 py-3 rounded-full border border-white/5">
                <div className="w-5 h-5 border-2 border-steam-light border-t-transparent rounded-full animate-spin"></div>
                <span className="text-steam-light font-medium text-sm">Loading results...</span>
              </div>
            </div>
          )}

          {!hasMore && games.length > 0 && (
            <div className="text-center mt-10 text-gray-500 text-sm">
              No more games found
            </div>
          )}

          {!loading && games.length === 0 && (
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
