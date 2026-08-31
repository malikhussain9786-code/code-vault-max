import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/**
 * Base surface for grouped content — snippet cards, dashboard stat blocks, project tiles.
 * Generous padding by default (24px+) is a deliberate design-system rule, not a default:
 * whitespace is the luxury signal here, so don't shrink padding to fit more content in.
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-bg-surface border border-border-subtle rounded-card p-6',
        'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-display font-semibold text-lg text-text-primary tracking-tight', className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-text-muted mt-1', className)} {...props} />;
}
