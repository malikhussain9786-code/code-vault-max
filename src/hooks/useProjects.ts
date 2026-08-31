import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import * as storage from '@/lib/projects/storage';
import * as snippetStorage from '@/lib/snippets/storage';
import type { StoredProject } from '@/lib/projects/storage';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  tech_stack: string[];
  status: 'planning' | 'development' | 'completed';
  snippet_count: number;
  created_at: string;
  updated_at: string;
}

function toPublicShape(p: StoredProject, snippetCount: number): Project {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    tech_stack: p.techStack,
    status: p.status,
    snippet_count: snippetCount,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

/** All projects live in this browser's localStorage, scoped to the logged-in user — same architecture as useSnippets. */
export function useProjects() {
  const userId = useAuthStore((s) => s.user?.id);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const refresh = useCallback(() => {
    if (!userId) {
      setProjects([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const allSnippets = snippetStorage.listSnippets(userId);
    const list = storage
      .listProjects(userId)
      .map((p) => toPublicShape(p, allSnippets.filter((s) => s.projectId === p.id).length));
    setProjects(list);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createProject = useCallback(
    (input: { name: string; description?: string; techStack?: string[]; status?: Project['status'] }) => {
      if (!userId) throw new Error('Not logged in.');
      storage.createProject(userId, input);
      refresh();
    },
    [userId, refresh]
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<{ name: string; description: string; techStack: string[]; status: Project['status'] }>) => {
      if (!userId) throw new Error('Not logged in.');
      storage.updateProject(userId, id, updates);
      refresh();
    },
    [userId, refresh]
  );

  const deleteProject = useCallback(
    (id: string) => {
      if (!userId) throw new Error('Not logged in.');
      storage.deleteProject(userId, id);
      refresh();
    },
    [userId, refresh]
  );

  return { projects, loading, error, refresh, createProject, updateProject, deleteProject };
}
