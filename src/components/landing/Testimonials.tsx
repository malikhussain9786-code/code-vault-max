import { Card } from '@/components/ui/Card';

const TESTIMONIALS = [
  {
    quote:
      "I stopped keeping a personal folder of \"useful snippets I'll forget about\" and just started saving them here instead. The search actually finds things.",
    name: 'Priya Nandakumar',
    role: 'Backend Engineer',
  },
  {
    quote:
      "The AI actually tells me which line it thinks is wrong and why, not just a vague \"this might be broken.\" That specificity is what got me to trust it.",
    name: 'Marcus Ferreira',
    role: 'Full-Stack Developer',
  },
  {
    quote:
      "I paste a function in, click Find Errors, and it reads through the logic like a real reviewer would — catches things I'd have missed until code review.",
    name: 'Aisha Rahman',
    role: 'Software Engineering Intern',
  },
];

export function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 lg:py-28 border-t border-border-subtle">
      <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-text-primary text-center">
        Built for developers, judged by developers
      </h2>

      <div className="mt-12 grid md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t) => (
          <Card key={t.name} className="flex flex-col justify-between">
            <p className="text-text-primary leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-6 pt-4 border-t border-border-subtle">
              <p className="text-sm font-medium text-text-primary">{t.name}</p>
              <p className="text-xs text-text-muted">{t.role}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
