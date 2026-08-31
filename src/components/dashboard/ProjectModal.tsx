import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Project } from '@/hooks/useProjects';

interface ProjectModalProps {
  initial?: Partial<Project>;
  saving: boolean;
  onCancel: () => void;
  onSave: (data: { name: string; description?: string; techStack: string[]; status: Project['status'] }) => void;
}

export function ProjectModal({ initial, saving, onCancel, onSave }: ProjectModalProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [techStackInput, setTechStackInput] = useState((initial?.tech_stack ?? []).join(', '));
  const [status, setStatus] = useState<Project['status']>(initial?.status ?? 'planning');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const techStack = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ name: name.trim(), description: description.trim() || undefined, techStack, status });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-bg-surface border border-border-subtle rounded-card p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg">{initial?.name ? 'Edit project' : 'New project'}</h2>
          <button onClick={onCancel} aria-label="Close">
            <X size={18} className="text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Realtime Chat API" required />
          <Input
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this project?"
          />
          <Input
            label="Tech stack (comma-separated)"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            placeholder="Node.js, Socket.io, Redis"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Project['status'])}
              className="bg-bg-elevated border border-border-subtle rounded-control px-3.5 py-2.5 text-sm text-text-primary"
            >
              <option value="planning">Planning</option>
              <option value="development">Development</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex gap-2 mt-1">
            <Button type="submit" disabled={saving || !name.trim()} className="flex-1">
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
