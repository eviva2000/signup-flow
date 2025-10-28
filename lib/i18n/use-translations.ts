"use client";

import { useState, useEffect } from "react";
import { type Locale, defaultLocale } from "./config";

interface Translations {
  [key: string]: string | Translations;
}

export function useTranslations(
  namespace: string = "common",
  locale: Locale = defaultLocale
) {
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTranslations() {
      try {
        setIsLoading(true);
        const response = await fetch(`/locales/${locale}/${namespace}.json`);
        if (response.ok) {
          const data = await response.json();
          setTranslations(data);
        } else if (locale !== defaultLocale) {
          // Fallback to default locale
          const fallbackResponse = await fetch(
            `/locales/${defaultLocale}/${namespace}.json`
          );
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setTranslations(fallbackData);
          }
        }
      } catch (error) {
        console.error("Failed to load translations:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTranslations();
  }, [locale, namespace]);

  const t = (key: string, fallback?: string): string => {
    const keys = key.split(".");
    let value: string | Translations | undefined = translations;

    for (const k of keys) {
      if (typeof value === "object" && value !== null) {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }

    return typeof value === "string" ? value : fallback || key;
  };

  return { t, isLoading };
}
