import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ThemeState {
  mode: "dark" | "light";
}

function getIntitialState(): ThemeState["mode"] {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }
  }

  return "light";
}

const initialState = {
  mode: getIntitialState(),
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toogleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
  },
});

export const { toogleTheme } = themeSlice.actions;
export const themeSelector = (state: RootState) => state.theme;

export default themeSlice.reducer;
