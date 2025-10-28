"use client";

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";
import {
  type Locale,
  defaultLocale,
  detectLocale,
  persistLocale,
  getPersistedLocale,
} from "./config";

interface Translations {
  [key: string]: string | Translations;
}

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    return getPersistedLocale() || detectLocale();
  });
  const [isLoading, setIsLoading] = useState(false);

  const setLocale = useCallback((newLocale: Locale) => {
    setIsLoading(true);
    setLocaleState(newLocale);
    persistLocale(newLocale);
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, isLoading }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

export function useTranslations(namespace: string = "common") {
  const { locale } = useLocale();
  const [translations, setTranslations] = useState<Translations>({});
  const [fallbackTranslations, setFallbackTranslations] =
    useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTranslations() {
      try {
        setIsLoading(true);

        const response = await fetch(`/locales/${locale}/${namespace}.json`);
        let primaryTranslations = {};

        if (response.ok) {
          primaryTranslations = await response.json();
          setTranslations(primaryTranslations);
        }

        if (locale !== defaultLocale) {
          const fallbackResponse = await fetch(
            `/locales/${defaultLocale}/${namespace}.json`
          );
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setFallbackTranslations(fallbackData);

            if (!response.ok) {
              setTranslations(fallbackData);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load translations:", error);

        if (locale !== defaultLocale) {
          try {
            const fallbackResponse = await fetch(
              `/locales/${defaultLocale}/${namespace}.json`
            );
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json();
              setTranslations(fallbackData);
              setFallbackTranslations(fallbackData);
            }
          } catch (fallbackError) {
            console.error(
              "Failed to load fallback translations:",
              fallbackError
            );
          }
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadTranslations();
  }, [locale, namespace]);

  const t = useCallback(
    (
      key: string,
      interpolationOrFallback?: string | Record<string, string | number>,
      fallback?: string
    ): string => {
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

      if (typeof value !== "string" && locale !== defaultLocale) {
        let fallbackValue: string | Translations | undefined =
          fallbackTranslations;
        for (const k of keys) {
          if (typeof fallbackValue === "object" && fallbackValue !== null) {
            fallbackValue = fallbackValue[k];
          } else {
            fallbackValue = undefined;
            break;
          }
        }
        if (typeof fallbackValue === "string") {
          value = fallbackValue;
        }
      }

      // Handle parameters - if second param is string, it's fallback, if object, it's interpolation
      let interpolation: Record<string, string | number> | undefined;
      let actualFallback: string | undefined;

      if (typeof interpolationOrFallback === "string") {
        actualFallback = interpolationOrFallback;
      } else if (typeof interpolationOrFallback === "object") {
        interpolation = interpolationOrFallback;
        actualFallback = fallback;
      }

      let result = typeof value === "string" ? value : actualFallback || key;

      if (interpolation && typeof result === "string") {
        Object.entries(interpolation).forEach(([placeholder, replacement]) => {
          result = result.replace(
            new RegExp(`{{${placeholder}}}`, "g"),
            String(replacement)
          );
        });
      }

      return result;
    },
    [translations, fallbackTranslations, locale]
  );

  return { t, isLoading, locale };
}

export function useSignupTranslations() {
  return useTranslations("signup");
}

export function useCommonTranslations() {
  return useTranslations("common");
}
