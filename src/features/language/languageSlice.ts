import { createSlice } from "@reduxjs/toolkit";
import { Language, LanguageState } from "./types";
import { RootState } from "@/store";

const initialState: LanguageState = {
  language: "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      state.language = state.language === "en" ? "ru" : "en";
    },
    setLanguage: (state, action: { payload: Language }) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export const languageSelector = (state: RootState) => state.language.language;
export default languageSlice;
