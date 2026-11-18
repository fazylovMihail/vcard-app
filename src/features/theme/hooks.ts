"use client";

import { useEffect } from "react";
import { Theme } from "./types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme, themeSelector, toogleTheme } from "./themeSlice";

export function useTheme() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(themeSelector);

  useEffect(() => {
    const rawTheme = localStorage.getItem("theme");
    if (!rawTheme) return;

    try {
      const parsedTheme = JSON.parse(rawTheme) as Theme;
      dispatch(setTheme(parsedTheme));
    } catch {
      console.warn("Не удалось распарсить тему из localStorage");
    }
  }, [dispatch]);

  const toogleThemeHandler = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";

    dispatch(toogleTheme());
    localStorage.setItem("theme", JSON.stringify(nextTheme));
  };

  return [theme, toogleThemeHandler] as const;
}
