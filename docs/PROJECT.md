# GameStore Frontend Project

## Overview
This project is a React-based Game Store frontend built with Next.js, mimicking the Steam Store aesthetic and functionality.

## Core Mandates
- Port: 9007
- Mimics Steam Store UI
- Fluid design for desktop & mobile
- Support for multiple languages (en, id)
- SSR utilized for core pages
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
- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Vitest for testing
- I18n with context-based dictionary

## Architecture
- `app/`: Next.js App Router pages (Localized under `[lang]`)
- `components/`: Reusable React components
- `lib/api/`: Mock API services and localized dummy data
- `lib/i18n/`: Internationalization logic and dictionaries
- `lib/hooks/`: Custom hooks for state management (Cart, etc.)
- `tests/`: Vitest test suite
- `docs/`: Technical documentation
