import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Copy, Maximize2, Minimize2, Check, Save } from 'lucide-react';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { AiToolsPanel } from '@/components/editor/AiToolsPanel';
import { SaveSnippetModal } from '@/components/editor/SaveSnippetModal';
import { Button } from '@/components/ui/Button';
import { LANGUAGES } from '@/lib/languages';
import { useDebouncedEffect } from '@/hooks/useDebouncedEffect';
import { useSnippets, type Snippet } from '@/hooks/useSnippets';
import { useAuthStore } from '@/store/authStore';
import * as snippetStorage from '@/lib/snippets/storage';

const DRAFT_STORAGE_KEY = 'cvp-editor-draft';

interface Draft {
  languageValue: string;
  code: string;
}

function loadDraft(): Draft {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupt or missing draft — fall through to default
  }
  return { languageValue: 'python', code: LANGUAGES[0].defaultCode };
}

export function EditorPage() {
  const [searchParams] = useSearchParams();
  const snippetId = searchParams.get('snippetId');

  const [draft, setDraft] = useState<Draft>(loadDraft);
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [currentSnippet, setCurrentSnippet] = useState<Snippet | null>(null);
  const [loadingSnippet, setLoadingSnippet] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [savingSnippet, setSavingSnippet] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { createSnippet, updateSnippet } = useSnippets();
  const userId = useAuthStore((s) => s.user?.id);

  // Loading an existing snippet by id (via "Edit" from the Snippets list) takes priority
  // over the local draft — this is an intentional edit session, not a fresh draft.
  useEffect(() => {
    if (!snippetId || !userId) return;
    setLoadingSnippet(true);
    const stored = snippetStorage.getSnippetById(userId, snippetId);
    if (stored) {
      setCurrentSnippet({
        id: stored.id,
        title: stored.title,
        description: stored.description,
        code: stored.code,
        language: stored.language,
        category: stored.category,
        is_favorite: stored.isFavorite,
        tags: stored.tags,
        project_id: stored.projectId,
        created_at: stored.createdAt,
        updated_at: stored.updatedAt,
      });
      setDraft({ languageValue: stored.language, code: stored.code });
    }
    // Snippet not found — falls through silently to the local draft rather than
    // blocking the editor from being usable.
    setLoadingSnippet(false);
  }, [snippetId, userId]);

  async function handleSaveSnippet(data: { title: string; description?: string; category?: string; tags: string[] }) {
    setSavingSnippet(true);
    try {
      if (currentSnippet) {
        const updated = await updateSnippet(currentSnippet.id, {
          title: data.title,
          description: data.description,
          category: data.category as Snippet['category'],
          tags: data.tags,
          code: draft.code,
          language: draft.languageValue,
        });
        setCurrentSnippet(updated);
      } else {
        const created = await createSnippet({
          title: data.title,
          description: data.description,
          category: data.category,
          tags: data.tags,
          code: draft.code,
          language: draft.languageValue,
        });
        setCurrentSnippet(created);
      }
      setSaveModalOpen(false);
    } finally {
      setSavingSnippet(false);
    }
  }

  const activeLanguage = LANGUAGES.find((l) => l.value === draft.languageValue) ?? LANGUAGES[0];

  // Auto-save the draft locally, debounced so it doesn't write on every keystroke.
  useDebouncedEffect(
    () => {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      setSavedAt(new Date());
    },
    [draft],
    800
  );

  function handleLanguageChange(value: string) {
    const lang = LANGUAGES.find((l) => l.value === value)!;
    setDraft({ languageValue: value, code: lang.defaultCode });
  }

  function handleCodeChange(code: string) {
    setDraft((d) => ({ ...d, code }));
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(draft.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // Escape key exits fullscreen — expected behavior, not optional polish.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && fullscreen) setFullscreen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [fullscreen]);

  return (
    <div
      ref={containerRef}
      className={
        fullscreen
          ? 'fixed inset-0 z-50 bg-bg-primary flex flex-col'
          : 'p-6 lg:p-8 h-[calc(100vh-4rem)] flex flex-col'
      }
    >
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div>
          <h1 className="font-display font-bold text-2xl tracking-tight">
            {currentSnippet ? currentSnippet.title : 'Editor'}
          </h1>
          <p className="text-text-muted mt-1 text-sm">
            {savedAt
              ? `Draft saved locally at ${savedAt.toLocaleTimeString()}`
              : 'Your draft auto-saves as you type'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={draft.languageValue}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-bg-elevated border border-border-subtle rounded-control px-3 py-2 text-sm text-text-primary"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <Button variant="ghost" size="sm" onClick={handleCopy} title="Copy code">
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFullscreen((v) => !v)}
            title={fullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
          >
            {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </Button>

          <Button size="sm" onClick={() => setSaveModalOpen(true)} title="Save as snippet">
            <Save size={15} />
            {currentSnippet ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>

      {loadingSnippet && <p className="text-xs text-text-muted mb-2">Loading snippet…</p>}

      <div className="flex-1 rounded-card border border-border-subtle overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 min-h-0">
          <CodeEditor value={draft.code} onChange={handleCodeChange} language={activeLanguage.monacoId} />
        </div>
        <div className="border-t border-border-subtle bg-bg-surface max-h-72 overflow-y-auto shrink-0">
          <AiToolsPanel
            language={draft.languageValue}
            code={draft.code}
            onApplyCode={(newCode) => setDraft((d) => ({ ...d, code: newCode }))}
          />
        </div>
      </div>

      {saveModalOpen && (
        <SaveSnippetModal
          initialTitle={currentSnippet?.title}
          initialDescription={currentSnippet?.description ?? undefined}
          initialCategory={currentSnippet?.category ?? undefined}
          initialTags={currentSnippet?.tags}
          saving={savingSnippet}
          onCancel={() => setSaveModalOpen(false)}
          onSave={handleSaveSnippet}
        />
      )}
    </div>
  );
}
