'use server';

import { cookies } from 'next/headers';
import { Language } from "@/lib/i18n/translations";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  language: Language;
}

export interface ApiResponse<T> {
  ok: boolean;
  message: string;
  data: T | null;
}

export async function registerUser(data: { username?: string; email?: string; password?: string }): Promise<ApiResponse<UserProfile>> {
  console.warn(`TODO: registerUser: ${JSON.stringify(data)}`);

  return {
    ok: true,
    message: "Registration successful (mock)",
    data: {
      id: "1",
      username: data.username || "user",
      email: data.email || "user@example.com",
      language: "en"
    }
  };
}

export async function loginUser(email: string, password: string): Promise<ApiResponse<UserProfile>> {
  if (email === 'demouser' && password === 'demouser') {
    const user = {
      id: "018ec631-1921-7ac1-90cf-393018ec6311",
      username: "demouser",
      email: "demouser@example.com",
      language: "en" as Language
    };

    const cookieStore = await cookies();
    cookieStore.set('user_session', JSON.stringify(user), {
      httpOnly: false, // Allow client-side reading for the Cart state
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return {
      ok: true,
      message: "Login successful",
      data: user
    };
  }

  return {
    ok: false,
    message: "Invalid credentials",
    data: null
  };
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('user_session');
}

export async function getSession(): Promise<UserProfile | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('user_session');
  if (!session) return null;
  try {
    return JSON.parse(session.value);
  } catch {
    return null;
  }
}

export async function getProfile(_token?: string): Promise<ApiResponse<UserProfile>> {
  return {
    ok: true,
    message: "",
    data: {
      id: "1",
      username: "prothegee",
      email: "prothegee@example.com",
      avatarUrl: "https://placehold.co/100x100/1b2838/66c0f4?text=PR",
      language: "en"
    }
  };
}

export async function updateProfile(_data?: Record<string, unknown>): Promise<ApiResponse<UserProfile>> {
  return {
    ok: true,
    message: "Profile updated (mock)",
    data: null
  };
}
