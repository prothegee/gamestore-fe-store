import { translations, Language } from './translations';

export function getTranslations(lang: string) {
  const language = (lang === 'id' ? 'id' : 'en') as Language;
  const t = (path: string): string => {
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
  };

  return { t, language };
}
