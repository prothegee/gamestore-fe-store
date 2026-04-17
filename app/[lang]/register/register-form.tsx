'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RegisterButton } from './register-button';

type Props = {
  action: (formData: FormData) => Promise<void>;
  lang: string;
  success?: boolean;
};

export function RegisterForm({ action, lang, success }: Props) {
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const next: typeof errors = {};
    if (!username) next.username = 'Username is required';
    if (!email) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address';
    if (!password) next.password = 'Password is required';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters';

    if (Object.keys(next).length > 0) {
      e.preventDefault();
      setErrors(next);
    } else {
      setErrors({});
    }
  }

  const clearError = (field: keyof typeof errors) =>
    errors[field] && setErrors(prev => ({ ...prev, [field]: undefined }));

  return (
    <form action={action} onSubmit={handleSubmit} className="flex flex-col gap-6">
      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-200 p-3 rounded text-xs font-bold">
          Registration successful! You can now{' '}
          <Link href={`/${lang}/login`} className="underline">Sign In</Link>.
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-steam-light uppercase tracking-wider">Username</label>
        <input
          name="username"
          type="text"
          onChange={() => clearError('username')}
          className="bg-steam-darkest border border-gray-700 rounded px-4 py-2 focus:border-steam-light outline-none transition-colors text-white"
        />
        {errors.username && <span className="text-red-400 text-[11px]">{errors.username}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-steam-light uppercase tracking-wider">Email Address</label>
        <input
          name="email"
          type="email"
          onChange={() => clearError('email')}
          className="bg-steam-darkest border border-gray-700 rounded px-4 py-2 focus:border-steam-light outline-none transition-colors text-white"
        />
        {errors.email && <span className="text-red-400 text-[11px]">{errors.email}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-steam-light uppercase tracking-wider">Password</label>
        <input
          name="password"
          type="password"
          onChange={() => clearError('password')}
          className="bg-steam-darkest border border-gray-700 rounded px-4 py-2 focus:border-steam-light outline-none transition-colors text-white"
        />
        {errors.password && <span className="text-red-400 text-[11px]">{errors.password}</span>}
      </div>

      <RegisterButton label="Create Account" />

      <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col gap-4 text-center">
        <span className="text-gray-500 text-xs uppercase tracking-widest">Already have an account?</span>
        <Link href={`/${lang}/login`} className="text-steam-light hover:underline text-sm uppercase font-bold transition-all">
          Sign In
        </Link>
      </div>
    </form>
  );
}
