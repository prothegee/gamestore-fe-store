import { Language } from "../i18n/translations";

import { RawGames } from "./dummy-data-mock";
export interface Game {
  id: string;
  title: string;
  price: number;
  discount?: number;
  imageUrl: string;
  aspectRatio: '1:1' | '16:9' | '21:9';
  tags: string[];
  description?: string;
}

// --------------------------------------------------------- //

export function getFeaturedGames(lang: Language): Game[] {
  return RawGames.map(game => ({
    id: game.id,
    title: game.titles[lang] || game.titles.en,
    price: game.price,
    discount: game.discount,
    imageUrl: game.imageUrl,
    aspectRatio: game.aspectRatio,
    tags: game.tagList[lang] || game.tagList.en,
    // TMP: ignore, define later
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    description: (game as any).descriptions?.[lang] || (game as any).descriptions?.en
  }));
}

export async function getGamesPaged(
  lang: Language, 
  page: number = 1, 
  limit: number = 12,
  search: string = ''
): Promise<{ games: Game[], hasMore: boolean }> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  const query = search.toLowerCase().trim();

  // Filter games based on search query if provided
  const filteredRaw = query 
    ? RawGames.filter(game => {
        const titleMatch = 
          game.titles.en.toLowerCase().includes(query) || 
          game.titles.id.toLowerCase().includes(query);

        const tagsMatch = 
          game.tagList.en.some(tag => tag.toLowerCase().includes(query)) ||
          game.tagList.id.some(tag => tag.toLowerCase().includes(query));
          
        return titleMatch || tagsMatch;
      })
    : RawGames;
  
  const start = (page - 1) * limit;
  const end = start + limit;
  const sliced = filteredRaw.slice(start, end);
  
  const games = sliced.map(game => ({
    id: game.id,
    title: game.titles[lang] || game.titles.en,
    price: game.price,
    discount: game.discount,
    imageUrl: game.imageUrl,
    aspectRatio: game.aspectRatio,
    tags: game.tagList[lang] || game.tagList.en,
    // TMP: ignore, define later
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    description: (game as any).descriptions?.[lang] || (game as any).descriptions?.en
  }));

  return {
    games,
    hasMore: end < filteredRaw.length
  };
}

export function getGameById(id: string, lang: Language): Game | undefined {
  const game = RawGames.find(g => g.id === id);
  if (!game) return undefined;

  return {
    id: game.id,
    title: game.titles[lang] || game.titles.en,
    price: game.price,
    discount: game.discount,
    imageUrl: game.imageUrl,
    aspectRatio: game.aspectRatio,
    tags: game.tagList[lang] || game.tagList.en,
    // TMP: ignore, define later
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    description: (game as any).descriptions?.[lang] || (game as any).descriptions?.en
  };
}
