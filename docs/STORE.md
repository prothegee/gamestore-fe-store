# Store & Checkout Documentation

## Overview
The store allows browsing games, adding them to a cart, and completing a purchase flow. All game content is localized using dynamic data functions.

## Functionality
- `/{lang}/store`: Dedicated page showing the full collection of **100 unique games**.
- `Search & Filtering`: Debounced (500ms) search input filtering by **Title** or **TagList** (Case-insensitive, supports en/id).
- `Infinite Scroll (Lazy Loading)`: Uses `IntersectionObserver` to fetch more games (12 per page) as the user scrolls.
- `getGamesPaged(lang, page, limit, search)`: Asynchronous mock API returning a Promise with simulated **800ms latency**.
- `GameCard`: Reusable component using `next/image` for optimized loading with `flex flex-col h-full` for uniform layout.

## Performance
- **Next.js Image Optimization:** All images use `<Image />` with `remotePatterns` for secure, fast delivery.
- **Aspect Ratios:** 1:1 (Trending/New), 16:9 (Feature/Store Grid), 21:9 (Highlights) are strictly maintained for uniformity.
- **Lazy Loading Efficiency:** Only 12 items are rendered initially; browser resources are conserved until the user scrolls.
- **Search Efficiency:** Filtering is performed on the mock data layer before slicing, simulating server-side pagination.

## Shopping Cart
- **Persistent State:** Uses `LocalStorage` to save cart items, with unique keys per user (`cart_{userId}`).
- **Syncing Logic:** Implements a custom `useCart` hook that synchronizes state across multiple tabs using the `storage` event and a local `cart-update` event.
- **Robustness:** Side effects (persistence and event dispatching) are handled in a dedicated `useEffect` to ensure state purity and compatibility with React Strict Mode.
- **Normalization:** Automatically ensures all items have a `quantity >= 1` and merges duplicates if detected during external syncs.
- **Quantity Controls:** Supports incrementing, decrementing (auto-removes at 0), and direct removal.
