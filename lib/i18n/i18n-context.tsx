'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from './translations';
import { useRouter, usePathname } from 'next/navigation';

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);
const PREFERRED_LANG_COOKIE = '_preferred-lang';

export function I18nProvider({
  children,
  initialLanguage = 'en'
}: {
  children: React.ReactNode,
  initialLanguage?: Language
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const router = useRouter();
  const pathname = usePathname();

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    if (initialLanguage && initialLanguage !== language) {
      setLanguage(initialLanguage);
    }
  }, [initialLanguage]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  function handleSetLanguage(lang: Language) {
    setLanguage(lang);
    document.cookie = `${PREFERRED_LANG_COOKIE}=${lang}; path=/; max-age=31536000`;

    // Update URL to reflect language change
    const segments = pathname.split('/');
    if (segments.length > 1) {
      segments[1] = lang;
      router.push(segments.join('/'));
    }
  }

  function t(path: string): string {
    const keys = path.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = translations[language];

    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path;
      }
    }

    return typeof result === 'string' ? result : path;
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
