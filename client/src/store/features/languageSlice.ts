import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Language } from "@/localization";

interface LanguageState {
  lng: Language;
}

function getIntitialState(): LanguageState["lng"] {
  if (typeof window !== "undefined") {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage === "en" || savedLanguage === "ru") {
      return savedLanguage;
    }
  }

  return "ru";
}

const initialState: LanguageState = {
  lng: getIntitialState(),
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    toogleLanguage: (state) => {
      state.lng = state.lng === "ru" ? "en" : "ru";
    },
  },
});

export const { toogleLanguage } = languageSlice.actions;
export const languageSelector = (state: RootState) => state.language;

export default languageSlice.reducer;
