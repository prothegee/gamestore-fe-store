# High-Level Design (HLD) - GameStore Frontend

## System Architecture
The GameStore Frontend is a Next.js application designed with a language-first routing architecture. It utilizes a **Hybrid Rendering Strategy** (SSR for layout/SEO, CSR for interactivity) to provide a high-performance experience. See [Hybrid Architecture](HYBRID-ARCHITECTURE.md) for details.

## Routing Architecture
The application uses a dynamic language prefix `/{lang}/` for all user-facing routes. A server-side proxy handles incoming requests to ensure a valid language context is always present.

```mermaid
graph TD
    User([User Browser]) ---> Proxy[Next.js Proxy/Middleware]
    
    Proxy -.-> |"Missing/Invalid {lang}"| Redirect["Redirect using _preferred-lang cookie"]
    Proxy ---> |"Valid {lang}"| AppLayout["Root Layout (app/layout.tsx)"]
    
    AppLayout ---> LangLayout["Language Layout (app/[lang]/layout.tsx)"]
    
    LangLayout ---> Navbar["Navbar Component"]
    LangLayout ---> Footer["Footer Component"]
    LangLayout ---> Pages["Localized Pages (/{lang}/<page>)"]
    
    Pages -.-> |"Language Switch"| I18nContext["I18n Context Provider"]
    I18nContext -.-> |"Update Cookie"| Cookie["_preferred-lang Cookie"]
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
1.  **Server Proxy (proxy.ts):** Normalizes paths and manages the `_preferred-lang` cookie.
2.  **I18n Engine:** Dictionary-based system synchronized with URL state.
3.  **Asset Layer:** Uses `next/image` for high-performance localized asset rendering.
4.  **State Management:** Custom hooks (e.g., `useCart`) for persistent commerce logic.
