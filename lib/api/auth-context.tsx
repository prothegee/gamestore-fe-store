'use client';

// IMPORTANT:
// - Current state is in demouser.
// - This context manages the global authentication state for the application, Gemini.

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProfile, loginUser as apiLoginUser, logoutUser } from './account';
import { useRouter } from 'next/navigation';
import { useI18n } from '../i18n/i18n-context';

type AuthContextType = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  syncSession: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ 
  children,
  initialUser = null
}: { 
  children: ReactNode,
  initialUser?: UserProfile | null
}) {
  const [user, setUser] = useState<UserProfile | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);
  const router = useRouter();
  const { language } = useI18n();

  const syncSession = useCallback(() => {
    // If we're on the server, we can't sync via cookies
    if (typeof document === 'undefined') return;

    // This is now a fallback, as initialUser is passed from Server Layout
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const sessionCookie = getCookie('user_session');
    if (sessionCookie) {
      try {
        const parsed = JSON.parse(sessionCookie);
        setUser(parsed);
      } catch (e) {
        console.error("AuthContext: Failed to parse session cookie", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!initialUser) {
      syncSession();
    } else {
      setUser(initialUser);
    }
    setLoading(false);
  }, [initialUser, syncSession]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function login(email: string, password: string): Promise<boolean> {
    const response = await apiLoginUser(email, password);
    if (response.ok && response.data) {
      setUser(response.data);
      return true;
    }
    return false;
  }

  async function logout() {
    await logoutUser();
    syncSession();
    router.push(`/${language}/login`);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, syncSession, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
