'use client';

// IMPORTANT:
// - Current state is in demouser.
// - This context manages the global authentication state for the application, Gemini.

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, loginUser as apiLoginUser } from './account';
import { useRouter } from 'next/navigation';
import { useI18n } from '../i18n/i18n-context';

type AuthContextType = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { language } = useI18n();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user_session');
      }
    }
    setLoading(false);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function login(email: string, password: string): Promise<boolean> {
    const response = await apiLoginUser(email, password);
    if (response.ok && response.data) {
      setUser(response.data);
      localStorage.setItem('user_session', JSON.stringify(response.data));
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('user_session');
    router.push(`/${language}/login`);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
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
