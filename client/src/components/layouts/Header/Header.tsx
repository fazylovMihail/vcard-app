import { Button, Icon } from "@/components/ui";
import { useLanguage, useTheme } from "@/hooks";

import "./Header.scss";

export default function Header() {
  const [theme, toogleTheme] = useTheme();
  const { localized, onToogleLanguage } = useLanguage();

  return (
    <header className="header">
      <div className="container">
        <Button
          classNameParams={{
            modificators: ["btn--theme", theme === "dark" ? "btn--theme-dark" : ""],
          }}
          icon={
            <Icon
              iconId={theme === "dark" ? "icon-moon" : "icon-sun"}
              width={16}
              height={16}
            />
          }
          onClick={toogleTheme}
          aria-label={localized.headerThemeBtnAriaLabel}
        />
        <Button
          classNameParams={{
            modificators: [
              "btn--transparent",
              "btn--language",
              theme === "dark" ? "btn--language-dark" : "",
            ],
          }}
          icon={<Icon iconId="icon-globe" width={40} height={40} />}
          onClick={onToogleLanguage}
          aria-label={localized.headerLanguageBtnAriaLabel}
        />
      </div>
    </header>
  );
}
