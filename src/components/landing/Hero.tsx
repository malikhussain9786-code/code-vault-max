import { Sparkles, Search, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

/**
 * The signature element for this hero is a mock editor card showing the product's
 * real differentiator — pasted code, AI reading it closely, and a clear fix — rather
 * than a generic "dashboard screenshot" or a stat-callout.
 */
function MockEditorCard() {
  return (
    <div className="rounded-card border border-border-subtle bg-bg-surface shadow-[0_20px_60px_rgba(124,92,255,0.15)] overflow-hidden w-full max-w-md">
      {/* window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border-subtle bg-bg-elevated">
        <span className="w-2.5 h-2.5 rounded-full bg-accent-danger/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-accent-warning/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-accent-secondary/70" />
        <span className="ml-3 text-xs text-text-muted font-mono">divide.py</span>
      </div>

      <div className="p-4 font-mono text-[13px] leading-6">
        <p className="text-text-muted">
          <span className="text-code-keyword">def</span> <span className="text-text-primary">safe_divide</span>(a, b):
        </p>
        <p className="pl-4 text-text-primary">
          <span className="text-code-keyword">return</span> a / b
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-accent-primary text-xs font-body font-medium">
          <Search size={13} />
          AI found a likely issue
        </div>
        <div className="mt-1 flex items-start gap-2 rounded-control bg-accent-danger/10 border border-accent-danger/30 px-3 py-2">
          <span className="text-accent-danger text-xs">Line 2: no check for b == 0 — will crash on division by zero</span>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-accent-primary text-xs font-body font-medium">
          <Sparkles size={13} />
          AI proposed a fix
        </div>

        <p className="mt-2 text-text-muted">
          <span className="text-code-keyword">def</span> <span className="text-text-primary">safe_divide</span>(a, b):
        </p>
        <p className="pl-4 text-text-primary">
          <span className="text-code-keyword">if</span> b == 0: <span className="text-code-keyword">return</span> <span className="text-accent-secondary">None</span>
        </p>
        <p className="pl-4 text-text-primary">
          <span className="text-code-keyword">return</span> a / b
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-accent-secondary text-xs font-body font-medium">
          <CheckCircle2 size={13} />
          Fix applied
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="font-display font-bold text-4xl sm:text-5xl leading-[1.1] tracking-tight text-text-primary">
          Write code, and let{' '}
          <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
            AI catch what you missed
          </span>
        </h1>
        <p className="mt-6 text-lg text-text-muted max-w-lg">
          Code Vault Max is a developer workspace where you write and save code, and an AI assistant reads
          it closely — explaining it, spotting likely bugs, and proposing real fixes you can apply directly.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link to="/signup">
            <Button size="lg">
              <Sparkles size={16} />
              Start for free
            </Button>
          </Link>
          <a href="#features">
            <Button variant="ghost" size="lg">
              See how it works
            </Button>
          </a>
        </div>
        <p className="mt-6 text-sm text-text-muted">No credit card required · AI-powered code review</p>
      </div>

      <div className="flex justify-center lg:justify-end">
        <MockEditorCard />
      </div>
    </section>
  );
}
