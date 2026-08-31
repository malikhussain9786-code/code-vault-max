import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'neutral' | 'success' | 'warning' | 'danger';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const toneStyles: Record<Tone, string> = {
  neutral: 'bg-bg-elevated text-text-muted border-border-subtle',
  success: 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/30',
  warning: 'bg-accent-warning/10 text-accent-warning border-accent-warning/30',
  danger: 'bg-accent-danger/10 text-accent-danger border-accent-danger/30',
};

/** Small pill used for language tags, category labels, and status indicators (e.g. "Python", "Completed"). */
export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border font-body',
        toneStyles[tone],
        className
      )}
      {...props}
    />
  );
}
