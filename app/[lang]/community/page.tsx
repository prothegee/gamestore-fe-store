'use client';

import { Container } from '@/components/Container';
import { useI18n } from '@/lib/i18n/i18n-context';

export default function CommunityPage() {
  const { t } = useI18n();

  return (
    <div className="py-20">
      <Container>
        <h1 className="text-4xl font-bold text-white mb-8 uppercase tracking-widest">{t('community.title')}</h1>
        <div className="bg-steam-darkest/40 p-12 rounded border border-white/5 text-center">
           <p className="text-gray-400 text-xl">{t('community.coming_soon')}</p>
           <p className="text-gray-500 mt-4">{t('community.desc')}</p>
        </div>
      </Container>
    </div>
  );
}
