import { Container } from '@/components/Container';
import { getTranslations } from '@/lib/i18n/get-translations';
import { registerUser } from '@/lib/api/account';
import { redirect } from 'next/navigation';
import { RegisterForm } from './register-form';

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { lang } = await params;
  const { success } = await searchParams;
  const { t } = getTranslations(lang);

  async function handleRegister(formData: FormData) {
    'use server';
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const response = await registerUser({ username, email, password });
    if (response.ok) {
      redirect(`/${lang}/register?success=true`);
    }
  }

  return (
    <div className="py-20 bg-gradient-to-b from-steam-darker to-steam-darkest min-h-[80vh] flex items-center">
      <Container>
        <div className="max-w-md mx-auto bg-steam-darkest/60 p-10 rounded shadow-2xl border border-white/5">
          <h1 className="text-3xl font-bold text-white mb-8 uppercase tracking-widest">{t('auth.register')}</h1>
          <RegisterForm action={handleRegister} lang={lang} success={success === 'true'} />
        </div>
      </Container>
    </div>
  );
}
