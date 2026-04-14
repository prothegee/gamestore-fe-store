'use client';

import { Container } from '@/components/Container';
import { useI18n } from '@/lib/i18n/i18n-context';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="py-20">
      <Container>
        <h1 className="text-4xl font-bold text-white mb-8 uppercase tracking-widest">{t('about.title')}</h1>
        <div className="bg-steam-darkest/40 p-12 rounded border border-white/5 prose prose-invert max-w-none">
           <p className="text-gray-300 text-lg">{t('about.description')}</p>
           <p className="text-gray-400">{t('about.sub_description')}</p>
           <h3 className="text-steam-light uppercase mt-8 font-bold tracking-widest">{t('about.mission_title')}</h3>
           <p className="text-gray-400">{t('about.mission_text')}</p>
        </div>
      </Container>
    </div>
  );
}
