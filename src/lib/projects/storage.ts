export interface StoredProject {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  techStack: string[];
  status: 'planning' | 'development' | 'completed';
  createdAt: string;
  updatedAt: string;
}

function storageKey(userId: string): string {
  return `cvm:projects:${userId}`;
}

function readProjects(userId: string): StoredProject[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeProjects(userId: string, projects: StoredProject[]): void {
  localStorage.setItem(storageKey(userId), JSON.stringify(projects));
}

export function listProjects(userId: string): StoredProject[] {
  return readProjects(userId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getProjectById(userId: string, id: string): StoredProject | null {
  return readProjects(userId).find((p) => p.id === id) ?? null;
}

export function createProject(
  userId: string,
  input: { name: string; description?: string | null; techStack?: string[]; status?: StoredProject['status'] }
): StoredProject {
  const projects = readProjects(userId);
  const now = new Date().toISOString();
  const project: StoredProject = {
    id: crypto.randomUUID(),
    userId,
    name: input.name,
    description: input.description ?? null,
    techStack: input.techStack ?? [],
    status: input.status ?? 'planning',
    createdAt: now,
    updatedAt: now,
  };
  projects.push(project);
  writeProjects(userId, projects);
  return project;
}

export function updateProject(
  userId: string,
  id: string,
  updates: Partial<Omit<StoredProject, 'id' | 'userId' | 'createdAt'>>
): StoredProject | null {
  const projects = readProjects(userId);
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...updates, updatedAt: new Date().toISOString() };
  writeProjects(userId, projects);
  return projects[idx];
}

export function deleteProject(userId: string, id: string): boolean {
  const projects = readProjects(userId);
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;
  writeProjects(userId, filtered);
  return true;
}
