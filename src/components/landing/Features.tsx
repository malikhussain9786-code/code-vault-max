import type { LucideIcon } from 'lucide-react';
import { Code2, Sparkles, FolderGit2, Search, Layers, ShieldCheck } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Code2,
    title: 'Real code editor',
    description:
      'A full-featured editor with real syntax highlighting for Python, JavaScript, TypeScript, Java, C, C++, C#, Go, PHP, Ruby, SQL, and Bash.',
  },
  {
    icon: Sparkles,
    title: 'AI-powered code review',
    description:
      'AI reads your code closely — explains it, points out likely bugs, and proposes fixes you can apply directly. An honest static review, not a black box.',
  },
  {
    icon: FolderGit2,
    title: 'Snippet vault',
    description:
      'Save, tag, and categorize reusable code across Frontend, Backend, Database, APIs, Algorithms, and more — searchable the moment you need it again.',
  },
  {
    icon: Layers,
    title: 'Project organization',
    description:
      'Group snippets and files under real projects with tech stack tags and status tracking, from Planning through Completed.',
  },
  {
    icon: Search,
    title: 'Instant search',
    description:
      'Find any snippet or project instantly — filter by language, category, or tag as you type.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by default',
    description:
      'Every snippet and project is isolated to your account — nothing is shared unless you explicitly make it public.',
  },
];

export function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
      <div className="max-w-2xl">
        <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-text-primary">
          Everything a developer workspace should do
        </h2>
        <p className="mt-4 text-lg text-text-muted">
          Built around one idea: your code, organized and reviewed by an AI that explains its reasoning —
          not a guessing black box.
        </p>
      </div>

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-control bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <feature.icon size={18} className="text-white" />
            </div>
            <div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
