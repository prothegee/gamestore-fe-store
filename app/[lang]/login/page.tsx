import { Container } from '@/components/Container';
import { getTranslations } from '@/lib/i18n/get-translations';
import { loginUser } from '@/lib/api/account';
import { redirect } from 'next/navigation';
import { LoginForm } from './login-form';

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { lang } = await params;
  const { error } = await searchParams;
  const { t } = getTranslations(lang);

  async function handleLogin(formData: FormData) {
    'use server';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const response = await loginUser(email, password);
    if (response.ok) {
      redirect(`/${lang}/home`);
    } else {
      redirect(`/${lang}/login?error=invalid`);
    }
  }

  return (
    <div className="py-20 bg-gradient-to-b from-steam-darker to-steam-darkest min-h-[80vh] flex items-center">
      <Container>
        <div className="max-w-md mx-auto bg-steam-darkest/60 p-10 rounded shadow-2xl border border-white/5">
          <h1 className="text-3xl font-bold text-white mb-8 uppercase tracking-widest">{t('auth.login')}</h1>
          <LoginForm action={handleLogin} lang={lang} serverError={error} />
        </div>
      </Container>
    </div>
  );
}
