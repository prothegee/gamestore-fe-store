# Exceptions

Known exceptions, workarounds, and third-party compatibility notes.

<br>

## DarkReader Hydration Mismatch

### Problem
The DarkReader browser extension injects `data-darkreader-inline-color=""` attributes and `--darkreader-inline-color` CSS custom properties into `<img>` elements at runtime. This causes React hydration warnings because the server-rendered HTML doesn't match the client-side DOM:

```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
  - data-darkreader-inline-color=""
  - --darkreader-inline-color: "transparent"
```

### Solution
A `<meta name="darkreader-lock" />` tag has been added to the root layout (`app/layout.tsx`) to disable DarkReader on this site entirely.

```tsx
export const metadata: Metadata = {
  title: "Game Store",
  description: "Mimicking Steam Store experience",
  other: {
    'darkreader-lock': '',
  },
};
```

### Why This Approach?
- `suppressHydrationWarning` only works for **text content** differences, not attribute mismatches on nested elements.
- DarkReader modifies the DOM **before** React hydrates, which is outside our control.
- The `darkreader-lock` meta tag is the [official DarkReader opt-out mechanism](https://github.com/darkreader/darkreader/issues/691).

### Trade-off
DarkReader will no longer apply dark mode to this site. If native dark mode support is desired, it should be implemented as a first-class feature of the application.

<br>

## ESLint Rule Suppressions

### `react-hooks/set-state-in-effect`

#### Problem
The `eslint-plugin-react-hooks` rule `set-state-in-effect` flags `setState` calls inside `useEffect` that run synchronously. However, initializing state from `localStorage` on component mount is a valid and necessary pattern that cannot be replaced with the recommended "You Might Not Need an Effect" alternatives.

#### Affected Files
- `lib/api/auth-context.tsx` — Restores user session from `localStorage` on mount.
- `lib/hooks/useCart.tsx` — Loads saved cart from `localStorage` on mount.
- `lib/i18n/i18n-context.tsx` — Syncs initial language preference from URL/cookie.

#### Approach
Block-level `/* eslint-disable react-hooks/set-state-in-effect */` / `/* eslint-enable */` comments wrap the specific `useEffect` blocks. This is preferred over global config because it limits the suppression to the exact scope that needs it.

### `react-hooks/exhaustive-deps`

#### Problem
In `lib/i18n/i18n-context.tsx`, the effect that syncs `initialLanguage` into state intentionally omits `language` from the dependency array to avoid infinite loops when the incoming prop differs from current state.

#### Approach
Suppressed alongside `set-state-in-effect` in the same block.

<br>

## Button `onClick` Type

### Problem
The `Button` component originally typed `onClick` as `() => void`, which conflicts with callers that need access to the mouse event (e.g., `e.stopPropagation()`).

#### Fix
Changed `onClick` to `(e: React.MouseEvent<HTMLButtonElement>) => void` in `components/Button.tsx`. This allows event access while maintaining type safety.

<br>
