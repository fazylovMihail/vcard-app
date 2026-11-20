import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { languageSelector, setLanguage, toggleLanguage } from "./languageSlice";
import { useCallback, useEffect } from "react";
import { Language } from "./types";

import en from "@/locales/en.json";
import ru from "@/locales/ru.json";

const translations = { en, ru };

export default function useLanguage() {
  const language = useAppSelector(languageSelector);
  const dispatch = useAppDispatch();

  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".");
      let result: any = translations[language];

      for (const k of keys) {
        result = result?.[k];
        if (result === undefined) return key;
      }

      return typeof result === "string" ? result : key;
    },
    [language],
  );

  const setLang = useCallback(
    (lang: Language) => {
      dispatch(setLanguage(lang));
    },
    [dispatch],
  );

  const toggleLang = useCallback(() => {
    dispatch(toggleLanguage());
  }, [dispatch]);

  return {
    t,
    language,
    setLanguage: setLang,
    toggleLanguage: toggleLang,
  };
}
