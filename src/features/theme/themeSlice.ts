import { createSlice } from "@reduxjs/toolkit";
import { Theme, ThemeState } from "./types";
import { RootState } from "@/store";

const initialState: ThemeState = {
  theme: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toogleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme: (state, action: { payload: Theme }) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme, toogleTheme } = themeSlice.actions;
export const themeSelector = (state: RootState) => state.theme.theme;
export default themeSlice;
