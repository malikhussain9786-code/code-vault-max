export type ProjectStatus = 'planning' | 'development' | 'completed';

export type SnippetCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'apis'
  | 'algorithms'
  | 'ui_components'
  | 'utilities'
  | 'security';

export type SnippetVisibility = 'private' | 'public';
export type ExecutionStatus = 'success' | 'error';

/** The 12 languages supported for real syntax highlighting and AI-powered code review. */
export const EXECUTABLE_LANGUAGES = [
  'python',
  'javascript',
  'typescript',
  'java',
  'c',
  'cpp',
  'csharp',
  'go',
  'php',
  'ruby',
  'sql',
  'bash',
] as const;
export type ExecutableLanguage = (typeof EXECUTABLE_LANGUAGES)[number];

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  tech_stack: string[];
  status: ProjectStatus;
  created_at: Date;
  updated_at: Date;
}

export interface Snippet {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  code: string;
  language: string;
  category: SnippetCategory | null;
  visibility: SnippetVisibility;
  is_favorite: boolean;
  share_slug: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Tag {
  id: string;
  name: string;
}

export interface ExecutionHistoryEntry {
  id: string;
  user_id: string;
  snippet_id: string | null;
  language: string;
  code: string;
  stdin: string | null;
  stdout: string | null;
  stderr: string | null;
  exit_code: number | null;
  execution_time_ms: number | null;
  memory_kb: number | null;
  status: ExecutionStatus;
  created_at: Date;
}
