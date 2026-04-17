# Unit Testing with Vitest

This document covers the unit testing strategy and setup for the GameStore Frontend.

## Overview
We use **Vitest** along with **React Testing Library** and **jsdom** to test core logic, hooks, and localized translations.

## Running Tests

Run all unit tests once:
```bash
bun run test
```

Run in watch mode:
```bash
bun run vitest watch
```

## Current Test Suites

### 1. Cart Logic (`tests/cart.test.tsx`)
Tests the `useCart` hook via `renderHook` with full provider context (`AuthProvider`, `CartProvider`, `I18nProvider`).

- **Unauthenticated access:** Calling `addToCart` without logging in leaves `cartItems` empty (redirects to login instead).
- **Add item:** After login, `addToCart(game)` adds the item with `quantity: 1`.
- **Batched adds (same item):** Two `addToCart(game)` calls in the same `act()` correctly produce `quantity: 2`. This works because `CartProvider` uses functional `setState(prev => ...)` internally, so each call in the batch builds on the latest state rather than a stale closure.
- **Remove item:** `removeFromCart(id)` empties the cart.
- **Single add invariant:** One `addToCart` call produces exactly one item with `quantity: 1`.

> **Cart storage:** The cart is no longer backed by `localStorage`. It uses server actions (`addToCartAction`, etc.) that write to a cookie. In the test environment, `next/headers` is mocked (see `tests/setup.ts`) so server actions resolve normally in jsdom without hitting real cookies.

### 2. I18n Translations (`tests/i18n.test.ts`)
- Verifies key parity between English and Indonesian translation dictionaries.
- Spot-checks specific translation values (e.g., `nav.store` → `"STORE"` / `"TOKO"`).

## Configuration

- **`vitest.config.ts`:** Sets `environment: 'jsdom'`, `globals: true`, and excludes `tests/e2e/**`.
- **`tests/setup.ts`:** Provides the following mocks:
  - `localStorage` — full in-memory implementation (still present; used by non-cart code).
  - `next/navigation` — mocks `useRouter`, `usePathname`, `useParams`.
  - `next/headers` — mocks `cookies()` with an in-memory `Map`-backed store so server actions (`loginUser`, `addToCartAction`, etc.) work in jsdom.

## Guidelines

- **File Extension:** Use `.tsx` for tests involving React components or JSX.
- **Context Wrappers:** Always use the `wrapper` pattern in `renderHook` to provide `I18nProvider`, `AuthProvider`, and `CartProvider` context.
- **Async auth:** `auth.login()` calls `loginUser` (a server action that writes the `user_session` cookie). In tests, this resolves via the `next/headers` mock — wrap in `await act(async () => { ... })`.
- **Batched state:** When testing multiple synchronous cart mutations, wrap them in a single `act(() => { ... })` to let React process all updates before asserting.
- **No `localStorage.clear()` needed for cart:** Cart state lives in `CartProvider`'s `useState`, not `localStorage`. The `beforeEach` in `cart.test.tsx` calls `localStorage.clear()` as a safety measure but it does not affect cart behavior.
