# End-to-End Testing with Playwright

This document covers the E2E testing strategy for cross-browser validation of the GameStore Frontend.

## Overview
We use **Playwright** to simulate real user interactions across multiple browser engines to ensure UI stability and functional correctness.

## Browser Coverage
The project is configured to run tests against:
1. **Chromium** (Chrome, Edge)
2. **Firefox**
3. **WebKit** (Safari) — requires system libraries; see Prerequisites below.

## Running Tests

Run all tests in all browsers:
```bash
bun run test:e2e
```

Run tests only in a specific browser:
```bash
bun run test:e2e --project=chromium
bun run test:e2e --project=firefox
bun run test:e2e --project=webkit
```

Run with UI mode (interactive debugger):
```bash
bun run test:e2e --ui
```

## Setup & Prerequisites

If running on a new environment, ensure Playwright browser binaries are installed:
```bash
npx playwright install
```

WebKit also requires system-level libraries. On Debian/Ubuntu:
```bash
sudo npx playwright install-deps
# or manually:
sudo apt-get install libicu74 libxml2 libflite1
```

## Configuration
`playwright.config.ts` sets:
- **Base URL:** `http://localhost:9007`
- **Web Server:** `bun run dev` (started automatically if not already running)
- **Retries:** 2 in CI, 0 locally
- **Reporters:** HTML

## Current Test Scenarios

### `tests/e2e/store.spec.ts` — Full Store Flow

**Test 1: Login → Search → Add to Cart → Quantity Verification**

1. Visit `/en/home` — verifies page title.
2. Click "login" — navigates to `/en/login`.
3. Fill `demouser` / `demouser` and submit — verifies redirect to `/en/home` and username in navbar.
4. Navigate to `/en/store` via the navbar "STORE" link (`:text-is("STORE")` to avoid matching the logo).
5. Type "Cyberpunk" in the search input — waits 1s for debounce, verifies "Cyberpunk 2077" appears.
6. Click "Cyberpunk 2077" — verifies `/en/game/1`.
7. Click "Add to Cart" — verifies cart badge shows `1`.
8. Click the cart nav link — verifies `/en/cart`, game visible, quantity `1`.
9. Navigate back to `/en/game/1`, click "Add to Cart" again.
10. Click the navbar cart link (client-side navigation — preserves `CartProvider` optimistic state) — verifies quantity `2`.

> **Note:** Step 10 intentionally uses the navbar cart link (not `page.goto`) because `page.goto` triggers a hard navigation. A hard nav re-reads the `cart` cookie server-side; if the `addToCartAction` hasn't completed writing the cookie yet, the quantity would still read `1`. Client-side navigation preserves the `CartProvider`'s optimistic state, which already reflects `2`.

**Test 2: Language Switching**

1. Visit `/en/home`.
2. Click the language button (`button:has-text("en")`).
3. Click "Indonesian" (`button:has-text("Indonesian")`) from the dropdown.
4. Verify URL changes to `/id/home`, navbar shows "TOKO" and language indicator updates.

> **Note:** The language dropdown renders `<button>` elements (not `<a>` / `<Link>`), so selectors must use `button:has-text(...)`.

## Test Design Guidelines

- Use `:text-is()` for exact text matches to avoid accidental matches (e.g., "STORE" vs "GAMESTORE").
- Use `a[href*="/cart"]` to target the cart link; avoid matching the cart count badge separately.
- Use `main span:text-is("N")` for quantity checks to avoid collisions with the navbar cart badge.
- Prefer navbar link clicks over `page.goto` when the test relies on `CartProvider` optimistic state being preserved across navigation.
- Add `waitForTimeout(1000)` only after the search debounce (500ms) — do not add arbitrary waits elsewhere.
