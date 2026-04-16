# Authentication Documentation

## Overview
The authentication system supports user registration, sign-in, and sign-out.
It interfaces with the account backend service.

## API Endpoints (Mocks)
- `/api/account/new`: Register a new user
- `/api/account/profile`: Retrieve user profile
- `/api/account/update`: Update user profile

## User Lifecycle
1. **Registration:** User navigates to `/{lang}/register` to create an account.
2. **Login:** User navigates to `/{lang}/login` to sign in. Authentication state is managed via `AuthContext` and persisted using an `httpOnly: false` cookie for cross-component access.
3. **Session Sync:** The `AuthProvider` automatically synchronizes the user session from cookies on mount and supports manual `syncSession()` calls.
4. **Logout:** User triggers logout, which clears the session cookie and redirects to the login page.
5. **Profile:** User profile information is retrieved and displayed on `/{lang}/profile`.

## Data Standard
```json
{
    "ok": boolean,
    "message": string,
    "data": UserProfile | null
}
```
