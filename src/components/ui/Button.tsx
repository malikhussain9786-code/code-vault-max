import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-sm hover:brightness-110 active:brightness-95',
  ghost:
    'bg-transparent border border-border-subtle text-text-primary hover:bg-bg-elevated',
  danger:
    'bg-accent-danger text-white hover:brightness-110 active:brightness-95',
};

const sizeStyles: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 rounded-control',
  md: 'text-sm px-4 py-2.5 rounded-control',
  lg: 'text-base px-6 py-3 rounded-control',
};

/**
 * Primary interactive control for the whole app. Every clickable action
 * (Run code, Save snippet, Sign up, etc.) should use this rather than a raw <button>,
 * so hover/focus/disabled states stay consistent everywhere.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium font-body transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
