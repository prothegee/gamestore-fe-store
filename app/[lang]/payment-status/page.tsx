'use client';

import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n/i18n-context';

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const { language } = useI18n();

  return (
    <div className="py-20 min-h-[70vh] flex items-center">
      <Container>
        <div className="max-w-md mx-auto text-center bg-steam-darkest/60 p-12 rounded shadow-2xl border border-white/5">
          {success ? (
            <>
              <div className="w-20 h-20 bg-steam-button rounded-full flex items-center justify-center mx-auto mb-8 text-white text-4xl shadow-[0_0_20px_rgba(92,126,16,0.5)]">
                ✓
              </div>
              <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-widest">Thank You!</h1>
              <p className="text-gray-400 mb-10">Your purchase has been completed successfully. A receipt has been sent to your email.</p>
              <Link href={`/${language}/profile`}>
                <Button variant="primary" className="w-full">View in Library</Button>
              </Link>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8 text-white text-4xl shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                !
              </div>
              <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-widest">Payment Failed</h1>
              <p className="text-gray-400 mb-10">There was an error processing your payment. Please try again or use a different payment method.</p>
              <Link href={`/${language}/checkout`}>
                <Button variant="primary" className="w-full">Try Again</Button>
              </Link>
            </>
          )}
          
          <Link href={`/${language}/home`} className="inline-block mt-8 text-xs text-gray-500 hover:text-steam-light uppercase tracking-widest transition-colors">
            Return to Store
          </Link>
        </div>
      </Container>
    </div>
  );
}
