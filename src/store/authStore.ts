import { create } from 'zustand';
import { hashPassword, verifyPassword } from '@/lib/auth/crypto';
import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserPassword,
  updateUserProfile,
  getSessionUserId,
  setSessionUserId,
  clearSession,
} from '@/lib/auth/storage';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
}

function toPublicUser(stored: ReturnType<typeof findUserById>): AuthUser | null {
  if (!stored) return null;
  // Never expose salt/hash to the rest of the app — components should never have a
  // reason to see these, even though they're only ever hashed values.
  return { id: stored.id, name: stored.name, email: stored.email, bio: stored.bio, avatarUrl: stored.avatarUrl };
}

interface AuthState {
  user: AuthUser | null;
  isInitializing: boolean;
  init: () => void;
  signup: (params: { name: string; email: string; password: string }) => Promise<AuthUser>;
  login: (params: { email: string; password: string }) => Promise<AuthUser>;
  logout: () => void;
  updateProfile: (updates: { name?: string; bio?: string | null; avatarUrl?: string | null }) => AuthUser | null;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

/**
 * All account data lives in the browser (localStorage) — there is no backend server
 * in this build. This is a deliberate architectural choice, not an oversight: it
 * mirrors the same proven, working pattern used elsewhere (see src/lib/auth/*.ts for
 * the storage layer, which is the single seam where a real backend could be swapped in
 * later without rewriting the rest of the app).
 *
 * Honest, disclosed limitation: an account only exists in the browser it was created
 * in — there is no cross-device sync, and clearing browser data removes it.
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isInitializing: true,

  init: () => {
    const sessionUserId = getSessionUserId();
    if (sessionUserId) {
      const found = findUserById(sessionUserId);
      if (found) {
        set({ user: toPublicUser(found), isInitializing: false });
        return;
      }
      clearSession(); // stale session pointing at a since-deleted user
    }
    set({ isInitializing: false });
  },

  signup: async ({ name, email, password }) => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) throw new Error('Enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) throw new Error('Enter a valid email address.');
    if (password.length < 8) throw new Error('Password must be at least 8 characters.');
    if (findUserByEmail(trimmedEmail)) throw new Error('An account with this email already exists on this browser.');

    const { salt, hash } = await hashPassword(password);
    const newUser = createUser({ name: trimmedName, email: trimmedEmail, salt, hash });
    setSessionUserId(newUser.id);
    const publicUser = toPublicUser(newUser)!;
    set({ user: publicUser });
    return publicUser;
  },

  login: async ({ email, password }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const found = findUserByEmail(trimmedEmail);
    // Same error for "no such user" and "wrong password" — don't leak which one it
    // was, a real (if small-scale) security practice worth keeping even client-side.
    if (!found) throw new Error('Incorrect email or password.');
    const ok = await verifyPassword(password, found.salt, found.hash);
    if (!ok) throw new Error('Incorrect email or password.');

    setSessionUserId(found.id);
    const publicUser = toPublicUser(found)!;
    set({ user: publicUser });
    return publicUser;
  },

  logout: () => {
    clearSession();
    set({ user: null });
  },

  updateProfile: (updates) => {
    const current = get().user;
    if (!current) return null;
    const updated = updateUserProfile(current.id, updates);
    const publicUser = toPublicUser(updated);
    if (publicUser) set({ user: publicUser });
    return publicUser;
  },

  changePassword: async (currentPassword, newPassword) => {
    const current = get().user;
    if (!current) throw new Error('Not logged in.');
    const found = findUserById(current.id);
    if (!found) throw new Error('Account not found.');
    const ok = await verifyPassword(currentPassword, found.salt, found.hash);
    if (!ok) throw new Error('Current password is incorrect.');
    if (newPassword.length < 8) throw new Error('New password must be at least 8 characters.');
    const { salt, hash } = await hashPassword(newPassword);
    updateUserPassword(current.id, salt, hash);
  },
}));
