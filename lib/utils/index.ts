export { cn } from './cn';

// Email validation utility
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Country list utility
export const COUNTRIES = [
  { code: 'DK', name: 'Denmark', nameDA: 'Danmark' },
  { code: 'SE', name: 'Sweden', nameDA: 'Sverige' },
  { code: 'NO', name: 'Norway', nameDA: 'Norge' },
  { code: 'DE', name: 'Germany', nameDA: 'Tyskland' },
  { code: 'GB', name: 'United Kingdom', nameDA: 'Storbritannien' },
  { code: 'US', name: 'United States', nameDA: 'USA' },
  // Add more countries as needed
] as const;

export type CountryCode = typeof COUNTRIES[number]['code'];