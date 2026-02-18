import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple CSS class names using clsx and tailwind-merge.
 * 
 * @param inputs - Class names, objects, or arrays.
 * @returns A combined string of tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const BENGALI_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

/**
 * Converts English numerals to Bengali numerals.
 * 
 * @param num - The number or string to convert.
 * @returns The converted string in Bengali digits.
 */
export function toBengaliNumber(num: number | string): string {
  return num.toString().replace(/\d/g, (digit) => BENGALI_DIGITS[parseInt(digit)]);
}

/**
 * Formats a numeric amount as Bangladeshi Taka with Bengali digits.
 * 
 * @param amount - The amount in Taka.
 * @returns A formatted string like "৳১,৫০০".
 */
export function formatCurrency(amount: number): string {
  const formattedEn = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
  
  return `৳${toBengaliNumber(formattedEn)}`;
}

/**
 * Generates a URL-friendly slug from a string.
 * Supports Latin characters and handles spaces/special symbols.
 * 
 * @param title - The string to convert.
 * @returns A lowercase, hyphenated slug.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-')  // Replace spaces/underscores with -
    .replace(/^-+|-+$/g, '');   // Remove leading/trailing -
}

/**
 * Formats an ISO date string into a readable Bangla date format.
 * 
 * @param dateString - The ISO date string (e.g., "2026-02-15").
 * @returns A formatted string like "১৫ ফেব্রুয়ারি ২০২৬".
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = toBengaliNumber(date.getDate());
  const month = BENGALI_MONTHS[date.getMonth()];
  const year = toBengaliNumber(date.getFullYear());
  
  return `${day} ${month} ${year}`;
}

/**
 * Calculates percentage progress.
 * 
 * @param completed - Number of completed items.
 * @param total - Total number of items.
 * @returns A rounded percentage value (0-100).
 */
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}
