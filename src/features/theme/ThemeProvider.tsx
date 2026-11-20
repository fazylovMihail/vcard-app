"use client";

import { ReactNode, useEffect } from "react";
import useTheme from "./useTheme";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme] = useTheme();

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
}
