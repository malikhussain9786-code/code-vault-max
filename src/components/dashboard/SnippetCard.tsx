import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Copy, Trash2, Pencil } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Snippet } from '@/hooks/useSnippets';

interface SnippetCardProps {
  snippet: Snippet;
  onToggleFavorite: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SnippetCard({ snippet, onToggleFavorite, onDuplicate, onDelete }: SnippetCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function handleDeleteClick() {
    if (confirmingDelete) {
      onDelete(snippet.id);
    } else {
      setConfirmingDelete(true);
      setTimeout(() => setConfirmingDelete(false), 3000);
    }
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-text-primary truncate">{snippet.title}</h3>
          {snippet.description && (
            <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{snippet.description}</p>
          )}
        </div>
        <button
          onClick={() => onToggleFavorite(snippet.id)}
          aria-label={snippet.is_favorite ? 'Unfavorite' : 'Favorite'}
          className="shrink-0 text-text-muted hover:text-accent-warning transition-colors"
        >
          <Star size={16} fill={snippet.is_favorite ? 'currentColor' : 'none'} className={snippet.is_favorite ? 'text-accent-warning' : ''} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge>{snippet.language}</Badge>
        {snippet.category && <Badge tone="neutral">{snippet.category.replace('_', ' ')}</Badge>}
        {snippet.tags.map((tag) => (
          <Badge key={tag} tone="neutral">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-1 mt-auto pt-2 border-t border-border-subtle">
        <Link
          to={`/dashboard/editor?snippetId=${snippet.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary px-2 py-1.5 rounded-control hover:bg-bg-elevated transition-colors"
        >
          <Pencil size={13} />
          Edit
        </Link>
        <button
          onClick={() => onDuplicate(snippet.id)}
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary px-2 py-1.5 rounded-control hover:bg-bg-elevated transition-colors"
        >
          <Copy size={13} />
          Duplicate
        </button>
        <button
          onClick={handleDeleteClick}
          className={`ml-auto inline-flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-control transition-colors ${
            confirmingDelete ? 'text-white bg-accent-danger' : 'text-text-muted hover:text-accent-danger hover:bg-bg-elevated'
          }`}
        >
          <Trash2 size={13} />
          {confirmingDelete ? 'Confirm?' : 'Delete'}
        </button>
      </div>
    </Card>
  );
}
