import { useState } from 'react';
import { Plus, Trash2, Pencil, FolderGit2 } from 'lucide-react';
import { useProjects, type Project } from '@/hooks/useProjects';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProjectModal } from '@/components/dashboard/ProjectModal';

const STATUS_TONE: Record<Project['status'], 'neutral' | 'warning' | 'success'> = {
  planning: 'neutral',
  development: 'warning',
  completed: 'success',
};

function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function handleDeleteClick() {
    if (confirmingDelete) {
      onDelete();
    } else {
      setConfirmingDelete(true);
      setTimeout(() => setConfirmingDelete(false), 3000);
    }
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-text-primary truncate">{project.name}</h3>
          {project.description && <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{project.description}</p>}
        </div>
        <Badge tone={STATUS_TONE[project.status]}>{project.status}</Badge>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.tech_stack.map((tech) => (
          <Badge key={tech} tone="neutral">
            {tech}
          </Badge>
        ))}
      </div>

      <p className="text-xs text-text-muted flex items-center gap-1.5">
        <FolderGit2 size={13} />
        {project.snippet_count} {project.snippet_count === 1 ? 'snippet' : 'snippets'}
      </p>

      <div className="flex items-center gap-1 mt-auto pt-2 border-t border-border-subtle">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary px-2 py-1.5 rounded-control hover:bg-bg-elevated transition-colors"
        >
          <Pencil size={13} />
          Edit
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

export function ProjectsPage() {
  const { projects, loading, error, createProject, updateProject, deleteProject } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  function openCreateModal() {
    setEditingProject(null);
    setModalOpen(true);
  }

  function openEditModal(project: Project) {
    setEditingProject(project);
    setModalOpen(true);
  }

  async function handleSave(data: { name: string; description?: string; techStack: string[]; status: Project['status'] }) {
    setSaving(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);
      } else {
        await createProject(data);
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl tracking-tight">Projects</h1>
          <p className="text-text-muted mt-1 text-sm">Group snippets under real projects.</p>
        </div>
        <Button size="sm" onClick={openCreateModal}>
          <Plus size={15} />
          New project
        </Button>
      </div>

      <div className="mt-6">
        {loading && <p className="text-sm text-text-muted">Loading…</p>}
        {error && <p className="text-sm text-accent-danger">{error}</p>}

        {!loading && !error && projects.length === 0 && (
          <Card>
            <p className="text-sm text-text-muted">
              No projects yet — create one to start grouping related snippets together.
            </p>
          </Card>
        )}

        {!loading && projects.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => openEditModal(project)}
                onDelete={() => deleteProject(project.id)}
              />
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <ProjectModal
          initial={editingProject ?? undefined}
          saving={saving}
          onCancel={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
