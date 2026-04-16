# Hybrid Rendering Architecture (SSR, SSG, CSR)

The GameStore Frontend utilizes a "Hybrid" approach to rendering, combining the best of Server-Side Rendering, Static Site Generation, and Client-Side Rendering to achieve high performance and interactivity.

## 1. SSR (Server-Side Rendering)
**Primary Location:** `app/[lang]/layout.tsx`

The core shell of every page is rendered on the server. When a request hits the server (e.g., `/id/store`):
- The server processes the `[lang]` parameter immediately.
- It determines the user's preferred language and sets the initial i18n context.
- It generates the HTML for the **Navbar**, **Footer**, and the global **EnvBanner**.
- **Benefit:** This ensures the page is indexable by search engines (SEO) and provides a fast "First Contentful Paint" for the user.

## 2. CSR (Client-Side Rendering)
**Primary Location:** `app/[lang]/store/page.tsx`, `app/[lang]/home/page.tsx`, `components/Navbar.tsx`

Once the server-rendered shell arrives in the browser, React takes over (hydration). Interactive features are handled exclusively on the client:
- **Infinite Scroll:** Uses the `IntersectionObserver` API to detect when to fetch the next batch of games.
- **Search & Filtering:** The debounced search logic and real-time state updates are CSR-driven.
- **Language Switching:** The transition between `/en` and `/id` routes is managed by the Next.js router on the client.
- **Shopping Cart:** Persistent storage in `localStorage` with multi-tab synchronization logic.
- **Benefit:** Provides a fluid, "App-like" experience with no full-page reloads during catalog browsing.

## 3. SSG (Static Site Generation) & Optimization
**Primary Location:** `public/`, `next.config.ts`, Asset Layer

While many pages are dynamic, Next.js applies static optimizations automatically:
- **Asset Optimization:** Remote images from `placehold.co` are pre-processed and optimized at the edge.
- **Static Assets:** CSS, Fonts, and global SVGs are served as static files for maximum speed.
- **SSG-Ready:** The architecture is designed to support `generateStaticParams`, allowing all localized routes to be fully pre-rendered at build time if the data set becomes stable.

## Summary Table

| Paradigm | Usage in GameStore | Key Benefit |
| :--- | :--- | :--- |
| **SSR** | Layouts, language detection, SEO metadata. | Search engine visibility & fast initial load. |
| **CSR** | Search, Infinite Scroll, Cart, UI interactivity. | Smooth user experience without refreshes. |
| **SSG** | Global styles, optimized images, static assets. | Low-latency delivery of core assets. |
