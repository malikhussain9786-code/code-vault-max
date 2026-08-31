import { useState } from 'react';
import {
  Wand2,
  FileText,
  MessageCircleQuestion,
  Loader2,
  Check,
  X,
  Sparkles,
  Search,
  AlertTriangle,
  CheckCircle2,
  PencilLine,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAi } from '@/hooks/useAi';

interface AiToolsPanelProps {
  language: string;
  code: string;
  onApplyCode: (code: string) => void;
}

/**
 * All analysis here reads the code directly — there is no code execution in this build,
 * so "Find Errors" and "Fix" are the AI's best read of the code, the same as pasting it
 * into a chat AI, not a confirmed compiler/runtime result. Stated in the UI, not hidden.
 */
export function AiToolsPanel({ language, code, onApplyCode }: AiToolsPanelProps) {
  const {
    generate,
    generating,
    generateUnavailable,
    explain,
    explanation,
    explaining,
    explainUnavailable,
    findErrors,
    findingErrors,
    foundErrors,
    findErrorsUnavailable,
    fix,
    fixing,
    fixUnavailable,
    improve,
    improving,
    improveResult,
    improveUnavailable,
    document: documentCode,
    documenting,
    documentResult,
    documentUnavailable,
    ask,
    asking,
    answer,
    askUnavailable,
  } = useAi();

  const [askOpen, setAskOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [fixResult, setFixResult] = useState<{ fixedCode: string; explanation: string } | null>(null);

  const [generateOpen, setGenerateOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generateResult, setGenerateResult] = useState<{ code: string; explanation: string } | null>(null);

  // Each result panel can be individually closed, independent of the underlying data —
  // so a long code block isn't stuck being partly covered by a result you're done reading.
  // Re-running that same action clears its own dismissal (a fresh result should show again).
  const [dismissed, setDismissed] = useState({
    explain: false,
    findErrors: false,
    fix: false,
    improve: false,
    document: false,
    generate: false,
  });

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setDismissed((d) => ({ ...d, generate: false }));
    setGenerateResult(null);
    const result = await generate(language, prompt);
    if (result) setGenerateResult(result);
  }

  async function handleExplain() {
    setDismissed((d) => ({ ...d, explain: false }));
    await explain(language, code);
  }

  async function handleFindErrors() {
    setDismissed((d) => ({ ...d, findErrors: false }));
    await findErrors(language, code);
  }

  async function handleFix() {
    setDismissed((d) => ({ ...d, fix: false }));
    setFixResult(null);
    const result = await fix(language, code);
    if (result) setFixResult(result);
  }

  async function handleImprove() {
    setDismissed((d) => ({ ...d, improve: false }));
    await improve(language, code);
  }

  async function handleDocument() {
    setDismissed((d) => ({ ...d, document: false }));
    await documentCode(language, code);
  }

  async function handleAsk() {
    if (!question.trim()) return;
    await ask(question, language, code);
  }

  const disabled = !code.trim();

  return (
    <div className="p-5 border-t border-border-subtle font-body bg-gradient-to-b from-accent-primary/[0.03] to-transparent">
      <div className="flex items-center gap-2 mb-3.5">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-[0_0_12px_rgba(124,92,255,0.4)]">
          <Sparkles size={13} className="text-white" />
        </div>
        <span className="text-xs font-semibold tracking-wide uppercase text-text-muted">AI Assistant</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          onClick={() => setGenerateOpen((v) => !v)}
          className="shadow-[0_2px_16px_rgba(124,92,255,0.35)] hover:shadow-[0_2px_24px_rgba(124,92,255,0.5)]"
        >
          <PencilLine size={14} />
          Write with AI
        </Button>

        <div className="w-px h-6 bg-border-subtle mx-1" />

        <ToolButton icon={Sparkles} label="Explain" onClick={handleExplain} loading={explaining} disabled={disabled} tint="primary" />
        <ToolButton icon={Search} label="Find Errors" onClick={handleFindErrors} loading={findingErrors} disabled={disabled} tint="warning" />
        <ToolButton icon={Wand2} label="Fix" onClick={handleFix} loading={fixing} disabled={disabled} tint="danger" />
        <ToolButton icon={Wand2} label="Improve" onClick={handleImprove} loading={improving} disabled={disabled} tint="secondary" />
        <ToolButton icon={FileText} label="Document" onClick={handleDocument} loading={documenting} disabled={disabled} tint="neutral" />
        <ToolButton icon={MessageCircleQuestion} label="Ask AI" onClick={() => setAskOpen((v) => !v)} tint="neutral" />
      </div>

      {(explainUnavailable || findErrorsUnavailable || fixUnavailable || improveUnavailable || documentUnavailable) && (
        <p className="mt-3 text-xs text-text-muted italic">
          {explainUnavailable || findErrorsUnavailable || fixUnavailable || improveUnavailable || documentUnavailable}
        </p>
      )}

      {generateOpen && (
        <div className="mt-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want built — a single function, or a full program. As short or as detailed as you like."
            rows={4}
            className="w-full bg-bg-elevated border border-border-subtle rounded-control px-3.5 py-3 text-sm text-text-primary placeholder:text-text-muted resize-y focus:outline-none focus:ring-2 focus:ring-accent-primary/40 focus:border-accent-primary/50 transition-all"
          />
          <div className="mt-2.5 flex gap-2">
            <Button onClick={handleGenerate} disabled={generating || !prompt.trim()}>
              {generating ? <Loader2 size={14} className="animate-spin" /> : <PencilLine size={14} />}
              {generating ? 'Writing…' : 'Generate'}
            </Button>
            <Button variant="ghost" onClick={() => setGenerateOpen(false)}>
              <X size={14} />
            </Button>
          </div>
          {generateUnavailable && <p className="mt-2 text-xs text-text-muted italic">{generateUnavailable}</p>}

          {generateResult && !dismissed.generate && (
            <ResultPanel accent="primary" onClose={() => setDismissed((d) => ({ ...d, generate: true }))}>
              <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed pr-5">{generateResult.explanation}</p>
              <Button
                size="sm"
                className="mt-3"
                onClick={() => {
                  onApplyCode(generateResult.code);
                  setGenerateOpen(false);
                }}
              >
                <Check size={13} />
                Insert into editor
              </Button>
            </ResultPanel>
          )}
        </div>
      )}

      {explanation && !dismissed.explain && (
        <ResultPanel accent="primary" onClose={() => setDismissed((d) => ({ ...d, explain: true }))}>
          <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed pr-5">{explanation}</p>
        </ResultPanel>
      )}

      {foundErrors && !dismissed.findErrors && (
        <ResultPanel
          accent={foundErrors.hasIssues ? 'danger' : 'secondary'}
          onClose={() => setDismissed((d) => ({ ...d, findErrors: true }))}
        >
          <div className="flex items-center gap-1.5 mb-2">
            {foundErrors.hasIssues ? (
              <AlertTriangle size={14} className="text-accent-danger shrink-0" />
            ) : (
              <CheckCircle2 size={14} className="text-accent-secondary shrink-0" />
            )}
            <span className={`text-xs font-semibold ${foundErrors.hasIssues ? 'text-accent-danger' : 'text-accent-secondary'}`}>
              {foundErrors.hasIssues ? 'AI found potential issues (unconfirmed — code was not run)' : 'AI found no obvious issues'}
            </span>
          </div>
          <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed pr-5">{foundErrors.explanation}</p>
        </ResultPanel>
      )}

      {fixResult && !dismissed.fix && (
        <ResultPanel accent="danger" onClose={() => setDismissed((d) => ({ ...d, fix: true }))}>
          <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed pr-5">{fixResult.explanation}</p>
          <Button size="sm" className="mt-3" onClick={() => onApplyCode(fixResult.fixedCode)}>
            <Check size={13} />
            Apply fix
          </Button>
        </ResultPanel>
      )}

      {improveResult && !dismissed.improve && (
        <ResultPanel accent="secondary" onClose={() => setDismissed((d) => ({ ...d, improve: true }))}>
          <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed pr-5">{improveResult.explanation}</p>
          <Button size="sm" className="mt-3" onClick={() => onApplyCode(improveResult.improvedCode)}>
            <Check size={13} />
            Apply improved code
          </Button>
        </ResultPanel>
      )}

      {documentResult && !dismissed.document && (
        <ResultPanel accent="neutral" onClose={() => setDismissed((d) => ({ ...d, document: true }))}>
          <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed pr-5">{documentResult.readme}</p>
          <Button size="sm" className="mt-3" onClick={() => onApplyCode(documentResult.documentedCode)}>
            <Check size={13} />
            Apply documented code
          </Button>
        </ResultPanel>
      )}

      {askOpen && (
        <div className="mt-4">
          <div className="flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Ask about this code or a programming concept…"
              className="flex-1 bg-bg-elevated border border-border-subtle rounded-control px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/40 focus:border-accent-primary/50 transition-all"
            />
            <Button onClick={handleAsk} disabled={asking}>
              {asking ? <Loader2 size={14} className="animate-spin" /> : 'Ask'}
            </Button>
            <Button variant="ghost" onClick={() => setAskOpen(false)}>
              <X size={14} />
            </Button>
          </div>
          {askUnavailable && <p className="mt-2 text-xs text-text-muted italic">{askUnavailable}</p>}
          {answer && (
            <ResultPanel accent="primary" onClose={() => setAskOpen(false)}>
              <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed pr-5">{answer}</p>
            </ResultPanel>
          )}
        </div>
      )}
    </div>
  );
}

