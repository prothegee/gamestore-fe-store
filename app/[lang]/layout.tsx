import { I18nProvider } from "@/lib/i18n/i18n-context";
import { CartProvider } from "@/lib/hooks/useCart";
import { AuthProvider } from "@/lib/api/auth-context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EnvBanner } from "@/components/EnvBanner";
import { Language } from "@/lib/i18n/translations";

export default async function LanguageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <I18nProvider initialLanguage={lang as Language}>
      <AuthProvider>
        <CartProvider>
          <EnvBanner />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
