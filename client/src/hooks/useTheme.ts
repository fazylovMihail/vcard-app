import { useAppDispatch, useAppSelector } from "@/store";
import { themeSelector, toogleTheme } from "@/store/features/themeSlice";
import { useEffect } from "react";

export default function useTheme() {
  const theme = useAppSelector(themeSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.body.classList.toggle("dark", theme.mode === "dark");
    localStorage.setItem("theme", theme.mode);
  }, [theme.mode]);

  return [theme.mode, () => dispatch(toogleTheme())] as const;
}
