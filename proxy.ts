import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const SUPPORTED_LANGS = ['en', 'id'];
const PREFERRED_LANG_COOKIE = '_preferred-lang';

/**
 * Next.js 16 Proxy function (formerly Middleware)
 * Handles language-based routing and redirects.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public files, _next, and api routes
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')
  ) {
    return;
  }

  const segments = pathname.split('/');
  const langInPath = segments[1];

  // 1. Handle root redirect
  if (pathname === '/' || pathname === '') {
    const lang = request.cookies.get(PREFERRED_LANG_COOKIE)?.value || 'en';
    const finalLang = SUPPORTED_LANGS.includes(lang) ? lang : 'en';
    return NextResponse.redirect(new URL(`/${finalLang}/home`, request.url));
  }

  // 2. Handle valid language prefix
  if (SUPPORTED_LANGS.includes(langInPath)) {
    // If just /{lang} or /{lang}/, redirect to /{lang}/home
    if (segments.length === 2 || (segments.length === 3 && segments[2] === '')) {
      return NextResponse.redirect(new URL(`/${langInPath}/home`, request.url));
    }

    // Valid language and specific path. 
    // Proxy lets it pass to the application.
    // If the path doesn't exist (e.g. /en/awdawdbh/home), Next.js will show the 404 page.
    const response = NextResponse.next();
    response.cookies.set(PREFERRED_LANG_COOKIE, langInPath, { path: '/', maxAge: 31536000 });
    return response;
  }

  // 3. Handle invalid or missing language prefix
  const lang = request.cookies.get(PREFERRED_LANG_COOKIE)?.value || 'en';
  const finalLang = SUPPORTED_LANGS.includes(lang) ? lang : 'en';

  let newPath;
  if (segments.length > 2) {
    // The first segment was intended as a lang but is invalid (e.g. /awdbawdbh/home)
    // We replace the invalid lang with the preferred one and keep the rest.
    const rest = segments.slice(2).join('/');
    newPath = `/${finalLang}/${rest || 'home'}`;
  } else {
    // Missing lang prefix (e.g. /about)
    // We prepend the preferred lang.
    const rest = segments[1] || 'home';
    newPath = `/${finalLang}/${rest}`;
  }

  return NextResponse.redirect(new URL(newPath, request.url));
}

export const config = {
  matcher: [
    // Match all paths except static files and api
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
