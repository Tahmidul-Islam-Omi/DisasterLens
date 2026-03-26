import { createContext, useContext, useState, ReactNode } from "react";
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
  const [lang, setLang] = useState<Language>("en");

  const bnenconvert = (value: string | number): string => {
    const text = String(value);
    if (lang !== 'bn') {
      return text;
    }

    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return text.replace(/\d/g, (digit) => bnDigits[Number(digit)]);
  };

  const toggleLanguage = () => setLang((prev) => (prev === "en" ? "bn" : "en"));

  const t = (key: string, params?: Record<string, string | number>) => {
    const translationObj = translations[lang] as Record<string, string>;
    let text = translationObj[key] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{{${k}}}`, bnenconvert(v));
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
