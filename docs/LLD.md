# Low-Level Design (LLD) - GameStore Frontend

## Path Definitions & Components
All paths are prefixed with `{lang}` (supported: `en`, `id`).

| Path | Description | Rendering |
| :--- | :--- | :--- |
| `/{lang}/home` | Main storefront & featured games | Server Component (async) |
| `/{lang}/store` | Full game catalog with infinite scroll | Client Component (Lazy Loading) |
| `/{lang}/game/[id]` | Localized game details & add-to-cart | Server Component + client island |
| `/{lang}/cart` | Shopping cart overview | Client Component (reads CartProvider) |
| `/{lang}/checkout` | Payment processing simulation | Client Component |
| `/{lang}/payment-status` | Post-purchase feedback | Server Component |
| `/{lang}/login` | User authentication | Server Component + LoginForm (client) |
| `/{lang}/register` | Account creation | Server Component + RegisterForm (client) |
| `/{lang}/profile` | User dashboard | Server Component (server-side auth guard) |
| `/{lang}/community` | Community features placeholder | Client Component |
| `/{lang}/about` | Corporate information | Client Component |
| `/{lang}/support` | Help center | Client Component |

## Client Islands (Co-located `'use client'` components)

| Component | Location | Purpose |
| :--- | :--- | :--- |
| `StorePage` | `store/page.tsx` | Main store logic with infinite scroll and debounced search |
| `AddToCartButton` | `game/[id]/add-to-cart-button.tsx` | Optimistic add-to-cart with "Added!" feedback |
| `HomeBuyNowButton` | `home/home-buy-now-button.tsx` | Quick add-to-cart from the hero section |
| `LoginForm` | `login/login-form.tsx` | Client validation wrapper around server action |
| `LoginButton` | `login/login-button.tsx` | Submit button with `useFormStatus` pending state |
| `RegisterForm` | `register/register-form.tsx` | Client validation wrapper around server action |
| `RegisterButton` | `register/register-button.tsx` | Submit button with `useFormStatus` pending state |
| `NavbarClient` | `components/NavbarClient.tsx` | Language switcher, auth state, cart badge |
| `CartProvider` | `lib/hooks/useCart.tsx` | Optimistic cart state initialized from server |
| `AuthProvider` | `lib/api/auth-context.tsx` | Auth state initialized from server session |

## Performance & Optimization
1. **Lazy Loading:** The store page implements infinite scroll using `IntersectionObserver` to fetch more games (12 per page) as the user scrolls, conserving browser resources.
2. **Parallel Server Reads:** The language layout calls `getSession()` and `getCart(lang)` via `Promise.all` in `app/[lang]/layout.tsx`, so cart and session are fetched in a single round-trip for server-first pages.
3. **Optimistic Mutations:** Cart mutations (`addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`) apply functional `setState` immediately and fire server actions in the background. No loading spinner needed.
4. **Image Handling:** Uses `next/image` for all game assets. Configured with remote patterns for `placehold.co`; optimized for LCP.
5. **Code Splitting:** Next.js Turbopack automatically handles component-level and page-level chunks.

## API Integration Logic
The application uses a unified response standard: `{ ok: boolean, message: string, data: T }`.

### Account Service (9001)
- **POST** `/api/account/new`: Registration.
- **POST** `/api/account/update`: Profile updates.
- **GET** `/api/account/profile`: Retrieve base64-encoded profile data.

### Product Service (9003)
- **GET** `/api/product/featured`: Retrieves localized game catalog.
- **GET** `/api/product/paged`: (Mock) Retrieves paged, searchable games (100 total).
- **GET** `/api/product/[id]`: Retrieves specific game data based on `{lang}`.

### Purchase Service (9004)
- **POST** `/api/purchase/checkout`: Finalizes transaction.

## Helper Functions & Hooks

### `lib/api/account.ts` (server actions)
- `loginUser(email, password)` — validates credentials, writes `user_session` cookie, returns `ApiResponse<UserProfile>`.
- `logoutUser()` — deletes `user_session` cookie.
- `getSession()` — reads and parses `user_session` cookie, returns `UserProfile | null`.
- `registerUser(data)` — mock registration.

### `lib/api/cart.ts` (server actions)
- `getCart(lang)` — reads `cart` cookie, hydrates game details from mock data, returns `CartItem[]`.
- `addToCartAction(gameId)` — increments quantity (or inserts) in the `cart` cookie.
- `removeFromCartAction(gameId)` — removes item from the `cart` cookie.
- `updateQuantityAction(gameId, delta)` — adjusts quantity; removes if quantity reaches 0.
- `clearCartAction()` — deletes the `cart` cookie.

### `lib/hooks/useCart.tsx` (CartProvider)
- Initialized via `initialCart` prop (server-fetched `CartItem[]`).
- All mutations use functional `setCartItems(prev => ...)` to avoid stale closure issues during batched calls.
- Each mutation calls the corresponding server action in the background (`.catch()` logs errors without rolling back).
- Exposes: `cartItems`, `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, `total`, `itemCount`.

### `lib/api/dummy-data.ts`
- `getGamesPaged(lang, page, limit, search)` — case-insensitive title/tag filtering with simulated async delay.
- `getGameById(id, lang)` — returns a single game by ID.
- `getFeaturedGames(lang)` — returns the full game list.

### `lib/i18n/`
- `getTranslations(lang)` — synchronous, for server components.
- `useI18n()` — React context hook, for client components.

## Responsive Utilities
- **Navbar:** Adaptive layout with responsive padding (`px-4` to `px-8`) and a mobile-only hamburger menu with full-screen drawer.
- **Hero:** Scaling fonts and paddings using Tailwind dynamic classes (`text-2xl` to `text-6xl`).
- **Store Grid:** `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4` with forced 16:9 aspect ratios on all cards.
