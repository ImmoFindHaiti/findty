import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrix(prix) {
  return '$' + prix.toLocaleString('en-US');
}
