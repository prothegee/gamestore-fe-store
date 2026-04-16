import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
global.localStorage = localStorageMock as unknown as Storage;

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useParams: () => ({ lang: 'en' }),
}));

// Mock next/headers
vi.mock('next/headers', () => {
  const cookiesMap = new Map();
  return {
    cookies: async () => ({
      get: (name: string) => {
        const value = cookiesMap.get(name);
        return value ? { name, value } : undefined;
      },
      set: (name: string, value: string) => cookiesMap.set(name, value),
      delete: (name: string) => cookiesMap.delete(name),
    }),
  };
});