type Tint = 'primary' | 'secondary' | 'warning' | 'danger' | 'neutral';

const tintStyles: Record<Tint, string> = {
  primary: 'hover:bg-accent-primary/10 hover:border-accent-primary/40 hover:text-accent-primary',
  secondary: 'hover:bg-accent-secondary/10 hover:border-accent-secondary/40 hover:text-accent-secondary',
  warning: 'hover:bg-accent-warning/10 hover:border-accent-warning/40 hover:text-accent-warning',
  danger: 'hover:bg-accent-danger/10 hover:border-accent-danger/40 hover:text-accent-danger',
  neutral: 'hover:bg-bg-elevated hover:border-border-subtle',
};

/** A secondary AI action button — each gets its own subtle hover tint so the toolbar has real visual variety instead of one flat gray row. */
function ToolButton({
  icon: Icon,
  label,
  onClick,
  loading,
  disabled,
  tint,
}: {
  icon: typeof Sparkles;
  label: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  tint: Tint;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-control text-sm font-medium border border-transparent text-text-primary bg-bg-elevated/50 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none ${tintStyles[tint]}`}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Icon size={14} />}
      {label}
    </button>
  );
}

const resultAccentStyles: Record<Tint, string> = {
  primary: 'border-l-accent-primary bg-accent-primary/[0.06]',
  secondary: 'border-l-accent-secondary bg-accent-secondary/[0.06]',
  warning: 'border-l-accent-warning bg-accent-warning/[0.06]',
  danger: 'border-l-accent-danger bg-accent-danger/[0.06]',
  neutral: 'border-l-border-subtle bg-bg-elevated',
};

/** A result card with a colored left accent bar — gives each AI response a clear, distinct visual identity instead of a uniform gray box. */
function ResultPanel({
  accent,
  onClose,
  children,
}: {
  accent: Tint;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`mt-3 rounded-control border-l-[3px] border border-border-subtle p-4 relative ${resultAccentStyles[accent]}`}>
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-text-muted hover:text-text-primary transition-colors"
        aria-label="Close"
      >
        <X size={14} />
      </button>
      {children}
    </div>
  );
}
