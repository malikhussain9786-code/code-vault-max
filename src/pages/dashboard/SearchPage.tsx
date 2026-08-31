import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Code2, FolderGit2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useSnippets } from '@/hooks/useSnippets';
import { useProjects } from '@/hooks/useProjects';

const LANGUAGES = ['python', 'javascript', 'typescript', 'java', 'c', 'cpp', 'csharp', 'go', 'php', 'ruby', 'sql', 'bash'];

/**
 * Real-time, client-side search — everything is already loaded from localStorage
 * (see useSnippets/useProjects), so there's no debounce or network round trip needed;
 * filtering a small in-memory list is effectively instant either way.
 */
export function SearchPage() {
  const { snippets } = useSnippets();
  const { projects } = useProjects();
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');

  const searched = query.trim().length > 0 || language.length > 0;

  const matchedSnippets = useMemo(() => {
    if (!searched) return [];
    const q = query.trim().toLowerCase();
    return snippets.filter((s) => {
      if (language && s.language !== language) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        (s.description ?? '').toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [snippets, query, language, searched]);

  const matchedProjects = useMemo(() => {
    if (!searched || language) return []; // project results don't apply to a language filter
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return projects.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q)
    );
  }, [projects, query, language, searched]);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-display font-bold text-2xl tracking-tight">Search</h1>
      <p className="text-text-muted mt-1 text-sm">Find any snippet or project instantly.</p>

      <div className="mt-5 flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search snippets and projects…"
            className="w-full bg-bg-elevated border border-border-subtle rounded-control pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted"
            autoFocus
          />
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-bg-elevated border border-border-subtle rounded-control px-3 py-2.5 text-sm text-text-primary"
        >
          <option value="">All languages</option>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        {searched && matchedSnippets.length === 0 && matchedProjects.length === 0 && (
          <Card>
            <p className="text-sm text-text-muted">No results for this search.</p>
          </Card>
        )}

        {!searched && (
          <Card>
            <p className="text-sm text-text-muted">Start typing to search across everything you've saved.</p>
          </Card>
        )}

        {matchedSnippets.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
              Snippets ({matchedSnippets.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {matchedSnippets.map((s) => (
                <Link key={s.id} to={`/dashboard/editor?snippetId=${s.id}`}>
                  <Card className="hover:border-accent-primary/50 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <Code2 size={14} className="text-accent-primary" />
                      <h3 className="font-display font-semibold text-sm truncate">{s.title}</h3>
                    </div>
                    {s.description && <p className="text-xs text-text-muted line-clamp-2">{s.description}</p>}
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge>{s.language}</Badge>
                      {s.category && <Badge tone="neutral">{s.category.replace('_', ' ')}</Badge>}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {matchedProjects.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
              Projects ({matchedProjects.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {matchedProjects.map((p) => (
                <Card key={p.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <FolderGit2 size={14} className="text-accent-primary" />
                    <h3 className="font-display font-semibold text-sm truncate">{p.name}</h3>
                  </div>
                  {p.description && <p className="text-xs text-text-muted line-clamp-2">{p.description}</p>}
                  <Badge tone="neutral" className="mt-2">
                    {p.status}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
