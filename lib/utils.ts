import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { categories } from "./categories"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-GH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function getCategoryLabel(category: string): string {
  return categories[category as keyof typeof categories]?.label || category;
}

export function getCategoryIcon(category: string): string {
  return categories[category as keyof typeof categories]?.icon || '📦';
}