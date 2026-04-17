import { getSession } from "@/lib/api/account";
import { getTranslations } from "@/lib/i18n/get-translations";
import { NavbarClient } from "./NavbarClient";
import { Language } from "@/lib/i18n/translations";

export async function Navbar({ lang }: { lang: string }) {
  const session = await getSession();
  const { t } = getTranslations(lang);

  return (
    <NavbarClient
      initialUser={session}
      translations={{
        store: t('nav.store'),
        community: t('nav.community'),
        about: t('nav.about'),
        support: t('nav.support'),
        login: t('auth.login'),
        logout: t('auth.logout'),
        cart: t('common.cart')
      }}
      lang={lang as Language}
    />
  );
}
