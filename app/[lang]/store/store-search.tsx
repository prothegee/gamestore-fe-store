'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function StoreSearch({ initialValue, placeholder }: { initialValue: string, placeholder: string }) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== initialValue) {
        router.push(`${pathname}?q=${encodeURIComponent(value)}&page=1`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value, initialValue, router, pathname]);

  return (
    <div className="w-full md:w-80 relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-steam-light/50 group-focus-within:text-steam-light transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input 
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-steam-darkest/60 border border-white/10 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-steam-light/50 focus:border-steam-light transition-all text-xs font-bold"
      />
      {value && (
        <button 
          onClick={() => setValue('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
