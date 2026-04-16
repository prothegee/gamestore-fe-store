import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { getTranslations } from '@/lib/i18n/get-translations';

export default async function SupportPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { t } = getTranslations(lang);

  return (
    <div className="py-20">
      <Container>
        <h1 className="text-4xl font-bold text-white mb-8 uppercase tracking-widest">{t('support.title')}</h1>
        <div className="flex flex-col gap-6">
           <div className="bg-steam-darkest/60 p-8 rounded border border-white/5 hover:bg-steam-darkest/80 cursor-pointer transition-all">
              <h3 className="text-xl font-bold text-white mb-2">{t('support.signin_help')}</h3>
              <p className="text-gray-400">{t('support.signin_desc')}</p>
           </div>
           
           <div className="bg-steam-darkest/60 p-8 rounded border border-white/5 hover:bg-steam-darkest/80 cursor-pointer transition-all">
              <h3 className="text-xl font-bold text-white mb-2">{t('support.purchase_help')}</h3>
              <p className="text-gray-400">{t('support.purchase_desc')}</p>
           </div>
           
           <div className="bg-steam-darkest/60 p-8 rounded border border-white/5 hover:bg-steam-darkest/80 cursor-pointer transition-all">
              <h3 className="text-xl font-bold text-white mb-2">{t('support.tech_help')}</h3>
              <p className="text-gray-400">{t('support.tech_desc')}</p>
           </div>
        </div>
        
        <div className="mt-12 text-center">
           <Button variant="outline">{t('support.search_kb')}</Button>
        </div>
      </Container>
    </div>
  );
}
