'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/i18n-context';

type GameCardProps = {
  id: string;
  title: string;
  price: number;
  discount?: number;
  imageUrl: string;
  aspectRatio?: '1:1' | '16:9' | '21:9';
};

export function GameCard({ id, title, price, discount, imageUrl, aspectRatio = '16:9' }: GameCardProps) {
  const { language } = useI18n();

  const ratioClasses = {
    '1:1': 'aspect-square',
    '16:9': 'aspect-video',
    '21:9': 'aspect-[21/9]'
  };

  const finalPrice = discount ? price * (1 - discount / 100) : price;

  return (
    <Link href={`/${language}/game/${id}`} className="group flex flex-col h-full bg-steam-darkest/40 hover:bg-steam-darkest/80 transition-all rounded-sm overflow-hidden border border-transparent hover:border-steam-light/30 shadow-xl">
      <div className={`relative w-full ${ratioClasses[aspectRatio]} overflow-hidden`}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          loading='eager'
        />
        {discount && (
          <div className="absolute bottom-2 left-2 bg-[#4c6b22] text-[#beee11] px-1.5 py-0.5 text-xl font-bold rounded-sm z-10">
            -{discount}%
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col justify-between grow gap-2">
        <div className="flex flex-col gap-1 overflow-hidden">
          <h3 className="text-steam-text group-hover:text-steam-light transition-colors font-medium line-clamp-2 leading-tight min-h-10">{title}</h3>
        </div>
        <div className="flex items-center gap-2 text-sm mt-auto">
          {discount ? (
            <div className="flex items-center gap-2">
              <span className="line-through text-gray-500 text-[10px] md:text-xs">${price.toFixed(2)}</span>
              <span className="text-steam-light font-bold">${finalPrice.toFixed(2)}</span>
            </div>
          ) : (
            <span className="text-steam-text font-bold">${price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
