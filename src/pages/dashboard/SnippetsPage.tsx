import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star } from 'lucide-react';
import { useSnippets } from '@/hooks/useSnippets';
import { SnippetCard } from '@/components/dashboard/SnippetCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const LANGUAGES = ['python', 'javascript', 'typescript', 'java', 'c', 'cpp', 'csharp', 'go', 'php', 'ruby', 'sql', 'bash'];

export function SnippetsPage() {
  const { snippets, loading, error, deleteSnippet, duplicateSnippet, toggleFavorite } = useSnippets();
  const [languageFilter, setLanguageFilter] = useState('');
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  const filtered = snippets.filter((s) => {
    if (languageFilter && s.language !== languageFilter) return false;
    if (favoriteOnly && !s.is_favorite) return false;
    return true;
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl tracking-tight">Snippets</h1>
          <p className="text-text-muted mt-1 text-sm">Your saved, reusable code.</p>
        </div>
        <Link to="/dashboard/editor">
          <Button size="sm">
            <Plus size={15} />
            New snippet
          </Button>
        </Link>
      </div>

      <div className="mt-5 flex items-center gap-2 flex-wrap">
        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="bg-bg-elevated border border-border-subtle rounded-control px-3 py-2 text-sm text-text-primary"
        >
          <option value="">All languages</option>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <button
          onClick={() => setFavoriteOnly((v) => !v)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-control text-sm border transition-colors ${
            favoriteOnly
              ? 'bg-accent-warning/10 border-accent-warning/30 text-accent-warning'
              : 'bg-bg-elevated border-border-subtle text-text-muted'
          }`}
        >
          <Star size={14} fill={favoriteOnly ? 'currentColor' : 'none'} />
          Favorites
        </button>
      </div>

      <div className="mt-6">
        {loading && <p className="text-sm text-text-muted">Loading…</p>}
        {error && <p className="text-sm text-accent-danger">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <Card>
            <p className="text-sm text-text-muted">
              {snippets.length === 0
                ? 'No snippets yet — write some code in the Editor and save it here.'
                : 'No snippets match these filters.'}
            </p>
          </Card>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                onToggleFavorite={toggleFavorite}
                onDuplicate={duplicateSnippet}
                onDelete={deleteSnippet}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
