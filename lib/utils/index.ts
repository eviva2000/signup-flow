export { cn } from './cn';
export * from './data-helpers';
export * from './verification';
export * from './consent';

// Email validation utility with comprehensive checks
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  // Additional checks
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  
  const localPart = parts[0];
  const domain = parts[1];
  
  if (!localPart || !domain) return false;
  
  // Local part checks
  if (localPart.length === 0 || localPart.length > 64) return false;
  if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
  if (localPart.includes('..')) return false;
  
  // Domain checks
  if (domain.length === 0 || domain.length > 253) return false;
  if (domain.startsWith('.') || domain.endsWith('.')) return false;
  if (domain.includes('..')) return false;
  
  return true;
}

// Normalize email for consistent storage and comparison
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// Country list utility with comprehensive European and international coverage
export const COUNTRIES = [
  // Nordic countries (primary focus for Waitly)
  { code: 'DK', name: 'Denmark', nameDA: 'Danmark' },
  { code: 'SE', name: 'Sweden', nameDA: 'Sverige' },
  { code: 'NO', name: 'Norway', nameDA: 'Norge' },
  { code: 'FI', name: 'Finland', nameDA: 'Finland' },
  { code: 'IS', name: 'Iceland', nameDA: 'Island' },
  
  // Major European countries
  { code: 'DE', name: 'Germany', nameDA: 'Tyskland' },
  { code: 'GB', name: 'United Kingdom', nameDA: 'Storbritannien' },
  { code: 'FR', name: 'France', nameDA: 'Frankrig' },
  { code: 'NL', name: 'Netherlands', nameDA: 'Holland' },
  { code: 'BE', name: 'Belgium', nameDA: 'Belgien' },
  { code: 'AT', name: 'Austria', nameDA: 'Østrig' },
  { code: 'CH', name: 'Switzerland', nameDA: 'Schweiz' },
  { code: 'IT', name: 'Italy', nameDA: 'Italien' },
  { code: 'ES', name: 'Spain', nameDA: 'Spanien' },
  { code: 'PT', name: 'Portugal', nameDA: 'Portugal' },
  { code: 'PL', name: 'Poland', nameDA: 'Polen' },
  { code: 'CZ', name: 'Czech Republic', nameDA: 'Tjekkiet' },
  
  // International
  { code: 'US', name: 'United States', nameDA: 'USA' },
  { code: 'CA', name: 'Canada', nameDA: 'Canada' },
  { code: 'AU', name: 'Australia', nameDA: 'Australien' },
] as const;

export type CountryCode = typeof COUNTRIES[number]['code'];

// Country management utilities
export function getCountryByCode(code: string): typeof COUNTRIES[number] | undefined {
  return COUNTRIES.find(country => country.code === code);
}

export function getCountryName(code: string, locale: 'da-DK' | 'en-GB' = 'en-GB'): string {
  const country = getCountryByCode(code);
  if (!country) return code;
  
  return locale === 'da-DK' ? country.nameDA : country.name;
}

export function getCountriesForLocale(locale: 'da-DK' | 'en-GB' = 'en-GB') {
  return COUNTRIES.map(country => ({
    code: country.code,
    name: locale === 'da-DK' ? country.nameDA : country.name,
  }));
}