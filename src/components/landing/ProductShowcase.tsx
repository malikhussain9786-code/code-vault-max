import { useState } from 'react';
import { LayoutDashboard, Code2, FolderKanban } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

type Tab = 'dashboard' | 'editor' | 'projects';

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'editor', label: 'Code Editor', icon: Code2 },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
];

function DashboardPreview() {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {[
        { label: 'Snippets saved', value: '128' },
        { label: 'Projects', value: '12' },
        { label: 'AI reviews this week', value: '43' },
      ].map((stat) => (
        <div key={stat.label} className="rounded-control bg-bg-elevated border border-border-subtle p-4">
          <p className="text-2xl font-display font-semibold text-text-primary">{stat.value}</p>
          <p className="text-xs text-text-muted mt-1">{stat.label}</p>
        </div>
      ))}
      <div className="sm:col-span-3 rounded-control bg-bg-elevated border border-border-subtle p-4">
        <p className="text-sm font-medium text-text-primary mb-3">Language usage</p>
        <div className="flex items-end gap-2 h-16">
          {[70, 45, 90, 30, 55].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-accent-primary to-accent-secondary"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EditorPreview() {
  return (
    <div className="rounded-control bg-bg-elevated border border-border-subtle overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border-subtle text-xs text-text-muted font-mono">
        <span>fetchUser.ts</span>
        <Badge tone="neutral" className="ml-auto">TypeScript</Badge>
      </div>
      <div className="p-4 font-mono text-[13px] leading-6">
        <p><span className="text-code-keyword">async function</span> <span className="text-text-primary">fetchUser</span>(id: <span className="text-accent-secondary">string</span>) {'{'}</p>
        <p className="pl-4 text-text-primary"><span className="text-code-keyword">const</span> res = <span className="text-code-keyword">await</span> fetch(`/api/users/${'{'}id{'}'}`);</p>
        <p className="pl-4 text-text-primary"><span className="text-code-keyword">return</span> res.json();</p>
        <p>{'}'}</p>
      </div>
    </div>
  );
}

function ProjectsPreview() {
  const projects = [
    { name: 'Realtime Chat API', status: 'Development', tone: 'warning' as const },
    { name: 'Portfolio Site', status: 'Completed', tone: 'success' as const },
    { name: 'Auth Microservice', status: 'Planning', tone: 'neutral' as const },
  ];
  return (
    <div className="flex flex-col gap-3">
      {projects.map((p) => (
        <div
          key={p.name}
          className="flex items-center justify-between rounded-control bg-bg-elevated border border-border-subtle px-4 py-3"
        >
          <span className="text-sm font-medium text-text-primary">{p.name}</span>
          <Badge tone={p.tone}>{p.status}</Badge>
        </div>
      ))}
    </div>
  );
}

export function ProductShowcase() {
  const [active, setActive] = useState<Tab>('dashboard');

  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-text-primary">
          One workspace, everything in view
        </h2>
        <p className="mt-4 text-lg text-text-muted">
          A preview of the workspace you'll build in — full versions ship as we go.
        </p>
      </div>

      <div className="mt-10 flex justify-center gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-control text-sm font-medium transition-colors duration-150 ${
              active === tab.id
                ? 'bg-accent-primary text-white'
                : 'bg-bg-surface border border-border-subtle text-text-muted hover:text-text-primary'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="mt-6 max-w-3xl mx-auto">
        {active === 'dashboard' && <DashboardPreview />}
        {active === 'editor' && <EditorPreview />}
        {active === 'projects' && <ProjectsPreview />}
      </Card>
    </section>
  );
}
