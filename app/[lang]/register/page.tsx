'use client';

import { useState } from 'react';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { useI18n } from '@/lib/i18n/i18n-context';
import Link from 'next/link';
import { registerUser } from '@/lib/api/account';

export default function RegisterPage() {
  const { t, language } = useI18n();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const response = await registerUser({ username, email, password });
    if (response.ok) {
       alert(response.message);
    }
  }

  return (
    <div className="py-20 bg-gradient-to-b from-steam-darker to-steam-darkest min-h-[80vh] flex items-center">
      <Container>
        <div className="max-w-md mx-auto bg-steam-darkest/60 p-10 rounded shadow-2xl border border-white/5">
          <h1 className="text-3xl font-bold text-white mb-8 uppercase tracking-widest">{t('auth.register')}</h1>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-steam-light uppercase tracking-wider">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-steam-darkest border border-gray-700 rounded px-4 py-2 focus:border-steam-light outline-none transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-steam-light uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-steam-darkest border border-gray-700 rounded px-4 py-2 focus:border-steam-light outline-none transition-colors"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-steam-light uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-steam-darkest border border-gray-700 rounded px-4 py-2 focus:border-steam-light outline-none transition-colors"
                required
              />
            </div>
            
            <Button type="submit" variant="primary" className="mt-4 py-3">
              Create Account
            </Button>
            
            <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col gap-4 text-center">
               <span className="text-gray-500 text-xs uppercase tracking-widest">Already have an account?</span>
               <Link href={`/${language}/login`} className="text-steam-light hover:underline text-sm uppercase font-bold transition-all">
                  Sign In
               </Link>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
