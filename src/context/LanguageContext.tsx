import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { languages, LanguageKey } from "../i18n";

type LanguageContextType = {
  lang: LanguageKey;
  t: (key: string) => string; // ✅ FIX HERE
  setLang: (l: LanguageKey) => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: any }) {
  const [lang, setLangState] = useState<LanguageKey>("en");

  useEffect(() => {
    AsyncStorage.getItem("APP_LANG").then(saved => {
      if (saved === "ur" || saved === "en") {
        setLangState(saved);
      }
    });
  }, []);

  const setLang = async (l: LanguageKey) => {
    setLangState(l);
    await AsyncStorage.setItem("APP_LANG", l);
  };

  const t = (key: string) => {
    const dict = languages[lang] as Record<string, string>;
    return dict[key] ?? key; // fallback safe
  };

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLang must be used inside LanguageProvider");
  }
  return ctx;
}
