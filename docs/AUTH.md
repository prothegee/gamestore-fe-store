# Authentication Documentation

## Overview
The authentication system supports user registration, sign-in, and sign-out. Auth state is managed entirely server-side via cookies, with the client initialized from the server-read session.

## API Endpoints (Mocks)
- `/api/account/new`: Register a new user
- `/api/account/profile`: Retrieve user profile
- `/api/account/update`: Update user profile

## User Lifecycle

1. **Registration:** User navigates to `/{lang}/register`. The page is a server component. The `RegisterForm` client component validates fields (username required, email format, password ≥ 6 chars) before the `handleRegister` server action is invoked. On success, redirects to `/{lang}/register?success=true`.

2. **Login:** User navigates to `/{lang}/login`. The page is a server component. The `LoginForm` client component validates fields before the `handleLogin` server action is invoked. The server action calls `loginUser()`, which writes a `user_session` cookie (`httpOnly: false` so the client `AuthProvider` can also read it as a fallback). On success, redirects to `/{lang}/home`.

3. **Session Initialization:** The language layout (`app/[lang]/layout.tsx`) calls `getSession()` server-side on every request. The result is passed as `initialUser` to `AuthProvider`. This means auth state is available immediately on the first render — no loading spinner, no `useEffect` flash.

4. **Client Auth State:** `AuthProvider` initializes from `initialUser`. Client components (Navbar, cart, etc.) read auth state via `useAuth()`. The `syncSession()` fallback reads the `user_session` cookie from `document.cookie` if `initialUser` was not provided.

5. **Protected Pages:** `/{lang}/profile` is a server component that calls `getSession()` and uses `redirect()` server-side if no session is found. This eliminates the `useEffect` redirect pattern and the "Loading..." flash on unauthenticated visits.

6. **Logout:** User triggers `handleLogout` in `NavbarClient`. This calls `logoutUser()` (server action that deletes the `user_session` cookie) and then `router.push` to the login page.

## Demo Credentials
```
Username: demouser
Password: demouser
```

## Data Standard
```json
{
    "ok": boolean,
    "message": string,
    "data": UserProfile | null
}
```

## UserProfile Shape
```typescript
interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  language: Language;  // 'en' | 'id'
}
```

## Cookie Details
| Cookie | Value | Options |
| :--- | :--- | :--- |
| `user_session` | `JSON.stringify(UserProfile)` | `httpOnly: false`, `maxAge: 7 days`, `path: /` |
