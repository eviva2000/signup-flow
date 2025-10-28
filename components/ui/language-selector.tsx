"use client";

import { useLocale, useTranslations } from "@/lib/i18n/use-translations";
import { type Locale } from "@/lib/i18n/config";

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const { locale, setLocale } = useLocale();
  const { t } = useTranslations("signup");

  const getLanguageName = (loc: Locale) => {
    switch (loc) {
      case "en-GB":
        return t("locale.english");
      case "da-DK":
        return t("locale.danish");
      default:
        return loc;
    }
  };

  const toggleLanguage = () => {
    const newLocale = locale === "en-GB" ? "da-DK" : "en-GB";
    setLocale(newLocale);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors ${className}`}
      aria-label={`Switch to ${locale === "en-GB" ? "Danish" : "English"}`}
    >
      {/* Globe Icon */}
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
      
      {/* Language Name */}
      <span className="text-sm font-medium">
        {getLanguageName(locale)}
      </span>
    </button>
  );
}