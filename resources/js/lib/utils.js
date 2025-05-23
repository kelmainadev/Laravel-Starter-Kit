/**
 * Combines multiple class names into a single string, handling undefined, null, and falsy values.
 * This is a simple version of the clsx/classnames libraries.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
} 