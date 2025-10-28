export const defaultLocale = 'en-GB';
export const locales = ['en-GB', 'da-DK'] as const;
export type Locale = typeof locales[number];

export const i18nConfig = {
  locales,
  defaultLocale,
  fallbackLng: defaultLocale,
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false, // React already does escaping
  },
  react: {
    useSuspense: false,
  },
};

// Locale detection utilities
export function detectLocale(): Locale {
  // Check localStorage first
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('waitly-locale') as Locale | null;
    if (stored && locales.includes(stored)) {
      return stored;
    }
  }

  // Check browser language
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language;
    
    // Direct match
    if (locales.includes(browserLang as Locale)) {
      return browserLang as Locale;
    }
    
    // Language code match (e.g., 'da' matches 'da-DK')
    const langCode = browserLang.split('-')[0];
    const matchingLocale = locales.find(locale => locale.startsWith(langCode || ''));
    if (matchingLocale) {
      return matchingLocale;
    }
  }

  return defaultLocale;
}

// Locale persistence utilities
export function persistLocale(locale: Locale): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('waitly-locale', locale);
  }
}

export function getPersistedLocale(): Locale | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('waitly-locale') as Locale;
    return stored && locales.includes(stored) ? stored : null;
  }
  return null;
}

// Translation loader with fallback logic
export async function getTranslations(locale: string, namespace: string = 'common') {
  try {
    const translations = await import(`../../public/locales/${locale}/${namespace}.json`);
    return translations.default;
  } catch {
    console.warn(`Failed to load translations for ${locale}/${namespace}, falling back to ${defaultLocale}`);
    
    // Fallback to default locale if translation not found
    if (locale !== defaultLocale) {
      try {
        const fallback = await import(`../../public/locales/${defaultLocale}/${namespace}.json`);
        return fallback.default;
      } catch {
        console.error(`Failed to load fallback translations for ${defaultLocale}/${namespace}`);
        return {};
      }
    }
    return {};
  }
}

// Validate locale
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}