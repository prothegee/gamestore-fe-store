'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/i18n-context';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/api/auth-context';

export function Navbar() {
  const { t, language, setLanguage } = useI18n();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleLanguageSelect(lang: 'en' | 'id') {
    setLanguage(lang);
    setIsLangOpen(false);
  }

  const navLinks = [
    { name: t('nav.store'), href: `/${language}/store` },
    { name: t('nav.community'), href: `/${language}/community` },
    { name: t('nav.about'), href: `/${language}/about` },
    { name: t('nav.support'), href: `/${language}/support` },
  ];

  return (
    <>
      <nav className="bg-steam-darkest text-steam-text py-3 md:py-4 px-4 md:px-8 shadow-2xl sticky top-0 z-1000 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            {/* Mobile Menu Toggle - Explicit Toggle */}
            <button 
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsLangOpen(false);
              }}
              className="lg:hidden text-white p-2 bg-white/5 rounded-md active:bg-white/20"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" suppressHydrationWarning>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            <Link href={`/${language}/home`} className="text-xl md:text-2xl font-bold tracking-widest text-white flex items-center shrink-0">
              <span className="bg-steam-light text-steam-darkest px-1.5 md:px-2 py-0.5 md:py-1 rounded mr-1.5 md:mr-2">G</span>
              <span className="hidden xs:inline">GAMESTORE</span>
            </Link>

            <div className="hidden lg:flex gap-6 font-medium text-sm">
              {navLinks.map(link => (
                <Link key={link.name} href={link.href} className="hover:text-white transition-colors uppercase tracking-wider">{link.name}</Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs">
            {/* Language Dropdown - Explicit Toggle */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsMobileMenuOpen(false);
                }}
                className="text-steam-text hover:text-white uppercase flex items-center gap-1 font-bold tracking-tighter px-3 py-1.5 bg-white/5 rounded-md border border-white/5 active:bg-white/10"
              >
                <span className="hidden xs:inline text-steam-light/60">LANG:</span> {language}
                <span className={`text-[8px] transition-transform ${isLangOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-steam-darkest border border-white/10 shadow-2xl rounded-md py-2 z-210 overflow-hidden">
                  <button 
                    onClick={() => handleLanguageSelect('en')}
                    className={`w-full text-left px-4 py-3 hover:bg-steam-light hover:text-steam-darkest transition-colors uppercase font-bold ${language === 'en' ? 'text-steam-light' : 'text-inherit'}`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => handleLanguageSelect('id')}
                    className={`w-full text-left px-4 py-3 hover:bg-steam-light hover:text-steam-darkest transition-colors uppercase font-bold ${language === 'id' ? 'text-steam-light' : 'text-inherit'}`}
                  >
                    Indonesian
                  </button>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-white/10 mx-1"></div>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href={`/${language}/profile`} className="text-steam-light hover:text-white uppercase transition-colors font-bold px-1">
                  {user?.username}
                </Link>
                <button onClick={logout} className="hover:text-white uppercase transition-colors font-bold px-1 text-[10px] opacity-50">
                  {t('auth.logout')}
                </button>
              </div>
            ) : (
              <Link href={`/${language}/login`} className="hover:text-white uppercase transition-colors font-bold px-1">{t('auth.login')}</Link>
            )}

            <Link href={`/${language}/cart`} className="bg-steam-dark text-steam-light hover:bg-steam-dark/80 hover:brightness-125 px-2 md:px-4 py-1.5 rounded-sm transition-all flex items-center gap-2 font-bold active:scale-95">
               <span className="md:hidden text-base">🛒</span>
               <span className="hidden md:inline tracking-widest">{t('common.cart')}</span>
               {itemCount > 0 && (
                 <span className="bg-steam-light text-steam-darkest px-1.5 py-0.5 rounded-full text-[10px] min-w-[1.25rem] text-center">
                   {itemCount}
                 </span>
               )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Explicit Close Overlay for Language Dropdown */}
      {isLangOpen && (
        <div
          className="fixed inset-0 z-999 bg-transparent"
          onClick={() => setIsLangOpen(false)}
        />
      )}

      {/* Mobile Nav Overlay - Full Screen with high Z-Index */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-2000">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="relative bg-steam-darkest w-72 h-full shadow-2xl border-r border-white/10 p-8 flex flex-col z-151">
            <div className="flex justify-between items-center mb-12">
               <span className="font-bold text-steam-light tracking-widest">MENU</span>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-white text-3xl p-2">&times;</button>
            </div>

            <div className="flex flex-col gap-8 font-medium text-xl">
              {navLinks.map(link => (
                <Link 
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-steam-text hover:text-white transition-colors uppercase tracking-widest border-b border-white/5 pb-6"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto pb-12 flex flex-col gap-4">
               <Link href={`/${language}/login`} onClick={() => setIsMobileMenuOpen(false)} className="bg-steam-button text-white py-4 text-center rounded font-bold uppercase text-sm shadow-lg border border-white/10 active:scale-95 transition-all">
                  {t('auth.login')}
               </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
