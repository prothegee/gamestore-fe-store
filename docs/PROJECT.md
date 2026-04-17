# GameStore Frontend Project

## Overview
This project is a React-based Game Store frontend built with Next.js, mimicking the Steam Store aesthetic and functionality. It uses a **server-first hybrid architecture**: pages are async server components by default, with `'use client'` used only for interactive islands (search input, cart mutations, form validation, etc.).

## Core Mandates
- Port: 9007
- Mimics Steam Store UI
- Fluid design for desktop & mobile
- Support for multiple languages (en, id)
- Server-first rendering for all pages (SSR + Suspense streaming)
- Secure cookie-based session management
- Server-side cart with optimistic client updates
- Optimized image handling with `next/image`

## Environment Configuration
The application uses the following environment variables for service discovery:
- `NEXT_PUBLIC_API_ACCOUNT_URL`: Account management service.
- `NEXT_PUBLIC_API_MEDIA_URL`: Media and asset delivery.
- `NEXT_PUBLIC_API_PRODUCT_URL`: Product catalog service.
- `NEXT_PUBLIC_API_PURCHASE_URL`: Checkout and purchase service.
- `NEXT_PUBLIC_API_SESSION_URL`: User session management.
- `NEXT_PUBLIC_APP_ENV`: Current environment (`debug`, `staging`, `production`).

## Technical Stack
- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS 4
- Vitest for unit testing
- Playwright for E2E testing
- I18n with context-based dictionary + server-side utility

## Architecture
- `app/[lang]/layout.tsx`: Server layout — reads session and cart from cookies in parallel, passes both as props to their respective providers.
- `app/[lang]/store/`: Client-side Store page using **infinite scroll** and debounced search state.
- `app/[lang]/home/`, `game/[id]/`: Server-side pages using `getTranslations` and server-fetched game data.
- `app/[lang]/login/`, `register/`: Server pages with server actions; `LoginForm`/`RegisterForm` are client components that validate before submitting.
- `app/[lang]/profile/`: Server component with server-side `redirect()` if unauthenticated.
- `components/`: Reusable React components (mostly server-renderable; client islands are co-located).
- `lib/api/account.ts`: Auth server actions (login, logout, getSession).
- `lib/api/cart.ts`: Cart server actions (getCart, addToCartAction, removeFromCartAction, updateQuantityAction, clearCartAction).
- `lib/api/auth-context.tsx`: Client-side `AuthProvider`, initialized from server session.
- `lib/hooks/useCart.tsx`: Client-side `CartProvider` — initialized from server cart, applies mutations optimistically, syncs via server actions.
- `lib/i18n/`: Localization — `translations.ts`, `i18n-context.tsx` (client), `get-translations.ts` (server).
- `tests/`: Vitest unit tests and Playwright E2E tests.
- `docs/`: Technical documentation.
