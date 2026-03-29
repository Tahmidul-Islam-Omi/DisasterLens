import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations } from "./translations";

type Language = "en" | "bn";

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  /** Look up a translation key, with optional {{param}} interpolation. */
  t: (key: string, params?: Record<string, string | number>) => string;
  /** Display a dynamic data value in the current language. */
  d: (en: string, bn: string) => string;
  /** Convert English numerals to Bangla numerals when language is Bangla. */
  bnenconvert: (value: string | number) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLanguage: () => {},
  t: (key) => key,
  d: (en) => en,
  bnenconvert: (value) => String(value),
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const saved = window.localStorage.getItem("resilienceai_lang");
    return saved === "bn" || saved === "en" ? saved : "en";
  });

  const bnenconvert = (value: string | number): string => {
    const text = String(value);
    if (lang !== 'bn') {
      return text;
    }

    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return text.replace(/\d/g, (digit) => bnDigits[Number(digit)]);
  };

  const toggleLanguage = () => setLang((prev) => (prev === "en" ? "bn" : "en"));

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("resilienceai_lang", lang);
    }
  }, [lang]);

  const getByPath = (obj: unknown, keyPath: string): string | undefined => {
    if (!obj || typeof obj !== "object") {
      return undefined;
    }

    const direct = (obj as Record<string, unknown>)[keyPath];
    if (typeof direct === "string") {
      return direct;
    }

    const value = keyPath
      .split(".")
      .reduce<unknown>((acc, part) => {
        if (!acc || typeof acc !== "object") {
          return undefined;
        }
        return (acc as Record<string, unknown>)[part];
      }, obj);

    return typeof value === "string" ? value : undefined;
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    const translationObj = translations[lang];
    const fallbackObj = translations.en;
    let text = getByPath(translationObj, key) ?? getByPath(fallbackObj, key) ?? key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replaceAll(`{{${k}}}`, bnenconvert(v));
      });
    }
    return text;
  };

  const d = (en: string, bn: string) => {
    const enValue = String(en || "").trim();
    const bnValue = String(bn || "").trim();

    if (lang === "en") {
      return bnenconvert(enValue || bnValue);
    }

    return bnenconvert(bnValue || enValue);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t, d, bnenconvert }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
