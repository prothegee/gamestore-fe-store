# Unit Testing with Vitest

This document covers the unit testing strategy and setup for the GameStore Frontend.

## Overview
We use **Vitest** along with **React Testing Library** and **jsdom** to test core logic, hooks, and localized translations.

## Running Tests
To run all unit tests:
```bash
bun run test
```

To run tests in watch mode:
```bash
bun run vitest watch
```

## Current Test Suites
1.  **Cart Logic (`tests/cart.test.tsx`):**
    *   Verifies item addition and removal.
    *   Tests authentication-based access control and persistent storage (`localStorage`).
    *   Validates quantity grouping and normalization logic.
    *   Ensures total price calculations are accurate.
    *   **New:** Tests single-item addition to prevent double-increment bugs and ensures consistency during state transitions.
2.  **I18n Translations (`tests/i18n.test.ts`):**
    *   Ensures key parity between English and Indonesian dictionaries.
    *   Verifies specific translation values.

## Configuration
*   **`vitest.config.ts`**: Defines the `jsdom` environment and global setup.
*   **`tests/setup.ts`**: Mocks `localStorage` and `next/navigation` modules.

## Guidelines
*   **File Extension**: Use `.tsx` for tests that involve React components or contexts.
*   **Context Wrappers**: Always use the `wrapper` pattern in `renderHook` to provide `AuthProvider`, `CartProvider`, and `I18nProvider` context.
