"use client";

import { Button } from "@/components/ui";
import { useTheme } from "@/features/theme/hooks";

export default function Header() {
  const [theme, toogleTheme] = useTheme();
  const isLight = theme === "light";

  return (
    <header>
      <div className="container">
        <h2 className="font-bold text-[18px] mb-2">Фазылов Михаил</h2>
        <p className="mb-4">full-stack developer</p>
        <div className="flex items-center gap-4">
          <Button
            variant={{ header: "theme", isLight: isLight }}
            type="button"
            onClick={toogleTheme}
            aria-label={
              isLight ? "Включить темную тему" : "Включить светлую тему"
            }
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
          <Button variant={{ header: "language", isLight }}>
            <svg className="w-10 h-10">
              <use xlinkHref="/sprite.svg#icon-globe" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
}
