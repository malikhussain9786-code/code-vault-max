import { Zap, BookOpen, TrendingUp, Boxes } from 'lucide-react';

const BENEFITS = [
  {
    icon: Zap,
    title: 'Ship faster',
    description: 'Write code and get a second pair of eyes on it instantly — no waiting for a teammate to be free for a quick review.',
  },
  {
    icon: Boxes,
    title: 'Never lose a solution twice',
    description: 'That regex you finally got right, that auth middleware pattern — tagged, categorized, and searchable the next time you need it.',
  },
  {
    icon: BookOpen,
    title: 'Debug with a second opinion',
    description: 'AI reads your code carefully and explains what looks off in plain language, with a proposed fix you can apply directly.',
  },
  {
    icon: TrendingUp,
    title: 'Build a visible track record',
    description: "Your snippet library and project log double as a running record of what you've built — useful for standups, reviews, or your own portfolio.",
  },
];

export function Benefits() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 lg:py-28 border-t border-border-subtle">
      <div className="max-w-2xl">
        <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-text-primary">
          What this actually changes about your day
        </h2>
      </div>

      <div className="mt-12 grid sm:grid-cols-2 gap-x-10 gap-y-10">
        {BENEFITS.map((b) => (
          <div key={b.title} className="flex gap-4">
            <div className="w-10 h-10 shrink-0 rounded-control bg-bg-elevated border border-border-subtle flex items-center justify-center">
              <b.icon size={18} className="text-accent-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-text-primary">{b.title}</h3>
              <p className="mt-1.5 text-sm text-text-muted leading-relaxed">{b.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
