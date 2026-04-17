# Hybrid Rendering Architecture

The GameStore Frontend uses a **hybrid approach** that balances **Server-First** performance for core pages with **Client-First** interactivity for high-frequency user actions like the infinite-scroll store.

---

## 1. Server-First Pages (SSR)

**Pages:** Home, Game Details, Login, Register, Profile.

### What happens on the server
- **Parallel Data Fetching:** Auth session (`getSession()`) and Cart (`getCart(lang)`) are read from cookies in parallel in the root language layout (`app/[lang]/layout.tsx`).
- **Instant Paint:** Navbar, Footer, and core page content are rendered to HTML on the server.
- **Security:** Sensitive session reading happens entirely server-side.
- **I18n:** Translations are resolved synchronously via `getTranslations(lang)`.

---

## 2. Client-First Store (CSR)

**Location:** `app/[lang]/store/page.tsx`

The Store page prioritizes smooth interaction and infinite scrolling:
- **'use client':** The entire page is a client component to manage complex filtering and scroll state.
- **Infinite Scroll:** Uses `IntersectionObserver` to trigger fetches as the user scrolls, avoiding rigid pagination buttons.
- **Debounced Search:** Local state handles typing with a 500ms delay before triggering a fetch.
- **Performance:** Initial games are fetched on mount; browser resources are conserved by only rendering visible items.

---

## 3. Client Islands

Specific interactive elements co-exist within server pages:

| Island | Why it needs the client |
| :--- | :--- |
| `AddToCartButton` | Optimistic cart updates, shows "Added!" feedback |
| `LoginForm` / `RegisterForm` | Instant client-side validation before server action submission |
| `NavbarClient` | Language dropdown state, real-time cart badge count |
| `CartProvider` | Global optimistic state across the session |
| `AuthProvider` | Exposes server-read session to client components |

---

## 4. Optimistic Cart System

The cart uses a hybrid approach to ensure zero latency:

1. **Storage:** Server-side `cart` cookie (source of truth).
2. **Action:** Next.js **Server Actions** handle cookie writes.
3. **Optimism:** `CartProvider` applies mutations to local state **immediately** via functional `setState`.
4. **Synchronization:** Server actions run in the background; the UI stays snappy regardless of network latency.

---

## 5. Client-Side Form Validation

Authentication forms (`login`, `register`) utilize a wrapper pattern:
1. The **Server Page** defines the server action and layout.
2. The **Client Island** (`LoginForm`) handles the `<form>` and validation.
3. Errors (empty fields, short passwords) appear **instantly** without a server round-trip.
4. If valid, the native form action triggers the server action for secure processing.

---

## Summary Table

| Feature | Strategy | Benefit |
| :--- | :--- | :--- |
| **Home Page** | Server-First | Best SEO and LCP |
| **Store Page** | Client-First | Fluid infinite scrolling and instant search |
| **Auth Session** | Server-Init + Cookie | Secure, no layout shift or loading spinners |
| **Cart Logic** | Optimistic Client + Server Action | Instant feedback, persistent across hard nav |
| **I18n** | Parallel Dictionary Resolve | Localized HTML delivered on first byte |

