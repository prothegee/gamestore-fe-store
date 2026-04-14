'use client';

// IMPORTANT:
// - Current state is in demouser.
// - This mock authentication allows testing of restricted features, Gemini.

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

// TODO:
// - Fetch from `url/api/account/new` to create account.
// TMP: ignore, define later
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function registerUser(data: any): Promise<ApiResponse<UserProfile>> {
  console.warn(`TODO: registerUser: ${JSON.stringify(data)}`);

  // Mock response
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
  // Mock validation for demouser:demouser
  if (email === 'demouser' && password === 'demouser') {
    return {
      ok: true,
      message: "Login successful",
      data: {
        id: "018ec631-1921-7ac1-90cf-393018ec6311",
        username: "demouser",
        email: "demouser@example.com",
        language: "en"
      }
    };
  }

  return {
    ok: false,
    message: "Invalid credentials",
    data: null
  };
}

// TODO:
// - Fetch from `url/api/account/profile` to get the profile information use base64 when sent.
export async function getProfile(token: string): Promise<ApiResponse<UserProfile>> {
  console.warn(`TODO: getProfile: ${token}`);

  // Mock response
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

// TODO:
// - Fetch from `url/api/account/update` to update account.
// TMP: ignore, define later
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateProfile(data: any): Promise<ApiResponse<UserProfile>> {
  console.warn(`TODO: updateProfile: ${JSON.stringify(data)}`);

  return {
    ok: true,
    message: "Profile updated (mock)",
    data: null
  };
}
