'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LoginButton } from './login-button';

type Props = {
  action: (formData: FormData) => Promise<void>;
  lang: string;
  serverError?: string;
};

export function LoginForm({ action, lang, serverError }: Props) {
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const next: typeof errors = {};
    if (!email) next.email = 'Username is required';
    if (!password) next.password = 'Password is required';

    if (Object.keys(next).length > 0) {
      e.preventDefault();
      setErrors(next);
    } else {
      setErrors({});
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="flex flex-col gap-6">
      {serverError === 'invalid' && (
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
          onChange={() => errors.email && setErrors(prev => ({ ...prev, email: undefined }))}
          className="bg-steam-darkest border border-gray-700 rounded px-4 py-2 focus:border-steam-light outline-none transition-colors text-white"
        />
        {errors.email && (
          <span className="text-red-400 text-[11px]">{errors.email}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-steam-light uppercase tracking-wider">Password</label>
        <input
          name="password"
          type="password"
          placeholder="demouser"
          onChange={() => errors.password && setErrors(prev => ({ ...prev, password: undefined }))}
          className="bg-steam-darkest border border-gray-700 rounded px-4 py-2 focus:border-steam-light outline-none transition-colors text-white"
        />
        {errors.password && (
          <span className="text-red-400 text-[11px]">{errors.password}</span>
        )}
      </div>

      <LoginButton label="Sign In" />

      <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col gap-4 text-center">
        <span className="text-gray-500 text-xs uppercase tracking-widest">Don&apos;t have an account?</span>
        <Link href={`/${lang}/register`} className="text-steam-light hover:underline text-sm uppercase font-bold transition-all">
          Create an account
        </Link>
      </div>
    </form>
  );
}
