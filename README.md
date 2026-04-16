# GameStore Frontend

A modern, high-performance Game Store frontend built with Next.js 16 (App Router), mimicking the iconic Steam Store aesthetic and functionality.

<br>

## Key Features

- **Steam-Inspired UI:** High-fidelity dark theme with responsive layouts for desktop and mobile.
- **Internationalization (I18n):** Full support for English (en) and Bahasa Indonesia (id) using language-prefixed routing (/{lang}/).
- **Infinite Store Catalog:** 100+ unique procedurally generated game entries with localized metadata.
- **Smart Search:** Debounced case-insensitive search filtering across titles and tags.
- **Lazy Loading:** Performance-optimized infinite scroll implementation using `IntersectionObserver`.
- **Dynamic Routing:** Server-side proxy for language normalization and SEO-friendly URLs.
- **Image Optimization:** Utilizes `next/image` with remote patterns for high-performance localized asset delivery.
- **Shopping Cart:** Robust persistent cart management using LocalStorage, multi-tab synchronization, and custom React hooks.
- **Mock Integration:** Ready-to-use mock API layer for account management, product catalogs, and checkout flows.
- **Environment Management:** Multi-environment support (debug, staging, prod) via unified environment variables.

<br>

## Technical Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Testing:** [Vitest](https://vitest.dev/)
- **State Management:** React Context & Custom Hooks
- **Runtime:** [Bun](https://bun.sh/) (Recommended) or Node.js

<br>

## Documentation

Detailed technical documentation is available in the docs/ directory:

<br>

### Core Architecture
- **[Project Overview](docs/PROJECT.md):** High-level goals, core mandates, and project structure.
- **[High-Level Design (HLD)](docs/HLD.md):** System architecture, routing flows, and service integration.
- **[Low-Level Design (LLD)](docs/LLD.md):** Path definitions, component mapping, and API logic.
- **[Hybrid Architecture](docs/HYBRID-ARCHITECTURE.md):** Detailed breakdown of SSR, SSG, and CSR integration.

<br>

### Feature Specifications
- **[Authentication](docs/AUTH.md):** User registration, login lifecycle, and profile management.
- **[Internationalization](docs/I18N.md):** Implementation details for multi-language support.
- **[Store & Checkout](docs/STORE.md):** Game browsing, cart logic, and purchase flows.

<br>

### Exceptions & Compatibility
- **[Exceptions](docs/EXCEPTIONS.md):** Known third-party extension conflicts and workarounds.

<br>

### Quality Assurance
- **[Unit Testing (Vitest)](docs/TEST-VITE.md):** Strategy for testing hooks, state, and translations.
- **[E2E Testing (Playwright)](docs/TEST-PLAYWRIGHT.md):** Cross-browser automation for core user flows (Chrome, Firefox, Safari).

<br>

### CI/CD
- **[Format on Merge](.github/workflows/format-on-merge.yml):** Auto-formats code with ESLint on every merge to `main`.
- **[Exceptions](docs/EXCEPTIONS.md):** Known third-party extension conflicts and linting workarounds.

<br>

### Decisions & History
- **[Architecture Decision Records (ADR)](docs/ADR/ADR-20260411_180000.md):** Documented architectural choices and their rationales.

<br>

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) or Node.js (v18+)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   bun install
   ```
3. Copy the environment template and configure:
   ```bash
   cp .env.template .env
   ```

### Running Debug Server
```bash
bun dev
```
Open [http://localhost:9008](http://localhost:9008) (configured via PORT in .env) to see the result.

### Running Tests
Detailed instructions available in the [Vite](docs/TEST-VITE.md) and [Playwright](docs/TEST-PLAYWRIGHT.md) documentation.

```bash
bun run test        # Run unit tests
bun run test:e2e    # Run all E2E tests (Cross-browser)
```

<br>

## Project Structure
```text
├── app/              # Next.js App Router (Localized pages)
├── components/       # Shared UI components
├── docs/             # Technical documentation & ADRs
├── lib/
│   ├── api/          # API services & mock data
│   ├── hooks/        # Custom React hooks (Cart, etc.)
│   └── i18n/         # Localization logic
├── public/           # Static assets
└── tests/            # Vitest test suite
```

<br>

## Notes

See [.TODO.md](.TODO.md) for core task.

<!-- RESERVED: CHANGELOG.md -->

<br>

---

###### end of readme
