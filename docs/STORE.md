# Store & Checkout Documentation

## Overview
The store allows browsing games, adding them to a server-side cart, and completing a purchase flow. All game content is localized using dynamic data functions. The store page uses Suspense streaming for instant shell rendering.

## Store Page (`/{lang}/store`)

### Rendering
- The store page is a **Client Component** (`'use client'`) that manages its own state for games, search, and pagination.
- It utilizes **Infinite Scroll (Lazy Loading)** via `IntersectionObserver` to fetch games in batches of 12 as the user scrolls.

### Search & Filtering
- **Debounced Search:** Includes a search input with a 500ms debounce to filter games by title or tags without instant network spam.
- **Client-side State:** Search term and results are managed via `useState`.
- `getGamesPaged(lang, page, limit, search)`: Asynchronous mock API returning a Promise with simulated **800ms latency**.
- `GameCard`: Reusable component using `next/image` for optimized loading with uniform `aspect-ratio: 16/9`.

## Shopping Cart

### Architecture
The cart is a three-layer hybrid system:

```
Cart cookie  ←  Server actions  ←→  CartProvider (optimistic client state)
```

- **Storage:** A `cart` cookie stores `{ gameId, quantity }[]` (compact entries).
- **Hydration:** On each layout render, `getCart(lang)` (server-side) reads the `cart` cookie and resolves full `CartItem[]` objects. These are passed as `initialCart` to `CartProvider`.
- **Server actions** (`lib/api/cart.ts`):
  - `getCart(lang)` — hydrates cart from cookie.
  - `addToCartAction(gameId)` — increments or inserts item.
  - `removeFromCartAction(gameId)` — removes item from the cookie.
  - `updateQuantityAction(gameId, delta)` — adjusts quantity; auto-removes at 0.
  - `clearCartAction()` — deletes the `cart` cookie.

### Optimistic Updates
`CartProvider` (`lib/hooks/useCart.tsx`) applies mutations using functional `setState` immediately — UI reflects the change before the server action responds. The server action runs in the background to persist the change to the cookie.

This pattern means:
- **Client-side navigations:** Optimistic state is preserved (e.g., clicking the cart nav link).
- **Hard navigations:** Layout re-reads the cookie; if the server action has completed, the correct quantity is returned.

### Quantity Controls
- Increment / Decrement: `updateQuantity(id, +1 | -1)`.
- Decrement to 0 automatically removes the item.
- Direct removal: `removeFromCart(id)`.
- Clear all: `clearCart()`.

## Add to Cart Button (`/{lang}/game/[id]`)
- `AddToCartButton` is a `'use client'` island on the localized game detail page (Server Component).
- If the user is not authenticated: redirects to `/{lang}/login`.
- If authenticated: calls `addToCart(game)` (optimistic) and shows **"Added!"** feedback for 1.5 seconds.

## Checkout (`/{lang}/checkout`)
- Client component that reads `total` from `CartProvider`.
- Simulates payment with a 2-second timeout.
- On success: calls `clearCart()` (clears local state + `cart` cookie) and redirects to `/{lang}/payment-status?success=true`.

## Performance
- **Next.js Image Optimization:** All images use `<Image />` with `remotePatterns` for secure delivery.
- **Lazy Loading Efficiency:** Conserves browser resources by only rendering and fetching games as needed.
- **Aspect Ratios:** 1:1 (Trending/New), 16:9 (Store Grid) strictly maintained for layout uniformity.
