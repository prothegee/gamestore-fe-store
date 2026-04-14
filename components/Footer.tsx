'use client';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-steam-darkest text-gray-500 py-12 px-8 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 pb-8">
          <div className="flex flex-col gap-4">
             <div className="text-xl font-bold tracking-widest text-gray-300 flex items-center grayscale opacity-50">
              <span className="bg-gray-600 text-steam-darkest px-2 py-1 rounded mr-2">G</span>
              GAMESTORE
            </div>
            <p className="text-xs max-w-md">
              © {currentYear} GameStore Corporation. All rights reserved. All trademarks are property of their respective owners in the US and other countries.
              VAT included in all prices where applicable.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-xs">
             <div className="flex flex-col gap-2">
                <span className="text-gray-400 font-bold mb-1">RESOURCES</span>
                <a href="#" className="hover:text-gray-300">Privacy Policy</a>
                <a href="#" className="hover:text-gray-300">Legal</a>
                <a href="#" className="hover:text-gray-300">Subscriber Agreement</a>
                <a href="#" className="hover:text-gray-300">Refunds</a>
             </div>
             <div className="flex flex-col gap-2">
                <span className="text-gray-400 font-bold mb-1">COMMUNITY</span>
                <a href="#" className="hover:text-gray-300">Facebook</a>
                <a href="#" className="hover:text-gray-300">Twitter</a>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
