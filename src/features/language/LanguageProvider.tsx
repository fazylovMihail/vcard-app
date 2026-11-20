"use client";

import { ReactNode, useEffect } from "react";
import useLanguage from "./useLanguage";

export default function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { language } = useLanguage();

  useEffect(() => {
    document.body.lang = language;
  }, [language]);

  return <>{children}</>;
}
