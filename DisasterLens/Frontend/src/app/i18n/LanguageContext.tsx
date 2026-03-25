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
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLanguage: () => {},
  t: (key) => key,
  d: (en) => en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const toggleLanguage = () => setLang((prev) => (prev === "en" ? "bn" : "en"));

  const t = (key: string, params?: Record<string, string | number>) => {
    const translationObj = translations[lang] as Record<string, string>;
    let text = translationObj[key] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{{${k}}}`, String(v));
      });
    }
    return text;
  };

  const d = (en: string, bn: string) => (lang === "en" ? en : bn);

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t, d }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
