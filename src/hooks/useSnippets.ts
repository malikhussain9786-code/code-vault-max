import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import * as storage from '@/lib/snippets/storage';
import type { StoredSnippet } from '@/lib/snippets/storage';

// Keeps the exact same shape the rest of the app already expects (snake_case fields,
// matching the original API response shape) — only the storage layer underneath
// changed, so no consuming component needed to change at all.
export interface Snippet {
  id: string;
  title: string;
  description: string | null;
  code: string;
  language: string;
  category: string | null;
  is_favorite: boolean;
  tags: string[];
  project_id: string | null;
  created_at: string;
  updated_at: string;
}

function toPublicShape(s: StoredSnippet): Snippet {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    code: s.code,
    language: s.language,
    category: s.category,
    is_favorite: s.isFavorite,
    tags: s.tags,
    project_id: s.projectId,
    created_at: s.createdAt,
    updated_at: s.updatedAt,
  };
}

/**
 * All snippets live in this browser's localStorage, scoped to the logged-in user —
 * there is no backend server or database in this build. Real, instant, no network
 * round trip — the trade-off is no cross-device sync (disclosed clearly to the user
 * on the settings/signup pages), consistent with the deliberate architecture choice
 * to match a proven, working, server-free pattern.
 */
export function useSnippets() {
  const userId = useAuthStore((s) => s.user?.id);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null); // kept for interface compatibility — localStorage reads don't realistically fail

  const refresh = useCallback(() => {
    if (!userId) {
      setSnippets([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setSnippets(storage.listSnippets(userId).map(toPublicShape));
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createSnippet = useCallback(
    (input: {
      title: string;
      description?: string;
      code: string;
      language: string;
      category?: string;
      tags?: string[];
    }) => {
      if (!userId) throw new Error('Not logged in.');
      const created = storage.createSnippet(userId, input);
      refresh();
      return toPublicShape(created);
    },
    [userId, refresh]
  );

  const updateSnippet = useCallback(
    (id: string, updates: Partial<Snippet>) => {
      if (!userId) throw new Error('Not logged in.');
      const updated = storage.updateSnippet(userId, id, {
        title: updates.title,
        description: updates.description,
        code: updates.code,
        language: updates.language,
        category: updates.category,
        tags: updates.tags,
      });
      refresh();
      if (!updated) throw new Error('Snippet not found.');
      return toPublicShape(updated);
    },
    [userId, refresh]
  );

  const deleteSnippet = useCallback(
    (id: string) => {
      if (!userId) throw new Error('Not logged in.');
      storage.deleteSnippet(userId, id);
      refresh();
    },
    [userId, refresh]
  );

  const duplicateSnippet = useCallback(
    (id: string) => {
      if (!userId) throw new Error('Not logged in.');
      storage.duplicateSnippet(userId, id);
      refresh();
    },
    [userId, refresh]
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      if (!userId) throw new Error('Not logged in.');
      storage.toggleFavorite(userId, id);
      refresh();
    },
    [userId, refresh]
  );

  return {
    snippets,
    loading,
    error,
    refresh,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    duplicateSnippet,
    toggleFavorite,
  };
}
