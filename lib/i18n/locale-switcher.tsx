"use client";

import { useLocale, useTranslations } from "./use-translations";
import { type Locale, locales } from "./config";

interface LocaleSwitcherProps {
  className?: string;
}

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const { locale, setLocale } = useLocale();
  const { t } = useTranslations("signup");

  const getLanguageName = (loc: Locale) => {
    switch (loc) {
      case 'en-GB':
        return t('locale.english');
      case 'da-DK':
        return t('locale.danish');
      default:
        return loc;
    }
  };

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale !== locale) {
      setLocale(newLocale);
    }
  };

  return (
    <div className={className}>
      <select
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value as Locale)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label="Select language"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {getLanguageName(loc)}
          </option>
        ))}
      </select>
    </div>
  );
}

// Simple button-based locale switcher
export function LocaleToggle({ className }: LocaleSwitcherProps) {
  const { locale, setLocale } = useLocale();
  const { t } = useTranslations("signup");

  const otherLocale = locale === 'en-GB' ? 'da-DK' : 'en-GB';
  const otherLanguageName = otherLocale === 'en-GB' ? t('locale.english') : t('locale.danish');

  // Type-safe translation with interpolation
  const tWithInterpolation = (key: string, interpolation: Record<string, string | number>) => {
    return (t as any)(key, interpolation);
  };

  const switchText = tWithInterpolation('locale.switchTo', { language: otherLanguageName });

  return (
    <button
      onClick={() => setLocale(otherLocale)}
      className={`text-sm text-blue-600 hover:text-blue-800 underline ${className}`}
      aria-label={switchText}
    >
      {switchText}
    </button>
  );
}