# Low-Level Design (LLD) - GameStore Frontend

## Path Definitions & Components
All paths are prefixed with `{lang}` (supported: `en`, `id`).

| Path | Description | Component |
| :--- | :--- | :--- |
| `/{lang}/home` | Main storefront & catalog (Featured) | `Home` (Client) |
| `/{lang}/store` | Full game catalog grid | `StorePage` (Client) |
| `/{lang}/game/[id]` | Localized game details | `GameDetailPage` (Client) |
| `/{lang}/cart` | Shopping cart overview | `CartPage` (Client) |
| `/{lang}/checkout` | Payment processing simulation | `CheckoutPage` (Client) |
| `/{lang}/payment-status` | Post-purchase feedback | `PaymentStatusPage` (Client) |
| `/{lang}/login` | User authentication (Sign In) | `LoginPage` (Client) |
| `/{lang}/register` | Account creation (Sign Up) | `RegisterPage` (Client) |
| `/{lang}/profile` | User dashboard | `ProfilePage` (Client) |
| `/{lang}/community` | Community features placeholder | `CommunityPage` (Client) |
| `/{lang}/about` | Corporate information | `AboutPage` (Client) |
| `/{lang}/support` | Help center & documentation | `SupportPage` (Client) |

## Performance & Optimization
1.  **Image Handling:** Uses `next/image` for all game assets and profiles. Configured with remote patterns for `placehold.co` and optimized for LCP.
2.  **Grid Consistency:** Forced 16:9 aspect ratios on Store `GameCard` instances to ensure uniform height.
3.  **Code Splitting:** Next.js Turbopack automatically handles component-level and page-level chunks.
4.  **Environment Logic:** `NEXT_PUBLIC_APP_ENV` is used to toggle debug-specific logs or behaviors and display the `EnvBanner`.

## API Integration Logic
The application uses a unified response standard: `{ ok: boolean, message: string, data: T }`.

### Account Service (9001)
*   **POST** `/api/account/new`: Registration.
*   **POST** `/api/account/update`: Profile updates.
*   **GET** `/api/account/profile`: Retrieve base64-encoded profile data.

### Product Service (9003)
*   **GET** `/api/product/featured`: Retrieves localized game catalog.
*   **GET** `/api/product/paged`: (Mock) Retrieves paged, searchable games (100 total).
*   **GET** `/api/product/[id]`: Retrieves specific game data based on `{lang}`.

### Purchase Service (9004)
*   **POST** `/api/purchase/checkout`: Finalizes transaction.

## Helper Functions & Hooks
1.  **useCart():**
    *   State: `cartItems` (synchronized with `localStorage` via `cart_{userId}` key).
    *   Logic: Pure state updates with asynchronous persistence and multi-tab synchronization using a dedicated `useEffect` and custom `cart-update` event.
2.  **getGamesPaged(lang, page, limit, search):**
    *   Logic: Case-insensitive title/tag filtering.
    *   Simulation: 800ms `Promise` delay.
3.  **useI18n():**
    *   State: `language` (synchronized with `_preferred-lang` cookie).
4.  **getGameById(id, lang):**
    *   Logic: Filter `RawGames` based on dynamic segments.

## Responsive Utilities
*   **Navbar:** Adaptive layout with responsive padding (`px-4` to `px-8`) and mobile-only hamburger menu.
*   **Hero:** Scaling fonts and paddings using Tailwind dynamic classes (`text-2xl` to `text-6xl`).
