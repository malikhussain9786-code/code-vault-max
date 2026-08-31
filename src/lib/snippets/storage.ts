// Snippets are stored per-user in localStorage, under a key that includes the
// owning user's id — keeps different accounts' data cleanly separated on the same
// browser, and means clearing one user's data never touches another's.

export interface StoredSnippet {
  id: string;
  userId: string;
  projectId: string | null;
  title: string;
  description: string | null;
  code: string;
  language: string;
  category: string | null;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

function storageKey(userId: string): string {
  return `cvm:snippets:${userId}`;
}

function readSnippets(userId: string): StoredSnippet[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeSnippets(userId: string, snippets: StoredSnippet[]): void {
  localStorage.setItem(storageKey(userId), JSON.stringify(snippets));
}

export function listSnippets(userId: string): StoredSnippet[] {
  return readSnippets(userId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getSnippetById(userId: string, id: string): StoredSnippet | null {
  return readSnippets(userId).find((s) => s.id === id) ?? null;
}

export function createSnippet(
  userId: string,
  input: {
    title: string;
    description?: string | null;
    code: string;
    language: string;
    category?: string | null;
    tags?: string[];
    projectId?: string | null;
  }
): StoredSnippet {
  const snippets = readSnippets(userId);
  const now = new Date().toISOString();
  const snippet: StoredSnippet = {
    id: crypto.randomUUID(),
    userId,
    projectId: input.projectId ?? null,
    title: input.title,
    description: input.description ?? null,
    code: input.code,
    language: input.language,
    category: input.category ?? null,
    tags: input.tags ?? [],
    isFavorite: false,
    createdAt: now,
    updatedAt: now,
  };
  snippets.push(snippet);
  writeSnippets(userId, snippets);
  return snippet;
}

export function updateSnippet(
  userId: string,
  id: string,
  updates: Partial<Omit<StoredSnippet, 'id' | 'userId' | 'createdAt'>>
): StoredSnippet | null {
  const snippets = readSnippets(userId);
  const idx = snippets.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  snippets[idx] = { ...snippets[idx], ...updates, updatedAt: new Date().toISOString() };
  writeSnippets(userId, snippets);
  return snippets[idx];
}

export function deleteSnippet(userId: string, id: string): boolean {
  const snippets = readSnippets(userId);
  const filtered = snippets.filter((s) => s.id !== id);
  if (filtered.length === snippets.length) return false;
  writeSnippets(userId, filtered);
  return true;
}

export function duplicateSnippet(userId: string, id: string): StoredSnippet | null {
  const original = getSnippetById(userId, id);
  if (!original) return null;
  return createSnippet(userId, {
    title: `${original.title} (copy)`,
    description: original.description,
    code: original.code,
    language: original.language,
    category: original.category,
    tags: original.tags,
    projectId: original.projectId,
  });
}

export function toggleFavorite(userId: string, id: string): StoredSnippet | null {
  const snippet = getSnippetById(userId, id);
  if (!snippet) return null;
  return updateSnippet(userId, id, { isFavorite: !snippet.isFavorite });
}
