import { Container } from '@/components/Container';
import { getTranslations } from '@/lib/i18n/get-translations';
import { registerUser } from '@/lib/api/account';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { RegisterButton } from './register-button';

export default async function RegisterPage({ params, searchParams }: { params: Promise<{ lang: string }>, searchParams: Promise<{ success?: string }> }) {
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
          
          <form action={handleRegister} className="flex flex-col gap-6">
            {success === 'true' && (
              <div className="bg-green-500/20 border border-green-500 text-green-200 p-3 rounded text-xs font-bold">
                Registration successful! You can now <Link href={`/${lang}/login`} className="underline">Sign In</Link>.
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-steam-light uppercase tracking-wider">Username</label>
              <input 
                name="username"
                type="text" 
                className="bg-steam-darkest border border-gray-700 rounded px-4 py-2 focus:border-steam-light outline-none transition-colors text-white"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-steam-light uppercase tracking-wider">Email Address</label>
              <input 
                name="email"
                type="email" 
                className="bg-steam-darkest border border-gray-700 rounded px-4 py-2 focus:border-steam-light outline-none transition-colors text-white"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-steam-light uppercase tracking-wider">Password</label>
              <input 
                name="password"
                type="password" 
                className="bg-steam-darkest border border-gray-700 rounded px-4 py-2 focus:border-steam-light outline-none transition-colors text-white"
                required
              />
            </div>
            
            <RegisterButton label="Create Account" />
            
            <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col gap-4 text-center">
               <span className="text-gray-500 text-xs uppercase tracking-widest">Already have an account?</span>
               <Link href={`/${lang}/login`} className="text-steam-light hover:underline text-sm uppercase font-bold transition-all">
                  Sign In
               </Link>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
