"use client";

import { ReactNode, useEffect } from "react";
import { useTheme } from "./hooks";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme] = useTheme();

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
}
