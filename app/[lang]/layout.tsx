import { I18nProvider } from "@/lib/i18n/i18n-context";
import { CartProvider } from "@/lib/hooks/useCart";
import { AuthProvider } from "@/lib/api/auth-context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EnvBanner } from "@/components/EnvBanner";
import { Language } from "@/lib/i18n/translations";

import { getSession } from "@/lib/api/account";
import { getCart } from "@/lib/api/cart";

export default async function LanguageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const [session, initialCart] = await Promise.all([
    getSession(),
    getCart(lang),
  ]);

  return (
    <I18nProvider initialLanguage={lang as Language}>
      <AuthProvider initialUser={session}>
        <CartProvider initialCart={initialCart}>
          <EnvBanner />
          <Navbar lang={lang} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
