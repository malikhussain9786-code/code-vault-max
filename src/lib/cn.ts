type ClassValue = string | number | null | boolean | undefined;

/**
 * Joins conditional class names together, skipping falsy values.
 * Used instead of pulling in a full clsx+tailwind-merge stack for a project this size.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
