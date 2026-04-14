import { redirect } from 'next/navigation';

export default function RootPage() {
  // Middleware handles the primary redirect, but this is a fallback
  redirect('/en/home');
}
