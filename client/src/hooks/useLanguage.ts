import localization, { Language } from "@/localization";
import { useAppDispatch, useAppSelector } from "@/store";
import { languageSelector, toogleLanguage } from "@/store/features/languageSlice";
import { useEffect } from "react";

function getLocalized(lng: Language) {
  const entries = Object.entries(localization).map(([key, value]) => [key, value[lng]]);

  return Object.fromEntries(entries) as Record<keyof typeof localization, string>;
}

export default function useLanguage() {
  const language = useAppSelector(languageSelector);
  const dispatch = useAppDispatch();

  const localized = getLocalized(language.lng);

  useEffect(() => {
    localStorage.setItem("language", language.lng);
  }, [language.lng]);

  return {
    language: language.lng,
    localized,
    onToogleLanguage: () => dispatch(toogleLanguage()),
  };
}
