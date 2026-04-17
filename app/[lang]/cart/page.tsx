'use client';

import Image from 'next/image';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { useCart } from '@/lib/hooks/useCart';
import { useI18n } from '@/lib/i18n/i18n-context';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { language } = useI18n();

  return (
    <div className="py-20 min-h-[70vh]">
      <Container>
        <h1 className="text-3xl font-bold text-white mb-8 uppercase tracking-widest">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-steam-darkest/40 p-12 text-center rounded">
            <p className="text-gray-400 mb-8 text-xl">Your cart is empty.</p>
            <Link href={`/${language}/home`}>
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="grow flex flex-col gap-4">
               {cartItems.map((item) => {
                 const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
                 return (
                   <div key={item.id} className="bg-steam-darkest/40 p-4 rounded flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center border border-white/5 group hover:bg-steam-darkest/60 transition-all">
                      <div className="flex gap-4 sm:gap-6 items-center grow">
                        <Link href={`/${language}/game/${item.id}`} className="relative w-24 h-16 sm:w-32 sm:h-20 shrink-0 overflow-hidden rounded">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 96px, 128px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </Link>
                        <div className="grow min-w-0">
                           <Link href={`/${language}/game/${item.id}`} className="text-white font-medium hover:text-steam-light transition-colors block mb-1 truncate">
                             {item.title} 
                           </Link>
                           <div className="text-steam-light font-bold text-sm flex flex-wrap items-baseline gap-x-2">
                             <span>${price.toFixed(2)}</span>
                             {item.quantity > 1 && <span className="text-gray-500 text-[10px] font-normal">(${ (price * item.quantity).toFixed(2) } total)</span>}
                           </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-black/40 rounded overflow-hidden border border-white/5 shrink-0">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-3 py-1 text-gray-400 hover:text-white hover:bg-white/5 transition-all font-bold"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-steam-light font-bold text-xs min-w-[2.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-3 py-1 text-gray-400 hover:text-white hover:bg-white/5 transition-all font-bold"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-500 hover:text-red-400 text-[10px] underline uppercase transition-colors sm:px-2 shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                   </div>
                 );
               })}

               <div className="flex justify-between items-center mt-4">
                  <button onClick={clearCart} className="text-[10px] text-gray-500 hover:text-gray-300 uppercase underline">Remove all items</button>
               </div>
            </div>

            <div className="lg:w-96 flex flex-col gap-6">
               <div className="bg-steam-darkest/60 p-8 rounded shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400 uppercase text-sm font-bold tracking-widest">Estimated Total</span>
                    <span className="text-2xl font-bold text-white">${total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-8">Is this a gift? You will be able to choose a recipient during checkout.</p>

                  <Link href={`/${language}/checkout`}>
                    <Button variant="primary" className="w-full py-4 text-lg">Purchase for myself</Button>
                  </Link>
                  <Button variant="secondary" className="w-full py-3 mt-4">Purchase as a gift</Button>
               </div>

               <div className="bg-steam-darkest/20 p-4 rounded text-[10px] text-gray-500 uppercase tracking-widest text-center">
                  Secure Checkout
               </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
