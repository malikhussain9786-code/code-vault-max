import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const CATEGORIES = ['frontend', 'backend', 'database', 'apis', 'algorithms', 'ui_components', 'utilities', 'security'];

interface SaveSnippetModalProps {
  initialTitle?: string;
  initialDescription?: string;
  initialCategory?: string;
  initialTags?: string[];
  saving: boolean;
  onCancel: () => void;
  onSave: (data: { title: string; description?: string; category?: string; tags: string[] }) => void;
}

export function SaveSnippetModal({
  initialTitle = '',
  initialDescription = '',
  initialCategory = '',
  initialTags = [],
  saving,
  onCancel,
  onSave,
}: SaveSnippetModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState(initialCategory);
  const [tagsInput, setTagsInput] = useState(initialTags.join(', '));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ title: title.trim(), description: description.trim() || undefined, category: category || undefined, tags });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-bg-surface border border-border-subtle rounded-card p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg">Save snippet</h2>
          <button onClick={onCancel} aria-label="Close">
            <X size={18} className="text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Debounce hook" required />
          <Input
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this snippet do?"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Category (optional)</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-bg-elevated border border-border-subtle rounded-control px-3.5 py-2.5 text-sm text-text-primary"
            >
              <option value="">None</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Tags (comma-separated, optional)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="react-hooks, performance"
          />
          <div className="flex gap-2 mt-1">
            <Button type="submit" disabled={saving || !title.trim()} className="flex-1">
              {saving ? 'Saving…' : 'Save'}
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
