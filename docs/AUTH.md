# Authentication Documentation

## Overview
The authentication system supports user registration, sign-in, and sign-out.
It interfaces with the account backend service.

## API Endpoints (Mocks)
- `/api/account/new`: Register a new user
- `/api/account/profile`: Retrieve user profile
- `/api/account/update`: Update user profile

## User Lifecycle
1. User navigates to `/register` to create an account.
2. User navigates to `/login` to sign in.
3. User profile information is retrieved and displayed on `/profile`.
4. (TBA) Sign-out functionality.

## Data Standard
```json
{
    "ok": boolean,
    "message": string,
    "data": UserProfile | null
}
```
