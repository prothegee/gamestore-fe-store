# End-to-End Testing with Playwright

This document covers the E2E testing strategy for cross-browser validation of the GameStore Frontend.

## Overview
We use **Playwright** to simulate real user interactions across multiple browser engines to ensure UI stability and functional correctness.

## Browser Coverage
The project is configured to run tests against:
1.  **Chromium** (Chrome, Edge)
2.  **Firefox** (QA requested engine)
3.  **WebKit** (Safari)

## Running Tests
Run all tests in all browsers:
```bash
bun run test:e2e
```

Run tests only in a specific browser:
```bash
bun run test:e2e --project=firefox
bun run test:e2e --project=webkit
```

Run with UI mode (interactive debugger):
```bash
bun run test:e2e --ui
```

## Setup & Prerequisites
If running on a new environment, ensure browser binaries are installed:
```bash
npx playwright install
```

## Current Test Scenarios
*   **Store Flow (`tests/e2e/store.spec.ts`):**
    *   Landing page accessibility.
    *   Authentication flow with `demouser:demouser`.
    *   Search and debounced result validation.
    *   Product detail navigation.
    *   Add-to-cart logic and Navbar count synchronization.
    *   Cart page quantity verification (`x1`, `x2`).
*   **Localization:**
    *   Language prefix switching (`/en` to `/id`) and UI string updates.

## Configuration
*   **`playwright.config.ts`**: Configures base URL (`http://localhost:9007`), timeout, projects, and local web server integration.
