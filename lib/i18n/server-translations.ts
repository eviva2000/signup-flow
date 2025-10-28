import { type Locale, defaultLocale } from './config';

// Server-side translation loader
export async function getServerTranslations(locale: Locale, namespace: string = 'common'): Promise<Record<string, unknown>> {
  try {
    const translations = await import(`../../public/locales/${locale}/${namespace}.json`);
    return translations.default;
  } catch {
    console.warn(`Failed to load server translations for ${locale}/${namespace}, falling back to ${defaultLocale}`);
    
    // Fallback to default locale if translation not found
    if (locale !== defaultLocale) {
      try {
        const fallback = await import(`../../public/locales/${defaultLocale}/${namespace}.json`);
        return fallback.default;
      } catch {
        console.error(`Failed to load fallback server translations for ${defaultLocale}/${namespace}`);
        return {};
      }
    }
    return {};
  }
}

// Create a translation function for server components
export function createServerTranslator(translations: Record<string, unknown>, fallbackTranslations?: Record<string, unknown>) {
  return function t(key: string, fallback?: string, interpolation?: Record<string, string | number>): string {
    const keys = key.split('.');
    
    // Try to get value from primary translations
    let value: unknown = translations;
    for (const k of keys) {
      if (typeof value === 'object' && value !== null) {
        value = (value as Record<string, unknown>)[k];
      } else {
        value = undefined;
        break;
      }
    }

    // If not found in primary, try fallback translations
    if (typeof value !== 'string' && fallbackTranslations) {
      let fallbackValue: unknown = fallbackTranslations;
      for (const k of keys) {
        if (typeof fallbackValue === 'object' && fallbackValue !== null) {
          fallbackValue = (fallbackValue as Record<string, unknown>)[k];
        } else {
          fallbackValue = undefined;
          break;
        }
      }
      if (typeof fallbackValue === 'string') {
        value = fallbackValue;
      }
    }

    // Return the found value or fallback
    let result = typeof value === 'string' ? value : fallback || key;

    // Handle interpolation
    if (interpolation && typeof result === 'string') {
      Object.entries(interpolation).forEach(([placeholder, replacement]) => {
        result = result.replace(new RegExp(`{{${placeholder}}}`, 'g'), String(replacement));
      });
    }

    return result;
  };
}