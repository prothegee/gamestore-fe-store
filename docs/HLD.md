# High-Level Design (HLD) - GameStore Frontend

## System Architecture
The GameStore Frontend is a Next.js 16 application using a **hybrid rendering strategy**: core pages (Home, Game Details, Profile, Auth) are async server components, while the Store page utilizes client-side state for infinite scroll and debounced search. `'use client'` is also applied to interactive islands like cart mutations and form validation.

## Routing Architecture
All user-facing routes use a dynamic language prefix `/{lang}/`. A server-side proxy handles incoming requests to ensure a valid language context is always present.

```mermaid
graph TD
    User([User Browser]) ---> Proxy[Next.js Proxy/Middleware]
    
    Proxy -.-> |"Missing/Invalid {lang}"| Redirect["Redirect using _preferred-lang cookie"]
    Proxy ---> |"Valid {lang}"| AppLayout["Root Layout (app/layout.tsx)"]
    
    AppLayout ---> LangLayout["Language Layout (app/[lang]/layout.tsx)"]
    LangLayout -.-> |"getSession() + getCart()"| Cookie["HTTP Cookies"]
    
    LangLayout ---> Navbar["Navbar (Server → NavbarClient island)"]
    LangLayout ---> Footer["Footer Component"]
    LangLayout ---> Pages["Localized Pages (/{lang}/<page>)"]
    
    Pages -.-> |"Language Switch"| I18nContext["I18n Context Provider"]
    I18nContext -.-> |"Update Cookie"| Cookie
```

## Request / Render Flow

```mermaid
sequenceDiagram
    participant Browser
    participant Server
    participant Cookie

    Browser->>Server: GET /{lang}/home
    Server->>Cookie: getSession() + getCart(lang)
    Cookie-->>Server: UserProfile | null, CartItem[]
    Server-->>Browser: Fully rendered HTML (Server-First)
    
    Browser->>Server: GET /{lang}/store
    Server->>Browser: Page Shell + Client Logic
    Browser->>Server: getGamesPaged() [Client-side fetch]
    Server-->>Browser: Game results (Initial page)
    
    Browser->>Server: addToCartAction(gameId) [on click]
    Server->>Cookie: Write updated cart cookie
    Server-->>Browser: void (optimistic update already applied)
```

## Service Integration Layer
The frontend communicates with five distinct backend services via environment-configured URLs.

```mermaid
graph LR
    Frontend["GameStore Frontend (Port 9007)"]
    
    Frontend ---> |"Auth/Profile"| AccountSvc["Account Service (9001)"]
    Frontend ---> |"Assets"| MediaSvc["Media Service (9002)"]
    Frontend ---> |"Catalog"| ProductSvc["Product Service (9003)"]
    Frontend ---> |"Payment"| PurchaseSvc["Purchase Service (9004)"]
    Frontend -.-> |"Token/Auth"| SessionSvc["Session Service (9005)"]
    
    subgraph Env [Environment Configuration]
        NEXT_PUBLIC_APP_ENV
    end
    Env -.-> Frontend
```

## Key Components

1. **Server Proxy (`proxy.ts`):** Normalizes paths and manages the `_preferred-lang` cookie.
2. **Language Layout (`app/[lang]/layout.tsx`):** Server component — reads session and cart from cookies in parallel, initializes `AuthProvider` and `CartProvider` with server-fetched state.
3. **I18n Engine:** Dictionary-based system; server components use `getTranslations(lang)`, client components use `useI18n()`.
4. **Cart System (`lib/api/cart.ts` + `lib/hooks/useCart.tsx`):** Server actions manage cookie persistence; `CartProvider` applies mutations optimistically on the client and calls server actions in the background.
5. **Suspense Streaming (`store/games-grid.tsx`):** The game grid is an async server component wrapped in `<Suspense>` with an animated skeleton fallback, so the store page shell renders immediately.
6. **Asset Layer:** Uses `next/image` for high-performance localized asset rendering.
