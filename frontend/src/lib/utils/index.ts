import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ─── Class Name Helper ────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Currency Formatter ───────────────────────────────────────────────────────
export function formatIDR(amount: number, short = false): string {
  if (short) {
    if (amount >= 1_000_000) return `Rp${(amount / 1_000_000).toFixed(1)}jt`;
    if (amount >= 1_000) return `Rp${(amount / 1_000).toFixed(0)}rb`;
    return `Rp${amount}`;
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Speed Formatter ──────────────────────────────────────────────────────────
export function formatSpeed(mbps: number): string {
  if (mbps >= 1000) return `${mbps / 1000} Gbps`;
  return `${mbps} Mbps`;
}

// ─── Rating to Stars ──────────────────────────────────────────────────────────
export function ratingToStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// ─── Slug Generator ───────────────────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// ─── Contract Label ───────────────────────────────────────────────────────────
export function contractLabel(months: number): string {
  if (months === 0) return 'Tanpa Kontrak';
  if (months === 1) return '1 Bulan';
  if (months === 12) return '1 Tahun';
  if (months === 24) return '2 Tahun';
  return `${months} Bulan`;
}

// ─── Truncate Text ────────────────────────────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

// ─── Date Formatter ───────────────────────────────────────────────────────────
export function formatDate(dateStr: string, format: 'short' | 'long' | 'relative' = 'short'): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (format === 'relative') {
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
    return `${Math.floor(diffDays / 365)} tahun lalu`;
  }

  if (format === 'long') {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Provider Color Map ───────────────────────────────────────────────────────
export const providerColors: Record<string, { bg: string; text: string }> = {
  indihome:   { bg: 'from-red-500 to-red-700',     text: '#EF4444' },
  biznet:     { bg: 'from-blue-600 to-blue-800',    text: '#2563EB' },
  myrepublic: { bg: 'from-emerald-500 to-teal-700', text: '#10B981' },
  firstmedia: { bg: 'from-violet-600 to-purple-800',text: '#7C3AED' },
  xlhome:     { bg: 'from-sky-500 to-cyan-700',     text: '#0EA5E9' },
  default:    { bg: 'from-gray-600 to-gray-800',    text: '#6B7280' },
};

export function getProviderColor(slug: string) {
  return providerColors[slug] ?? providerColors.default;
}

// ─── Read Time Estimator ──────────────────────────────────────────────────────
export function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

// ─── Category color ───────────────────────────────────────────────────────────
export const categoryColors: Record<string, string> = {
  basic:    'bg-gray-100 text-gray-700',
  standard: 'bg-blue-100 text-blue-700',
  premium:  'bg-violet-100 text-violet-700',
  gaming:   'bg-green-100 text-green-700',
  business: 'bg-amber-100 text-amber-700',
};

// ─── Debounce ─────────────────────────────────────────────────────────────────
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
