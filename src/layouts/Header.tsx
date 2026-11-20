"use client";

import { Button } from "@/components/ui";
import useLanguage from "@/features/language/useLanguage";
import useTheme from "@/features/theme/useTheme";

export default function Header() {
  const { t, toggleLanguage } = useLanguage();
  const [theme, toggleTheme] = useTheme();
  const isLight = theme === "light";

  return (
    <header>
      <div className="container">
        <h2 className="font-bold text-[18px] mb-2">{t("header.title")}</h2>
        <p className="mb-4">full-stack developer</p>
        <div className="flex items-center gap-4">
          <Button
            variant={{ header: "theme", isLight: isLight }}
            type="button"
            onClick={toggleTheme}
            aria-label={t("header.themeSwitchAriaLabel")}
          >
            <span
              className={`w-7.5 h-7.5 p-1.5 border rounded-full flex transition duration-300 ease-in-out ${isLight ? "translate-x-0 bg-beige border-transport-blue" : "-translate-x-7.5 bg-transport-blue border-crayola"}`}
            >
              <svg className="w-4 h-4">
                <use
                  xlinkHref={
                    isLight ? "/sprite.svg#icon-sun" : "/sprite.svg#icon-moon"
                  }
                />
              </svg>
            </span>
          </Button>
          <Button
            variant={{ header: "language", isLight }}
            aria-label={t("header.languageSwitchAriaLabel")}
            onClick={toggleLanguage}
          >
            <svg className="w-10 h-10">
              <use xlinkHref="/sprite.svg#icon-globe" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
}
