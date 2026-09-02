export type Language = "en" | "ru";

export interface KeyLocalization {
  ru: string;
  en: string;
}

const localization: Record<string, KeyLocalization> = {
  headerThemeBtnAriaLabel: {
    ru: "Сменить тему",
    en: "Toggle theme",
  },
  headerLanguageBtnAriaLabel: {
    ru: "Сменить язык",
    en: "Toggle language",
  },
};

export default localization;
