"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { safeLocalStorage } from "@/lib/hooks/useLocalStorage";
import { t, translate } from "@/lib/translations";

export type Language = "en" | "am" | "or";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  getLanguageDisplayName: (lang: Language) => string;
  t: (key: string, replacements?: Record<string, string>) => string;
  translate: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const LANGUAGE_STORAGE_KEY = "triple-tech-language";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = safeLocalStorage.getItem(
      LANGUAGE_STORAGE_KEY,
      "en",
    ) as Language;
    setLanguageState(savedLanguage);
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    safeLocalStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
  };

  const getLanguageDisplayName = (lang: Language): string => {
    switch (lang) {
      case "en":
        return "English";
      case "am":
        return "አማርኛ";
      case "or":
        return "Oromiffa";
      default:
        return "English";
    }
  };

  const translateFn = (key: string, replacements?: Record<string, string>): string => {
    return t(key, language, replacements);
  };

  const translateSimple = (key: string): string => {
    return translate(key, language);
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, getLanguageDisplayName, t: translateFn, translate: translateSimple }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
