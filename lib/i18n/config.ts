export const defaultLocale = 'en-GB';
export const locales = ['en-GB', 'da-DK'] as const;
export type Locale = typeof locales[number];

// Simple translation loader for App Router
export async function getTranslations(locale: string, namespace: string = 'common') {
  try {
    const translations = await import(`../../public/locales/${locale}/${namespace}.json`);
    return translations.default;
  } catch {
    // Fallback to English if translation not found
    if (locale !== defaultLocale) {
      const fallback = await import(`../../public/locales/${defaultLocale}/${namespace}.json`);
      return fallback.default;
    }
    return {};
  }
}