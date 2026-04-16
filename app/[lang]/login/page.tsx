import { Container } from '@/components/Container';
import { getTranslations } from '@/lib/i18n/get-translations';
import { loginUser } from '@/lib/api/account';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LoginButton } from './login-button';

export default async function LoginPage({ params, searchParams }: { params: Promise<{ lang: string }>, searchParams: Promise<{ error?: string }> }) {
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
          
          <form action={handleLogin} className="flex flex-col gap-6">
            {error === 'invalid' && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded text-xs font-bold">
                Invalid credentials. Use demouser:demouser
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-steam-light uppercase tracking-wider">Username</label>
              <input 
                name="email"
                type="text" 
                placeholder="demouser"
                className="bg-steam-darkest border border-gray-700 rounded px-4 py-2 focus:border-steam-light outline-none transition-colors text-white"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-steam-light uppercase tracking-wider">Password</label>
              <input 
                name="password"
                type="password" 
                placeholder="demouser"
                className="bg-steam-darkest border border-gray-700 rounded px-4 py-2 focus:border-steam-light outline-none transition-colors text-white"
                required
              />
            </div>
            
            <LoginButton label="Sign In" />
            
            <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col gap-4 text-center">
               <span className="text-gray-500 text-xs uppercase tracking-widest">Don&apos;t have an account?</span>
               <Link href={`/${lang}/register`} className="text-steam-light hover:underline text-sm uppercase font-bold transition-all">
                  Create an account
               </Link>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
