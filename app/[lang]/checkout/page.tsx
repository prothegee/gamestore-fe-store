'use client';

import { useState } from 'react';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { useCart } from '@/lib/hooks/useCart';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/i18n-context';

export default function CheckoutPage() {
  const { total, clearCart } = useCart();
  const router = useRouter();
  const { language } = useI18n();
  const [isProcessing, setIsProcessing] = useState(false);

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    // TODO:
    // - Fetch from `url/api/purchase/checkout`
    setTimeout(() => {
      clearCart();
      router.push(`/${language}/payment-status?success=true`);
    }, 2000);
  }

  return (
    <div className="py-20 min-h-[70vh]">
      <Container>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 uppercase tracking-widest">Payment Method</h1>
          
          <form onSubmit={handlePayment} className="flex flex-col gap-8">
            <div className="bg-steam-darkest/60 p-10 rounded shadow-2xl border border-white/5 flex flex-col gap-6">
               <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Please select a payment method</label>
                  <select className="bg-steam-darkest border border-gray-700 rounded px-4 py-3 text-white outline-none focus:border-steam-light appearance-none cursor-pointer">
                     <option>Visa ending in 4242</option>
                     <option>MasterCard ending in 1234</option>
                     <option>PayPal</option>
                     <option>Steam Wallet ($120.00)</option>
                  </select>
               </div>
               
               <div className="p-4 bg-black/20 rounded border border-white/5">
                  <p className="text-xs text-gray-400 leading-loose">
                    By clicking the button below, you agree to the terms of the GameStore Subscriber Agreement. 
                    This purchase is final and non-refundable unless required by law.
                  </p>
               </div>
            </div>
            
            <div className="flex flex-col gap-4">
               <div className="flex justify-between items-end mb-4">
                  <span className="text-gray-400 uppercase text-sm font-bold tracking-widest">Total Amount</span>
                  <span className="text-3xl font-bold text-white">${total.toFixed(2)}</span>
               </div>
               
               <Button 
                type="submit" 
                variant="primary" 
                className="py-4 text-xl"
                disabled={isProcessing}
               >
                 {isProcessing ? 'Processing...' : 'Complete Purchase'}
               </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
