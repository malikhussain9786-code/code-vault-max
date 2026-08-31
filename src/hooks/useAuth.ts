import { useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * Thin wrapper around the auth store's own methods, kept as a hook so components
 * don't need to know the store is Zustand specifically. All the real logic (signup,
 * login validation, password hashing) lives in the store and src/lib/auth/*.ts —
 * there is no backend API involved, everything here runs entirely in the browser.
 */
export function useAuth() {
  const store = useAuthStore();

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      await store.signup({ name, email, password });
    },
    [store]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      await store.login({ email, password });
    },
    [store]
  );

  const logout = useCallback(() => {
    store.logout();
  }, [store]);

  return { signup, login, logout };
}
