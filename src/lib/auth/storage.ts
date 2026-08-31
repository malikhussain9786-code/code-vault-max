// Storage layer for users and sessions, entirely in the browser. Everything is
// namespaced under `cvm:` keys so it never collides with anything else in
// localStorage. This is also the single place that knows the storage format.

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  salt: string;
  hash: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

const USERS_KEY = 'cvm:users';
const SESSION_KEY = 'cvm:session';

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    // Corrupt or inaccessible storage — fail safe to an empty list rather than
    // throwing and breaking the whole app on load.
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByEmail(email: string): StoredUser | null {
  const normalized = email.trim().toLowerCase();
  return readUsers().find((u) => u.email === normalized) ?? null;
}

export function findUserById(id: string): StoredUser | null {
  return readUsers().find((u) => u.id === id) ?? null;
}

export function createUser(params: {
  name: string;
  email: string;
  salt: string;
  hash: string;
}): StoredUser {
  const users = readUsers();
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: params.name,
    email: params.email.trim().toLowerCase(),
    salt: params.salt,
    hash: params.hash,
    bio: null,
    avatarUrl: null,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  return user;
}

export function updateUserPassword(userId: string, salt: string, hash: string): boolean {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return false;
  users[idx] = { ...users[idx], salt, hash };
  writeUsers(users);
  return true;
}

export function updateUserProfile(
  userId: string,
  updates: { name?: string; bio?: string | null; avatarUrl?: string | null }
): StoredUser | null {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  writeUsers(users);
  return users[idx];
}

export function getSessionUserId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionUserId(userId: string): void {
  localStorage.setItem(SESSION_KEY, userId);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
