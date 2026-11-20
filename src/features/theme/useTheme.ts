"use client";

import { useCallback, useEffect } from "react";
import { Theme } from "./types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme, themeSelector, toggleTheme } from "./themeSlice";

export default function useTheme() {
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

  const toggleThemeHandler = useCallback(() => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";

    dispatch(toggleTheme());
    localStorage.setItem("theme", JSON.stringify(nextTheme));
  }, [theme, dispatch]);

  return [theme, toggleThemeHandler] as const;
}
